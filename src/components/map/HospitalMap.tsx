import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function Focus({ selected }: any) {
  const map = useMap();

  useEffect(() => {
    if (selected?.latitude && selected?.longitude) {
      map.flyTo([selected.latitude, selected.longitude], 14);
    }
  }, [selected]);

  return null;
}

export default function HospitalMap({ hospitals, selectedHospital }: any) {
  return (
    <MapContainer
      center={[9.08, 7.49]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Focus selected={selectedHospital} />

      {hospitals.map((h: any) =>
        h.latitude && h.longitude ? (
          <Marker key={h.id} position={[h.latitude, h.longitude]}>
            <Popup>
              <b>{h.name}</b>
              <br />
              {h.address}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}