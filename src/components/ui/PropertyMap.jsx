import { useState, useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  Polygon,
  Tooltip,
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
        <div className="leaflet-control bg-transparent w-72 md:w-80">
          <form
            onSubmit={handleSearch}
            className="relative rounded-2xl shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm"
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
              className="block w-full rounded-2xl border border-white/70 bg-white/90 py-2.5 pl-11 pr-12 text-sm text-primary-black shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] placeholder:text-primary-grey focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange"
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
              className="mt-2 rounded-2xl border border-white/60 bg-white/95 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.55)] max-h-64 overflow-hidden backdrop-blur-sm"
              onWheelCapture={(e) => e.stopPropagation()}
              onMouseDownCapture={(e) => e.stopPropagation()}
              onDoubleClickCapture={(e) => e.stopPropagation()}
            >
              <ul className="overflow-y-auto max-h-64 p-1">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    className="px-3 py-2.5 rounded-xl text-sm text-primary-black hover:bg-grey-fill/70 transition-colors cursor-pointer"
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
      <div className="leaflet-control leaflet-bar bg-white/90 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.65)] rounded-2xl flex flex-col overflow-hidden backdrop-blur-sm border border-white/70">
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-grey-fill/70 border-b border-grey-outline/70"
          title="Zoom in"
        >
          <span className="text-xl text-primary-grey">+</span>
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-grey-fill/70 border-b border-grey-outline/70"
          title="Zoom out"
        >
          <span className="text-2xl text-primary-grey">-</span>
        </button>
        <button
          onClick={() => map.setView(center, map.getZoom())}
          className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-grey-fill/70"
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

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "property-map-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28],
        html: `
          <div style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background: rgba(255, 114, 47, 0.18);
              display: flex;
              align-items: center;
              justify-content: center;
              backdrop-filter: blur(4px);
              box-shadow: 0 18px 40px -24px rgba(255, 114, 47, 0.55);
          ">
            <span style="
                width: 12px;
                height: 12px;
                border-radius: 9999px;
                background: #ff722f;
                box-shadow: 0 8px 24px rgba(255, 114, 47, 0.55);
            "></span>
          </div>
        `,
      }),
    []
  );

  const londonBoundary = useMemo(
    () => ({
      positions: [
        [51.709, -0.533],
        [51.682, -0.447],
        [51.702, -0.341],
        [51.706, -0.196],
        [51.689, -0.041],
        [51.676, 0.075],
        [51.649, 0.176],
        [51.602, 0.228],
        [51.533, 0.245],
        [51.465, 0.198],
        [51.405, 0.075],
        [51.357, -0.02],
        [51.308, -0.12],
        [51.287, -0.225],
        [51.274, -0.352],
        [51.285, -0.47],
        [51.322, -0.533],
        [51.378, -0.565],
        [51.443, -0.563],
        [51.51, -0.55],
        [51.585, -0.53],
        [51.709, -0.533],
      ],
      pathOptions: {
        color: "#ff722f",
        weight: 1.6,
        opacity: 0.85,
        dashArray: "14 10",
        fillColor: "#ff722f",
        fillOpacity: 0.06,
      },
    }),
    []
  );

  return (
    <div
      style={{ height }}
      className="relative z-0 w-full rounded-2xl overflow-hidden border border-white/70"
      //  bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[0_24px_68px_-36px_rgba(15,23,42,0.45)]
    >
      <MapContainer
        center={coordinates}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
        className="contrast-[1.02] saturate-[0.95]"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Polygon
          positions={londonBoundary.positions}
          pathOptions={londonBoundary.pathOptions}
        />
        <Marker
          position={[51.689, -0.341]}
          interactive={false}
          icon={L.divIcon({
            className: "hidden",
          })}
        >
          <Tooltip
            direction="top"
            permanent
            opacity={1}
            offset={[0, -12]}
            className="rounded-full bg-primary-black/80 px-3 py-1 text-xs text-white shadow-lg"
          >
            Certie service area
          </Tooltip>
        </Marker>
        <CustomControls center={coordinates} />
        <Marker
          position={coordinates}
          draggable={true}
          ref={markerRef}
          eventHandlers={{ dragend: handleDragEnd }}
          icon={markerIcon}
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
