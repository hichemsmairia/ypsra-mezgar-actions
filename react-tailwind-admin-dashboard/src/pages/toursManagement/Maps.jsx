import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const defaultPosition = [36.727945, 9.1955781];

const DraggableMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
          }
        },
      }}
      ref={markerRef}
    />
  );
};

const FlyToPosition = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15);
  }, [position, map]);
  return null;
};

const MapWithSearchLeaflet = ({ onLocalisationChange }) => {
  const [position, setPosition] = useState(defaultPosition);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef();

  const handleSearch = async (searchText) => {
    if (!searchText) return;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchText
      )}`
    );
    const data = await response.json();
    setResults(data);
  };

  const onChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const selectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setPosition([lat, lon]);
    onLocalisationChange(lat, lon);
    setQuery(place.display_name);
    setResults([]);
  };

  useEffect(() => {
    onLocalisationChange(position[0], position[1]);
  }, [position]);

  return (
    <div className=" max-h-60">
      <div className="relative max-h-10">
        <input
          type="text"
          placeholder="Rechercher une adresse..."
          value={query}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white/90 dark:focus:ring-blue-500/50 transition-colors"
        />
        {results.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.map((place) => (
              <li
                key={place.place_id}
                onClick={() => selectSuggestion(place)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="min-h-[40vh] rounded-lg max-h-30 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "40vh", width: "100%" }}
          className="dark:invert-90 dark:hue-rotate-180"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToPosition position={position} />
          <DraggableMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Position sélectionnée: Latitude {position[0].toFixed(6)}, Longitude{" "}
          {position[1].toFixed(6)}
        </p>
      </div>
    </div>
  );
};

export default MapWithSearchLeaflet;
