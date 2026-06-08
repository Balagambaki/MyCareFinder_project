import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { supabase } from "../lib/supabaseClient";

export default function AdminHospitalEditor() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [ownership, setOwnership] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const [description, setDescription] = useState<string | undefined>("");
  const [image, setImage] = useState<File | null>(null);
  const saveHospital = async () => {
    const { error } = await supabase.from("hospitals").insert({
      name,
      address,
      phone,
      specialty,
      ownership,
      working_hours: workingHours,
      description,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Hospital saved successfully");
    }
  };

    return (
  <div style={{ padding: 20 }}>
    <h2>Admin Editor</h2>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <input placeholder="Specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
      <input placeholder="Ownership" value={ownership} onChange={(e) => setOwnership(e.target.value)} />
      <input placeholder="Working Hours" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} />
      return (
  <div style={{ padding: 20 }}>
    <h2>Admin Editor</h2>

    <input
      placeholder="Hospital Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      placeholder="Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />

    {/* ✅ IMAGE UPLOAD GOES HERE */}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setImage(e.target.files?.[0] || null)}
    />
      {/* MARKDOWN EDITOR */}
      <div data-color-mode="light">

        <MDEditor value={description} onChange={setDescription} />
      </div>

      <button onClick={saveHospital} style={{ marginTop: 10 }}>
        Save Hospital
      </button>
    </div>
  </div>
  );
}