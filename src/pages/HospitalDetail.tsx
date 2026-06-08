import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import HospitalMap from "../components/map/HospitalMap";
import MDEditor from "@uiw/react-md-editor";

export default function HospitalDetail() {
  const { id } = useParams();

  const [hospital, setHospital] = useState<any>(null);

  // reviews
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  // ======================
  // LOAD HOSPITAL
  // ======================
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setHospital(data);
    }

    load();
  }, [id]);

  // ======================
  // LOAD REVIEWS
  // ======================
  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("hospital_id", id)
      .eq("approved", true);

    if (!error) setReviews(data || []);
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  // ======================
  // SUBMIT REVIEW
  // ======================
  const submitReview = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;

    if (!user) {
      alert("Please login to review");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      hospital_id: id,
      user_id: user.id,
      rating,
      review_text: comment,
      approved: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setComment("");
    setRating(5);
    loadReviews();
  };

  if (!hospital) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>

      {/* HEADER */}
      <h1>{hospital.name}</h1>
      <p>{hospital.address}</p>

      {/* DETAILS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div>
          <h3>🏥 Details</h3>
          <p><b>Specialty:</b> {hospital.specialty || "Not specified"}</p>
          <p><b>Ownership:</b> {hospital.ownership || "Not specified"}</p>
          <p><b>Working Hours:</b> {hospital.working_hours || "Not available"}</p>
        </div>

        <div>
          <h3>📞 Contact</h3>
          <p><b>Phone:</b> {hospital.phone || "Not available"}</p>
          <p><b>Email:</b> {hospital.email || "Not available"}</p>
        </div>
      </div>

      {/* DESCRIPTION (MARKDOWN SAFE) */}
      {hospital.description && (
        <div style={{ marginTop: 20 }}>
          <h3>📝 About</h3>
          <MDEditor.Markdown source={hospital.description} />
        </div>
      )}

      {/* MAP */}
      <div style={{ height: 300, marginTop: 20 }}>
        <HospitalMap
          hospitals={[hospital]}
          selectedHospital={hospital}
        />
      </div>

      {/* ===================== */}
      {/* REVIEWS SECTION */}
      {/* ===================== */}

      <div style={{ marginTop: 30 }}>
        <h3>⭐ Reviews</h3>

        {/* REVIEW FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>5 ⭐</option>
            <option value={4}>4 ⭐</option>
            <option value={3}>3 ⭐</option>
            <option value={2}>2 ⭐</option>
            <option value={1}>1 ⭐</option>
          </select>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ padding: 10, minHeight: 80 }}
          />

          <button onClick={submitReview}>
            Submit Review
          </button>
        </div>

        {/* REVIEW LIST */}
        <div style={{ marginTop: 20 }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: 10,
              }}
            >
              <p>⭐ {r.rating}</p>
              <p>{r.review_text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}