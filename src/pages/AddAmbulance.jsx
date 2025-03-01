import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Backend/firebase";
import { useNavigate } from "react-router-dom";

const AddAmbulance = () => {
    const [number, setNumber] = useState("");
    const navigate = useNavigate();

    const handleAddAmbulance = async (e) => {
        e.preventDefault();
        if (!number) return alert("Enter ambulance number");

        await addDoc(collection(db, "ambulances"), { number });
        alert("Ambulance added!");
        navigate("/dashboard");
    };

    return (
        <div className="p-5 border rounded-md">
            <h2 className="text-xl font-bold">Add Ambulance</h2>
            <form onSubmit={handleAddAmbulance}>
                <input type="text" className="border p-2 w-full my-2" placeholder="Ambulance Number" value={number} onChange={(e) => setNumber(e.target.value)} />
                <button className="bg-red-500 text-white px-3 py-2 rounded">Add</button>
            </form>
        </div>
    );
};

export default AddAmbulance;
