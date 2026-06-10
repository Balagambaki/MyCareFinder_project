import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import HospitalCard from "../components/hospitals/HospitalCard";
import HospitalMap from "../components/map/HospitalMap";
import Papa from "papaparse";

type Hospital = {
  id: string;
  name: string;
  city?: string;
  lga?: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  specialty?: string;
  ownership?: string;
  rating?: number;
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [ownership, setOwnership] = useState(searchParams.get("ownership") || "");

  const [radius, setRadius] = useState<number>(
    Number(searchParams.get("radius")) || 10
  );

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

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
      } else {
        setHospitals((data as Hospital[]) || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  // ==============================
  // GEOLOCATION
  // ==============================
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        alert("Location access denied or unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==============================
  // DISTANCE CALC (fallback if not using PostGIS yet)
  // ==============================
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // ==============================
  // FILTER + SEARCH PIPELINE
  // ==============================
  
 const normalize = (v?: string) =>
  v?.toLowerCase().trim().replace(/\s+/g, " ") || "";

const processedHospitals = useMemo(() => {
  return hospitals
    .filter((h) => {
      const text = normalize(query);

      const matchesText =
        normalize(h.name).includes(text) ||
        normalize(h.city).includes(text) ||
        normalize(h.lga).includes(text) ||
        normalize(h.address).includes(text);

      const matchesCity =
        !city || normalize(h.city) === normalize(city);

      const matchesSpecialty =
        !specialty || normalize(h.specialty) === normalize(specialty);

      const matchesOwnership =
        !ownership || normalize(h.ownership) === normalize(ownership);

      return (
        matchesText &&
        matchesCity &&
        matchesSpecialty &&
        matchesOwnership
      );
    })
    .map((h) => {
      let distance = null;

      if (userLocation && h.latitude && h.longitude) {
        distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          h.latitude,
          h.longitude
        );
      }

      return { ...h, distance };
    })
    .filter((h: any) => {
      if (h.distance == null) return true;
      return h.distance <= radius;
    })
    .sort((a: any, b: any) => (a.distance || 9999) - (b.distance || 9999));
}, [hospitals, query, city, specialty, ownership, userLocation, radius]);

  // ==============================
  // CSV EXPORT (PAPAPARSE)
  // ==============================
  const exportCSV = () => {
    const csv = Papa.unparse(
      processedHospitals.map((h) => ({
        name: h.name,
        address: h.address,
        phone: h.phone,
        email: h.email,
        specialty: h.specialty,
        rating: h.rating,
      }))
    );

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

    if (query) params.set("query", query);
    if (city) params.set("city", city);
    if (specialty) params.set("specialty", specialty);
    if (ownership) params.set("ownership", ownership);
    if (radius) params.set("radius", String(radius));

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
    } else {
      alert("Sharing not supported on this device");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: isMobile ? "column" : "row" }}>

      {/* LEFT PANEL */}
      <div style={{
        width: isMobile ? "100%" : 380,
        padding: 15,
        overflowY: "auto",
        background: "#B8E1E1"
      }}>

        <h2>🏥 Carefinder</h2>
        <p>Find Hospitals Across Bauchi </p>

        <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...inputStyle, flex: 2 }}
          />
        <button
          onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
           padding: 10,
            background: "black",
            color: "white",
           borderRadius: 8,
          }}
          >
        Logout
      </button>
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
          />
         </div>

        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={inputStyle}>
          <option value="">All Specialties</option>
          <option value="Maternity">Maternity</option>
          <option value="Emergency">Emergency</option>
          <option value="Dental">Dental</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>

        <select value={ownership} onChange={(e) => setOwnership(e.target.value)} style={inputStyle}>
          <option value="">All Ownership</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        <button onClick={getUserLocation} style={buttonStyle}>📍 Use My Location</button>
        <button onClick={exportCSV} style={buttonStyle}>⬇️ Export CSV</button>
        <button onClick={shareLink} style={buttonStyle}>🔗 Copy Share Link</button>
        <button onClick={shareApp} style={buttonStyle}>📤 Share App</button>

        <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} style={inputStyle}>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={25}>25 km</option>
        </select>

        <h3>Results ({processedHospitals.length})</h3>

        {processedHospitals.map((h: any) => (
          <div
            key={h.id}
            onClick={() => setSelectedHospital(h)}
            style={{
              border: selectedHospital?.id === h.id ? "2px solid blue" : "1px solid #ddd",
              padding: 8,
              marginBottom: 10,
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <HospitalCard hospital={h} />
            {h.distance && <small>📍 {h.distance.toFixed(1)} km</small>}
          </div>
        ))}
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <HospitalMap
          hospitals={processedHospitals}
          selectedHospital={selectedHospital}
        />
      </div>
    </div>
  );
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