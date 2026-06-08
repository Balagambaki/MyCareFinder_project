import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import HospitalCard from "../components/hospitals/HospitalCard";
import HospitalMap from "../components/map/HospitalMap";
import Papa from "papaparse";
export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
    const [ownership, setOwnership] = useState(searchParams.get("ownership") || "");
    const [radius, setRadius] = useState(Number(searchParams.get("radius")) || 10);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const isMobile = window.innerWidth <= 768;
    // ==============================
    // LOAD DATA (Supabase + PostGIS READY)
    // ==============================
    useEffect(() => {
        async function load() {
            setLoading(true);
            // Basic fetch (you can replace with PostGIS RPC later)
            let queryBuilder = supabase.from("hospitals").select("*");
            const { data, error } = await queryBuilder;
            if (error) {
                console.error(error);
            }
            else {
                setHospitals(data || []);
            }
            setLoading(false);
        }
        load();
    }, []);
    // ==============================
    // GEOLOCATION
    // ==============================
    const getUserLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
        }, (err) => {
            console.error(err);
            alert("Location access denied or unavailable");
        }, { enableHighAccuracy: true, timeout: 10000 });
    };
    // ==============================
    // DISTANCE CALC (fallback if not using PostGIS yet)
    // ==============================
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    // ==============================
    // FILTER + SEARCH PIPELINE
    // ==============================
    const processedHospitals = useMemo(() => {
        return hospitals
            .filter((h) => {
            const text = query.toLowerCase();
            const matchesText = h.name?.toLowerCase().includes(text) ||
                h.city?.toLowerCase().includes(text) ||
                h.lga?.toLowerCase().includes(text) ||
                h.address?.toLowerCase().includes(text);
            const matchesCity = !city || h.city === city;
            const matchesSpecialty = !specialty || h.specialty === specialty;
            const matchesOwnership = !ownership || h.ownership === ownership;
            return matchesText && matchesCity && matchesSpecialty && matchesOwnership;
        })
            .map((h) => {
            let distance = null;
            if (userLocation && h.latitude && h.longitude) {
                distance = getDistance(userLocation.lat, userLocation.lng, h.latitude, h.longitude);
            }
            return { ...h, distance };
        })
            .filter((h) => {
            if (!h.distance)
                return true;
            return h.distance <= radius;
        })
            .sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
    }, [hospitals, query, city, specialty, ownership, userLocation, radius]);
    // ==============================
    // CSV EXPORT (PAPAPARSE)
    // ==============================
    const exportCSV = () => {
        const csv = Papa.unparse(processedHospitals.map((h) => ({
            name: h.name,
            address: h.address,
            phone: h.phone,
            email: h.email,
            specialty: h.specialty,
            rating: h.rating,
        })));
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = `hospitals-${city || "all"}-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;
        a.download = filename;
        a.click();
    };
    // ==============================
    // SHARE LINK (FILTER SYNC)
    // ==============================
    const shareLink = async () => {
        const params = new URLSearchParams();
        if (query)
            params.set("query", query);
        if (city)
            params.set("city", city);
        if (specialty)
            params.set("specialty", specialty);
        if (ownership)
            params.set("ownership", ownership);
        if (radius)
            params.set("radius", String(radius));
        const url = `${window.location.origin}/search?${params.toString()}`;
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };
    // ==============================
    // SHARE APP
    // ==============================
    const shareApp = async () => {
        if (navigator.share) {
            await navigator.share({
                title: "Carefinder",
                text: "Find hospitals near you",
                url: window.location.href,
            });
        }
        else {
            alert("Sharing not supported on this device");
        }
    };
    if (loading)
        return _jsx("p", { style: { padding: 20 }, children: "Loading..." });
    return (_jsxs("div", { style: { display: "flex", height: "100vh", flexDirection: isMobile ? "column" : "row" }, children: [_jsxs("div", { style: {
                    width: isMobile ? "100%" : 380,
                    padding: 15,
                    overflowY: "auto",
                    background: "#B8E1E1"
                }, children: [_jsx("h2", { children: "\uD83C\uDFE5 Carefinder" }), _jsx("p", { children: "Find Hospitals Across Bauchi " }), _jsxs("div", { style: { display: "flex", gap: 8 }, children: [_jsx("input", { placeholder: "Search...", value: query, onChange: (e) => setQuery(e.target.value), style: { ...inputStyle, flex: 2 } }), _jsx("button", { onClick: async () => {
                                    await supabase.auth.signOut();
                                    window.location.href = "/login";
                                }, style: {
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    padding: 10,
                                    background: "black",
                                    color: "white",
                                    borderRadius: 8,
                                }, children: "Logout" }), _jsx("input", { placeholder: "City", value: city, onChange: (e) => setCity(e.target.value), style: { ...inputStyle, flex: 1 } })] }), _jsxs("select", { value: specialty, onChange: (e) => setSpecialty(e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "All Specialties" }), _jsx("option", { value: "Maternity", children: "Maternity" }), _jsx("option", { value: "Emergency", children: "Emergency" }), _jsx("option", { value: "Dental", children: "Dental" }), _jsx("option", { value: "Pediatrics", children: "Pediatrics" })] }), _jsxs("select", { value: ownership, onChange: (e) => setOwnership(e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "All Ownership" }), _jsx("option", { value: "Public", children: "Public" }), _jsx("option", { value: "Private", children: "Private" })] }), _jsx("button", { onClick: getUserLocation, style: buttonStyle, children: "\uD83D\uDCCD Use My Location" }), _jsx("button", { onClick: exportCSV, style: buttonStyle, children: "\u2B07\uFE0F Export CSV" }), _jsx("button", { onClick: shareLink, style: buttonStyle, children: "\uD83D\uDD17 Copy Share Link" }), _jsx("button", { onClick: shareApp, style: buttonStyle, children: "\uD83D\uDCE4 Share App" }), _jsxs("select", { value: radius, onChange: (e) => setRadius(Number(e.target.value)), style: inputStyle, children: [_jsx("option", { value: 5, children: "5 km" }), _jsx("option", { value: 10, children: "10 km" }), _jsx("option", { value: 25, children: "25 km" })] }), _jsxs("h3", { children: ["Results (", processedHospitals.length, ")"] }), processedHospitals.map((h) => (_jsxs("div", { onClick: () => setSelectedHospital(h), style: {
                            border: selectedHospital?.id === h.id ? "2px solid blue" : "1px solid #ddd",
                            padding: 8,
                            marginBottom: 10,
                            borderRadius: 10,
                            cursor: "pointer",
                        }, children: [_jsx(HospitalCard, { hospital: h }), h.distance && _jsxs("small", { children: ["\uD83D\uDCCD ", h.distance.toFixed(1), " km"] })] }, h.id)))] }), _jsx("div", { style: { flex: 1 }, children: _jsx(HospitalMap, { hospitals: processedHospitals, selectedHospital: selectedHospital }) })] }));
}
const inputStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
};
const buttonStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    background: "#111",
    color: "white",
    borderRadius: 8,
    border: "none",
};
