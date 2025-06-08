import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { fetchTours } from "../../services/TourServices.js";
import RegionVisitMap from "../visiteOwner/RegionVisitMapOwner";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface RawPositionVisitCount {
  lat: number;
  lng: number;
  count: number;
  tourId: string;
}

interface AggregatedVisitData {
  lat: number;
  lng: number;
  count: number;
  tourId: string;
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [allRawVisitData, setAllRawVisitData] = useState<
    RawPositionVisitCount[]
  >([]);
  const [tours, setTours] = useState<any[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useSelector((state) => state.auth);

  // 🟡 Load tours
  useEffect(() => {
    const handleGetToursNames = async () => {
      try {
        const result = await fetchTours();
        const filteredTours = result.filter(
          (tour: any) => tour.responsableId === user.id
        );
        setTours(filteredTours);
        if (filteredTours.length > 0) {
          setSelectedTourId(filteredTours[0].id); // ✅ Fix: ensure data is set after state is updated
        }
      } catch (e) {
        console.error("Failed to fetch tours", e);
      }
    };
    handleGetToursNames();
  }, [user]);

  // 🟡 Load visit data
  useEffect(() => {
    const fetchAllVisitData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/visitors/positions"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const rawData: RawPositionVisitCount[] = await response.json();

        const validData = rawData.filter(
          (item) =>
            item.lat >= 30 && item.lat <= 38 && item.lng >= 7 && item.lng <= 12
        );
        setAllRawVisitData(validData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVisitData();
  }, []);

  const aggregatedVisitData = useMemo(() => {
    if (loading) return [];

    let dataToAggregate = allRawVisitData;
    if (selectedTourId !== "all") {
      dataToAggregate = allRawVisitData.filter(
        (item) => item.tourId === selectedTourId
      );
    }

    const aggregatedMap = new Map<string, AggregatedVisitData>();

    dataToAggregate.forEach((item) => {
      const roundedLat = item.lat.toFixed(2);
      const roundedLng = item.lng.toFixed(2);
      const key = item.tourId || `${roundedLat},${roundedLng}`;

      if (aggregatedMap.has(key)) {
        const existing = aggregatedMap.get(key)!;
        existing.count += item.count;
        if (item.tourId) {
          existing.lat = (existing.lat + item.lat) / 2;
          existing.lng = (existing.lng + item.lng) / 2;
        }
      } else {
        aggregatedMap.set(key, {
          lat: item.lat,
          lng: item.lng,
          count: item.count,
          tourId: item.tourId || `Zone ${roundedLat}, ${roundedLng}`,
        });
      }
    });

    return Array.from(aggregatedMap.values());
  }, [allRawVisitData, selectedTourId, loading]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-white/90">
          Nombre de visites par lieux pour votre tour
        </h3>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div id="mapOne" className="h-[300px] w-full">
          {loading && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Chargement de la carte des visites...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-center">
              Erreur lors du chargement des données : {error}
            </p>
          )}
          {!loading && !error && aggregatedVisitData.length > 0 ? (
            <RegionVisitMap visitData={aggregatedVisitData} />
          ) : (
            !loading &&
            !error && (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Aucune donnée de visite disponible pour le moment.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
