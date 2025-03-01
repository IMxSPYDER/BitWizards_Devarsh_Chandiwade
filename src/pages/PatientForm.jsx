import React, { useState } from "react";
import { db, ref, push } from "../Backend/firebase";

const PatientForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    heartRate: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    systolicBP: "",
    diastolicBP: "",
    ecgAbnormality: "0",
    xrayFindings: "0",
    ctScanFindings: "0",
    age: "",
    temperature: "",
    painLevel: "",
    consciousnessLevel: "",
    symptoms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Push data to Firebase Realtime Database
      await push(ref(db, "patients"), formData);
      alert("Patient data added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving patient data:", error);
      alert("Failed to save data!");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Patient Data</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="heartRate" placeholder="Heart Rate (bpm)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="oxygenSaturation" placeholder="Oxygen Saturation (%)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="respiratoryRate" placeholder="Respiratory Rate (breaths per min)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="systolicBP" placeholder="Systolic Blood Pressure (mmHg)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="diastolicBP" placeholder="Diastolic Blood Pressure (mmHg)" onChange={handleChange} className="w-full p-2 border rounded" required />
          
          <select name="ecgAbnormality" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="0">ECG Normal</option>
            <option value="1">ECG Abnormal</option>
          </select>

          <select name="xrayFindings" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="0">X-ray Normal</option>
            <option value="1">Minor Issue</option>
            <option value="2">Critical Issue</option>
          </select>

          <select name="ctScanFindings" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="0">CT Scan Normal</option>
            <option value="1">Minor Issue</option>
            <option value="2">Critical Issue</option>
          </select>

          <input type="number" name="age" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="temperature" placeholder="Temperature (°F)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="number" name="painLevel" placeholder="Pain Level (1-10)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="consciousnessLevel" placeholder="Consciousness Level" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="symptoms" placeholder="Symptoms" onChange={handleChange} className="w-full p-2 border rounded" required />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
        <button onClick={onClose} className="mt-3 text-red-500">Close</button>
      </div>
    </div>
  );
};

export default PatientForm;
