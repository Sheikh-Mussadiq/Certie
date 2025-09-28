import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Loader2, LocateFixed, Search } from "lucide-react";

// Fix for default marker icon in React-Leaflet
// We need to redefine the default icon as it looks for assets in the wrong path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component to update map view when coordinates change
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

// Component to search and set marker based on address
const SearchControl = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  searchResults,
  selectResult,
}) => {
  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-left">
        <div className="leaflet-control bg-transparent w-80">
          <form
            onSubmit={handleSearch}
            className="relative shadow-sm rounded-lg"
            onDoubleClickCapture={(e) => e.stopPropagation()}
            onWheelCapture={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-primary-grey" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address..."
              className="block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-primary-black ring-1 ring-inset ring-grey-outline placeholder:text-primary-grey focus:ring-2 focus:ring-inset focus:ring-primary-orange sm:text-sm"
              onDoubleClickCapture={(e) => e.stopPropagation()}
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary-grey" />
              </div>
            )}
          </form>
          {searchResults.length > 0 && (
            <div
              className="mt-1 rounded-xl border border-grey-outline/80 bg-white shadow-lg max-h-64 overflow-hidden"
              onWheelCapture={(e) => e.stopPropagation()}
              onMouseDownCapture={(e) => e.stopPropagation()}
              onDoubleClickCapture={(e) => e.stopPropagation()}
            >
              <ul className="overflow-y-auto max-h-64 p-1">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    className="px-2 py-2 rounded-lg text-sm text-primary-black hover:bg-grey-fill transition-colors cursor-pointer"
                    onClick={() => selectResult(result)}
                  >
                    <p className=" text-primary-black truncate">
                      {result.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-primary-grey mt-1 line-clamp-2">
                      {result.display_name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrapper for custom map controls
const CustomControls = ({ center }) => {
  const map = useMap();

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar bg-white shadow-sm rounded-lg flex flex-col p-0 m-0">
        <button
          onClick={() => map.zoomIn()}
          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-grey-fill rounded-t-lg border-b border-grey-outline"
          title="Zoom in"
        >
          <span className="text-xl text-primary-grey">+</span>
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-grey-fill border-b border-grey-outline"
          title="Zoom out"
        >
          <span className="text-2xl text-primary-grey">-</span>
        </button>
        <button
          onClick={() => map.setView(center, map.getZoom())}
          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-grey-fill rounded-b-lg"
          title="Center on marker"
        >
          <LocateFixed className="h-4 w-4 text-primary-grey" />
        </button>
      </div>
    </div>
  );
};

const PropertyMap = ({
  coordinates = [51.505, -0.09], // Default to London
  onLocationChange,
  height = "400px",
}) => {
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const reverseGeocode = async (lat, lng, shouldUpdateSearchInput = true) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      if (!response.ok) throw new Error("Reverse geocoding failed");
      const data = await response.json();
      const address = data.address || {};
      if (shouldUpdateSearchInput) {
        setSearchQuery(data.display_name || "");
      }
      onLocationChange({ lat, lng, address });
    } catch (error) {
      console.error(error);
      if (shouldUpdateSearchInput) {
        setSearchQuery("Could not find address");
      }
    }
  };

  const handleDragEnd = () => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const position = marker.getLatLng();
      reverseGeocode(position.lat, position.lng);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      if (!response.ok) throw new Error("Failed to search location");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching for location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.address || {};

    onLocationChange({ lat, lng, address });
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  useEffect(() => {
    if (mapRef.current && coordinates[0] && coordinates[1]) {
      mapRef.current.setView(coordinates, mapRef.current.getZoom());
    }
  }, [coordinates]);

  useEffect(() => {
    if (coordinates[0] && coordinates[1]) {
      reverseGeocode(coordinates[0], coordinates[1], false);
    }
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{ height }}
      className="relative z-0 w-full rounded-lg overflow-hidden border border-grey-outline"
    >
      <MapContainer
        center={coordinates}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CustomControls center={coordinates} />
        <Marker
          position={coordinates}
          draggable={true}
          ref={markerRef}
          eventHandlers={{ dragend: handleDragEnd }}
        >
          <Popup>
            Property location
            <br />
            {coordinates[0]} {coordinates[1]}
          </Popup>
        </Marker>
        <ChangeView center={coordinates} />
        <SearchControl
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isSearching={isSearching}
          searchResults={searchResults}
          selectResult={selectResult}
        />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
