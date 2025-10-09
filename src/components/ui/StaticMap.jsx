import React, { useMemo } from "react";
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

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "static-map-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
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

  return (
    <div
      style={{ height }}
      className="relative z-0 w-full h-full rounded-2xl overflow-hidden border border-white/70 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[0_24px_68px_-36px_rgba(15,23,42,0.45)]"
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
        className="contrast-[1.02] saturate-[0.95]"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={position} icon={markerIcon}>
          {address && (
            <Tooltip
              direction="top"
              permanent
              offset={[0, -12]}
              className="rounded-full bg-primary-black/80 px-3 py-1 text-xs text-white shadow-lg"
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
