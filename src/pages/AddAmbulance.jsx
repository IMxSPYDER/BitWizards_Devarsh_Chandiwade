import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Backend/firebase";
import { useNavigate } from "react-router-dom";

const AddAmbulance = ({ close }) => {
  const [ambulanceData, setAmbulanceData] = useState({
    number: "",
    driverName: "",
    contact: "",
    location: "",
    status: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAmbulanceData({ ...ambulanceData, [e.target.name]: e.target.value });
  };

  const handleAddAmbulance = async (e) => {
    e.preventDefault();
    if (!ambulanceData.number || !ambulanceData.driverName || !ambulanceData.contact || !ambulanceData.location || !ambulanceData.status) {
      return alert("Please fill all fields");
    }

    await addDoc(collection(db, "ambulances"), ambulanceData);
    alert("Ambulance added!");
    close();
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white overflow-auto p-5 rounded-md w-96">
        <h2 className="text-xl font-bold">Add Ambulance</h2>
        <form onSubmit={handleAddAmbulance}>
          <input
            type="text"
            name="number"
            placeholder="Ambulance Number"
            value={ambulanceData.number}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={ambulanceData.driverName}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="contact"
            placeholder="Driver Contact"
            value={ambulanceData.contact}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Current Location"
            value={ambulanceData.location}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <select
            name="status"
            value={ambulanceData.status}
            onChange={handleChange}
            className="border p-2 w-full my-2"
            required
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
          <div className="flex justify-between">
            <button type="button" className="bg-gray-400 px-3 py-2 rounded" onClick={close}>
              Close
            </button>
            <button className="bg-blue-500 text-white px-3 py-2 rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAmbulance;
