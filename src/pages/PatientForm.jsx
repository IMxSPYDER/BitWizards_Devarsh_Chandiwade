import React, { useState } from "react";
import { db, ref, push } from "../Backend/firebase";
import axios from "axios";

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

  const [prediction, setPrediction] = useState(null);

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

      // Send patient data to the prediction API
      const response = await axios.post(
        "http://e87a-34-75-196-165.ngrok-free.app/predict",
        { features: formData }
      );

      if (response.data) {
        setPrediction(response.data);
        alert("Prediction received successfully!");
      } else {
        alert("No prediction data received.");
      }

      // Reset form data after submission
      setFormData({
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

      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Error saving patient data or fetching prediction:", error);
      alert("Failed to save data or receive prediction!");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Patient Data</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="heartRate"
            placeholder="Heart Rate (bpm)"
            value={formData.heartRate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="oxygenSaturation"
            placeholder="Oxygen Saturation (%)"
            value={formData.oxygenSaturation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="respiratoryRate"
            placeholder="Respiratory Rate (breaths per min)"
            value={formData.respiratoryRate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="systolicBP"
            placeholder="Systolic Blood Pressure (mmHg)"
            value={formData.systolicBP}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="diastolicBP"
            placeholder="Diastolic Blood Pressure (mmHg)"
            value={formData.diastolicBP}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="ecgAbnormality"
            value={formData.ecgAbnormality}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="0">ECG Normal</option>
            <option value="1">ECG Abnormal</option>
          </select>

          <select
            name="xrayFindings"
            value={formData.xrayFindings}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="0">X-ray Normal</option>
            <option value="1">Minor Issue</option>
            <option value="2">Critical Issue</option>
          </select>

          <select
            name="ctScanFindings"
            value={formData.ctScanFindings}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="0">CT Scan Normal</option>
            <option value="1">Minor Issue</option>
            <option value="2">Critical Issue</option>
          </select>

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="temperature"
            placeholder="Temperature (°F)"
            value={formData.temperature}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="painLevel"
            placeholder="Pain Level (1-10)"
            value={formData.painLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="consciousnessLevel"
            placeholder="Consciousness Level"
            value={formData.consciousnessLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="symptoms"
            placeholder="Symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>

        {prediction && (
          <div className="mt-4">
            <h3 className="font-semibold">Prediction Result:</h3>
            <ul>
              <li>Predicted Disease: {prediction["Predicted Disease"]}</li>
              <li>Triage Level: {prediction["Triage Level"]}</li>
              <li>Suggested Treatment: {prediction["Suggested Treatment"]}</li>
            </ul>
          </div>
        )}

        <button onClick={onClose} className="mt-3 text-red-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default PatientForm;
