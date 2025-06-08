// owner
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Définir une interface pour les données de visite (maintenant agrégées)
interface PositionVisitCount {
  lat: number;
  lng: number;
  count: number;
  tourId: string; // tourId représente ici le nom de la région ou le point d'intérêt agrégé
}

interface RegionVisitMapProps {
  visitData: PositionVisitCount[];
}

const RegionVisitMap: React.FC<RegionVisitMapProps> = ({ visitData }) => {
  console.log(visitData);
  const tunisiaCenter: [number, number] = [34.0, 9.0];

  const getMarkerIcon = (count: number) => {
    let size = 25;
    if (count > 50) size = 40;
    else if (count > 20) size = 35;
    else if (count > 10) size = 30;

    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconSize: [size, size * 1.5],
      iconAnchor: [size / 2, size * 1.5],
      popupAnchor: [0, -size * 1.5],
    });
  };

  return (
    <MapContainer
      center={tunisiaCenter}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visitData.map((data, index) => (
        <Marker
          key={data.tourId || `${data.lat}-${data.lng}-${index}`} // Utiliser tourId ou lat/lng unique
          position={[data.lat, data.lng]}
          icon={getMarkerIcon(data.count)}
        >
          <Popup>
            <strong className="text-gray-800 dark:text-white">
              {data.tourId || `Point d'intérêt agrégé`}
            </strong>
            <br />
            <span className="text-gray-600 dark:text-gray-300">
              {data.count} visite{data.count > 1 ? "s" : ""}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RegionVisitMap;
