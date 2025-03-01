import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
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
    });

    const handleChange = (e) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
    };

    // const handleAddPatient = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //         // Add patient to Firebase
    //         const docRef = await addDoc(collection(db, "patients"), patientData);
    //         console.log("Patient added with ID: ", docRef.id);
    
    //         // Send patient data to the API
    //         const response = await axios.post("https://4a6b-34-87-80-170.ngrok-free.app/predict", {
    //             e : e
    //         });
    //         console.log(response.data)
    
    //         if (!response.ok) {
    //             throw new Error("Failed to get prediction");
    //         }
    
    //         const predictionData = await response.json();
    //         console.log("Prediction Response: ", predictionData);
    
    //         alert("Patient added and prediction received!");
    //         close();
    //     } catch (error) {
    //         console.error("Error adding patient: ", error);
    //         alert("Error adding patient or fetching prediction.");
    //     }
    // };
    
    const handleAddPatient = async (patientData) => {
        e.preventDefault();
    
        try {
            // Add patient to Firebase
            const docRef = await addDoc(collection(db, "patients"), patientData);
            console.log("Patient added with ID: ", docRef.id);
    
            // Transform patientData to match API format
            // const apiPayload = {
            //     features: [
            //         parseFloat(patientData.age),              // Age
            //         parseFloat(patientData.heartRate),       // Heart Rate
            //         parseFloat(patientData.systolicBP),      // Systolic BP
            //         parseFloat(patientData.diastolicBP),     // Diastolic BP
            //         parseFloat(patientData.respiratoryRate), // Respiratory Rate
            //         parseFloat(patientData.oxygenSaturation),// Oxygen Saturation
            //         parseFloat(patientData.temperature),     // Temperature
            //         parseFloat(patientData.painLevel),       // Pain Level
            //         parseFloat(patientData.ecgAbnormality),  // ECG Abnormality
            //         parseFloat(patientData.xrayFindings),    // X-ray Findings
            //         parseFloat(patientData.ctScanFindings),  // CT Scan Findings
            //     ]
                    //    };

            
    
            // Send transformed data to API
            const response = await axios.post(
                "https://4a6b-34-87-80-170.ngrok-free.app/predict",
                { patientData: patientData }
            );
    
            console.log("Prediction Response: ", response.data);
    
            if (!response.data) {
                throw new Error("No response data received from the prediction API.");
            }
    
            alert("Patient added and prediction received!");
            close();
        } catch (error) {
            console.error("Error adding patient: ", error.response ? error.response.data : error.message);
            alert("Error adding patient or fetching prediction.");
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white h-[90%] overflow-auto p-5 rounded-md w-96">
                <h2 className="text-xl font-bold">Add Patient</h2>
                <form onSubmit={handleAddPatient}>
                    <input type="text" name="name" placeholder="Name" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="age" placeholder="Age" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="heartRate" placeholder="Heart Rate (bpm)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="systolicBP" placeholder="Systolic Blood Pressure (mmHg)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="diastolicBP" placeholder="Diastolic Blood Pressure (mmHg)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="respiratoryRate" placeholder="Respiratory Rate (breaths per min)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="oxygenSaturation" placeholder="Oxygen Saturation (%)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="temperature" placeholder="Temperature (°F)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="number" name="painLevel" placeholder="Pain Level (1-10)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="text" name="consciousnessLevel" placeholder="Consciousness Level (e.g., Alert, Unconscious)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <input type="text" name="symptoms" placeholder="Symptoms (e.g., Chest Pain, Fever)" className="border p-2 w-full my-2" onChange={handleChange} required />
                    <select name="ecgAbnormality" className="border p-2 w-full my-2" onChange={handleChange} required>
                        <option value="">ECG Abnormality</option>
                        <option value="0">Normal</option>
                        <option value="1">Abnormal</option>
                    </select>
                    <select name="xrayFindings" className="border p-2 w-full my-2" onChange={handleChange} required>
                        <option value="">X-ray Findings</option>
                        <option value="0">Normal</option>
                        <option value="1">Minor Issue</option>
                        <option value="2">Critical Issue</option>
                    </select>
                    <select name="ctScanFindings" className="border p-2 w-full my-2" onChange={handleChange} required>
                        <option value="">CT Scan Findings</option>
                        <option value="0">Normal</option>
                        <option value="1">Minor Issue</option>
                        <option value="2">Critical Issue</option>
                    </select>
                    <div className="flex justify-between">
                        <button type="button" className="bg-gray-400 px-3 py-2 rounded" onClick={close}>Close</button>
                        <button className="bg-blue-500 text-white px-3 py-2 rounded">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
