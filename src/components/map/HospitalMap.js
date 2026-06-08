import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
function Focus({ selected }) {
    const map = useMap();
    useEffect(() => {
        if (selected?.latitude && selected?.longitude) {
            map.flyTo([selected.latitude, selected.longitude], 14);
        }
    }, [selected]);
    return null;
}
export default function HospitalMap({ hospitals, selectedHospital }) {
    return (_jsxs(MapContainer, { center: [9.08, 7.49], zoom: 6, style: { height: "100%", width: "100%" }, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), _jsx(Focus, { selected: selectedHospital }), hospitals.map((h) => h.latitude && h.longitude ? (_jsx(Marker, { position: [h.latitude, h.longitude], children: _jsxs(Popup, { children: [_jsx("b", { children: h.name }), _jsx("br", {}), h.address] }) }, h.id)) : null)] }));
}
