import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ReviewBox({ hospitalId }: any) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const submitReview = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return alert("Login required");

    await supabase.from("reviews").insert({
      hospital_id: hospitalId,
      user_id: user.user.id,
      rating,
      review_text: text,
      approved: false,
    });

    alert("Review submitted for approval");
    setText("");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Leave a Review</h3>

      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1,2,3,4,5].map(r => (
          <option key={r} value={r}>{r} ⭐</option>
        ))}
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write review..."
        style={{ width: "100%", marginTop: 10 }}
      />

      <button onClick={submitReview} style={{ marginTop: 10 }}>
        Submit Review
      </button>
    </div>
  );
}