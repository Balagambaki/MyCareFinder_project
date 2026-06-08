import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
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
        }
        else {
            alert("Hospital saved successfully");
        }
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h2", { children: "Admin Editor" }), _jsx("input", { placeholder: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { placeholder: "Address", value: address, onChange: (e) => setAddress(e.target.value) }), _jsx("input", { placeholder: "Phone", value: phone, onChange: (e) => setPhone(e.target.value) }), _jsx("input", { placeholder: "Specialty", value: specialty, onChange: (e) => setSpecialty(e.target.value) }), _jsx("input", { placeholder: "Ownership", value: ownership, onChange: (e) => setOwnership(e.target.value) }), _jsx("input", { placeholder: "Working Hours", value: workingHours, onChange: (e) => setWorkingHours(e.target.value) }), "return (", _jsxs("div", { style: { padding: 20 }, children: [_jsx("h2", { children: "Admin Editor" }), _jsx("input", { placeholder: "Hospital Name", value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { placeholder: "Address", value: address, onChange: (e) => setAddress(e.target.value) }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setImage(e.target.files?.[0] || null) }), _jsx("div", { "data-color-mode": "light", children: _jsx(MDEditor, { value: description, onChange: setDescription }) }), _jsx("button", { onClick: saveHospital, style: { marginTop: 10 }, children: "Save Hospital" })] })] }));
}
