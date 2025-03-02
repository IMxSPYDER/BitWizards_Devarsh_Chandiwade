import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../Backend/firebase";
import axios from "axios";

const AddPatient = ({ close }) => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    temperature: "",
    painLevel: "",
    consciousnessLevel: "",
    symptoms: "",
    ecgAbnormality: "",
    xrayFindings: "",
    ctScanFindings: "",
    predictedDisease: "",
    triageLevel: "",
    suggestedTreatment: "",
  });

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
  
    try {
      // Prepare the features array based on form data
      const features = [
        patientData.heartRate,
        patientData.oxygenSaturation,
        patientData.respiratoryRate,
        patientData.systolicBP,
        patientData.diastolicBP,
        patientData.ecgAbnormality,
        patientData.xrayFindings,
        patientData.ctScanFindings,
        patientData.age,
        patientData.temperature,
        patientData.painLevel,
        patientData.consciousnessLevel,
        patientData.symptoms,
      ];
  
      // Post request to the backend API
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        features,
      });
      console.log("Prediction Response: ", response.data);
  
      if (!response.data) {
        throw new Error("No data received from the API");
      }

      // Access each value from the response data
        const predictedDisease = response.data["Predicted Disease"];
        const suggestedTreatment = response.data["Suggested Treatment"];
        const triageLevel = response.data["Triage Level"];

        // You can now use these values in your code
        console.log(predictedDisease); // Output: Severe Trauma
        console.log(suggestedTreatment); // Output: Ventilation Support - 5L/min
        console.log(triageLevel); // Output: Critical
  
      // Check for missing or invalid prediction data
      const updatedPatientData = {
        ...patientData,
        predictedDisease: predictedDisease, // Default to "Unknown" if undefined
        triageLevel: suggestedTreatment, // Default to "Unknown" if undefined
        suggestedTreatment: triageLevel || "No treatment provided", // Default if undefined
      };
  
      // Add the patient to Firebase
      const docRef = await addDoc(collection(db, "patients"), patientData);
      console.log("Patient added with ID:", docRef.id);
  
      // Update the patient document with the prediction data
      const patientDocRef = doc(db, "patients", docRef.id);
      await updateDoc(patientDocRef, updatedPatientData); // Update the existing patient document with prediction data
  
      alert("Patient added and prediction received!");
      close(); // Close the modal after success
    } catch (error) {
      console.error(
        "Error during request:",
        error.response ? error.response.data : error.message
      );
      alert("Error during patient addition or prediction request.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white h-[90%] overflow-auto p-5 rounded-md w-96">
        <h2 className="text-xl font-bold">Add Patient</h2>
        <form onSubmit={handleAddPatient}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={patientData.name}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={patientData.age}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="heartRate"
            placeholder="Heart Rate (bpm)"
            value={patientData.heartRate}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="systolicBP"
            placeholder="Systolic Blood Pressure (mmHg)"
            value={patientData.systolicBP}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="diastolicBP"
            placeholder="Diastolic Blood Pressure (mmHg)"
            value={patientData.diastolicBP}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="respiratoryRate"
            placeholder="Respiratory Rate (breaths per min)"
            value={patientData.respiratoryRate}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="oxygenSaturation"
            placeholder="Oxygen Saturation (%)"
            value={patientData.oxygenSaturation}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="temperature"
            placeholder="Temperature (°F)"
            value={patientData.temperature}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="painLevel"
            placeholder="Pain Level (1-10)"
            value={patientData.painLevel}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="consciousnessLevel"
            placeholder="Consciousness Level"
            value={patientData.consciousnessLevel}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="symptoms"
            placeholder="Symptoms"
            value={patientData.symptoms}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <select
            name="ecgAbnormality"
            value={patientData.ecgAbnormality}
            onChange={handleChange}
            className="border p-2 w-full my-2"
            required
          >
            <option value="">ECG Abnormality</option>
            <option value="0">Normal</option>
            <option value="1">Abnormal</option>
          </select>
          <select
            name="xrayFindings"
            value={patientData.xrayFindings}
            onChange={handleChange}
            className="border p-2 w-full my-2"
            required
          >
            <option value="">X-ray Findings</option>
            <option value="0">Normal</option>
            <option value="1">Minor Issue</option>
            <option value="2">Critical Issue</option>
          </select>
          <select
            name="ctScanFindings"
            value={patientData.ctScanFindings}
            onChange={handleChange}
            className="border p-2 w-full my-2"
            required
          >
            <option value="">CT Scan Findings</option>
            <option value="0">Normal</option>
            <option value="1">Minor Issue</option>
            <option value="2">Critical Issue</option>
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

export default AddPatient;
