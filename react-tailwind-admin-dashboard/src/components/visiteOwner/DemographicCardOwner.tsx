import { useState, useEffect, useMemo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import RegionVisitMap from "../visiteOwner/RegionVisitMapOwner";
import { fetchTours } from "../../services/TourServices.js";
import { useSelector } from "react-redux";
import { getVisitorsPositions } from "../../services/visitServices.js";
// Interfaces
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
  const [aggregatedVisitData, setAggregatedVisitData] = useState<
    AggregatedVisitData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string>("all");
  const [tours, setTours] = useState<any[]>([]);

  const { user } = useSelector((state: any) => state.auth);

  const handleGetToursNames = async () => {
    const result: any = await fetchTours();
    setTours(result.filter((el: any) => el.ownerId === user.id));
  };

  useEffect(() => {
    handleGetToursNames();
  }, []);

  useEffect(() => {
    async function fetchAllVisitData() {
      try {
        const response = await getVisitorsPositions()
        if (!response)
          throw new Error(`HTTP error! status: ${response}`);
        const rawData: RawPositionVisitCount[] = response
        const validData = rawData.filter(
          (item) =>
            item.lat >= 30.0 &&
            item.lat <= 38.0 &&
            item.lng >= 7.0 &&
            item.lng <= 12.0
        );
        setAllRawVisitData(validData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllVisitData();
  }, []);

  useEffect(() => {
    if (loading) return;

    let dataToAggregate =
      selectedTourId !== "all"
        ? allRawVisitData.filter((item) => item.tourId === selectedTourId)
        : allRawVisitData;

    const aggregatedMap = new Map<string, AggregatedVisitData>();

    dataToAggregate.forEach((item) => {
      const roundedLat = item.lat.toFixed(2);
      const roundedLng = item.lng.toFixed(2);
      const aggregationKey = item.tourId || `${roundedLat},${roundedLng}`;

      if (aggregatedMap.has(aggregationKey)) {
        const existingData = aggregatedMap.get(aggregationKey)!;
        existingData.count += item.count;
        if (item.tourId) {
          existingData.lat = (existingData.lat + item.lat) / 2;
          existingData.lng = (existingData.lng + item.lng) / 2;
        }
      } else {
        aggregatedMap.set(aggregationKey, {
          lat: item.lat,
          lng: item.lng,
          count: item.count,
          tourId: item.tourId || `Zone ${roundedLat}, ${roundedLng}`,
        });
      }
    });

    setAggregatedVisitData(Array.from(aggregatedMap.values()));
  }, [allRawVisitData, selectedTourId, loading]);

  const uniqueTourIds = useMemo(() => {
    // First get all valid tour IDs from the user's tours
    const userTourIds = new Set(tours.map((t) => t.id));

    // Then find which of these exist in visit data
    const idsWithVisits = new Set<string>();
    allRawVisitData.forEach((item) => {
      if (item.tourId && userTourIds.has(item.tourId)) {
        idsWithVisits.add(item.tourId);
      }
    });

    // Always include "all" and all user's tours (even if no visits yet)
    return ["all", ...Array.from(userTourIds)];
  }, [allRawVisitData, tours]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleTourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTourId(event.target.value);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Nombre de visites par lieux
        </h3>
        <div className="relative inline-block">
          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem onItemClick={closeDropdown}>Voir Plus</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Supprimer</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div className="mb-4 flex justify-start">
          <label htmlFor="tour-select" className="sr-only">
            Filtrer par Tour
          </label>
          <select
            id="tour-select"
            value={selectedTourId}
            onChange={handleTourChange}
            className="block w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Tous les tours</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.tourName}
              </option>
            ))}
          </select>
        </div>

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
