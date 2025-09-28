import React from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const StaticMap = ({ latitude, longitude, address, height = "400px" }) => {
  if (!latitude || !longitude) {
    return null;
  }

  const position = [latitude, longitude];

  return (
    <div
      style={{ height }}
      className="relative z-0 w-full h-full rounded-xl overflow-hidden shadow-sm"
    >
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          {address && (
            <Tooltip
              permanent
              className="!bg-white !text-primary-black !border !border-grey-outline shadow-lg px-3 py-2 rounded-lg text-xs font-medium tracking-tight"
            >
              {address}
            </Tooltip>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default StaticMap;
