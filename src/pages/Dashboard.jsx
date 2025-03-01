import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../Backend/firebase"; // Ensure correct import
import { onAuthStateChanged } from "firebase/auth";
import AddPatient from "./AddPatient";
import AddAmbulance from "./AddAmbulance";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import TreatmentPopup from "./TreatmentPopup";


const Dashboard = () => {
    const [hospitalName, setHospitalName] = useState("Hospital Dashboard");
    const [patients, setPatients] = useState([]);
    const [ambulances, setAmbulances] = useState([]);
    const [staff, setStaff] = useState([]);
    const [beds, setBeds] = useState(0);

    const [showPatientForm, setShowPatientForm] = useState(false);
    const [showAmbulanceForm, setShowAmbulanceForm] = useState(false);
    const [showStaffForm, setShowStaffForm] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const totalPages = Math.ceil(patients.length / rowsPerPage);

    const currentPatients = patients.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    // Fetch Hospital Name
    useEffect(() => {
        const fetchHospitalName = async (uid) => {
            if (!uid) return;
            const hospitalRef = doc(db, "hospitals", uid);
            const hospitalSnap = await getDoc(hospitalRef);
            if (hospitalSnap.exists()) {
                setHospitalName(hospitalSnap.data().name);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchHospitalName(user.uid);
            } else {
                setHospitalName("Hospital Dashboard");
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch data from Firebase
    useEffect(() => {
        const fetchData = async () => {
            const patientSnapshot = await getDocs(collection(db, "patients"));
            setPatients(patientSnapshot.docs.map(doc => doc.data()));

            const ambulanceSnapshot = await getDocs(collection(db, "ambulances"));
            setAmbulances(ambulanceSnapshot.docs.map(doc => doc.data()));

            const staffSnapshot = await getDocs(collection(db, "staff"));
            setStaff(staffSnapshot.docs.map(doc => doc.data()));

            const bedsSnapshot = await getDocs(collection(db, "beds"));
            setBeds(bedsSnapshot.docs.length);
        };
        fetchData();
    }, []);
 // Import pop-up component

const [selectedTreatment, setSelectedTreatment] = useState(null);

const handlePatientClick = async (patient) => {
    const prompt = `
        The following patient needs urgent medical attention. Suggest a treatment plan based on these vitals:

        - **Heart Rate (bpm):** ${patient.heartRate}
        - **Oxygen Saturation (%):** ${patient.oxygenSaturation}
        - **Respiratory Rate (breaths per min):** ${patient.respiratoryRate}
        - **Systolic Blood Pressure (mmHg):** ${patient.systolicBloodPressure}
        - **Diastolic Blood Pressure (mmHg):** ${patient.diastolicBloodPressure}
        - **ECG Abnormality (0 = Normal, 1 = Abnormal):** ${patient.ecgAbnormality}
        - **X-ray Findings (0 = Normal, 1 = Minor Issue, 2 = Critical Issue):** ${patient.xRayFindings}
        - **CT Scan Findings (0 = Normal, 1 = Minor Issue, 2 = Critical Issue):** ${patient.ctScanFindings}
        - **Age:** ${patient.age}
        - **Temperature (°F):** ${patient.temperature}
        - **Pain Level (1-10):** ${patient.painLevel}
        - **Consciousness Level:** ${patient.consciousnessLevel}
        - **Symptoms:** ${patient.symptoms}

        Provide a treatment recommendation based on this information.
    `;

    try {
        const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
        const API_KEY = "AIzaSyC7S_WFAh3E0bpnkSPcRhRS_HEsdjmRxwI"; // Replace this with your actual API key

        const genAI = new GoogleGenerativeAI("AIzaSyC7S_WFAh3E0bpnkSPcRhRS_HEsdjmRxwI");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const response = await model.generateContent(prompt);
        const treatmentText = response.response.candidates[0].content.parts[0].text;
        console.log(treatmentText)

        setSelectedTreatment(treatmentText);
    } catch (error) {
        console.error("Error fetching treatment:", error);
        setSelectedTreatment("Error fetching treatment. Please try again.");
    }
};


    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold">Welcome, {hospitalName}!</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-5 my-5">
                <StatCard title="Total Patients" count={patients.length} color="bg-blue-500" />
                <StatCard title="Total Ambulances" count={ambulances.length} color="bg-red-500" />
                <StatCard title="Total Staff" count={staff.length} color="bg-green-500" />
                <StatCard title="Available Beds" count={beds} color="bg-yellow-500" />
            </div>

            {/* Open Pop-up Forms */}
            <div className="flex gap-5 my-5">
                <button className="bg-blue-500 text-white px-5 py-2 rounded" onClick={() => setShowPatientForm(true)}>Add Patient</button>
                <button className="bg-red-500 text-white px-5 py-2 rounded" onClick={() => setShowAmbulanceForm(true)}>Add Ambulance</button>
                <button className="bg-green-500 text-white px-5 py-2 rounded" onClick={() => setShowStaffForm(true)}>Add Staff</button>
            </div>

            {/* Patient Table */}
            <h2 className="text-2xl font-bold mt-5 mb-3">Recent Patients</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Patient Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Age</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Condition</th> */}
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {currentPatients.length > 0 ? (
                        currentPatients.map((patient, index) => (
                            <tr 
                                key={index} 
                                className="bg-white hover:bg-gray-50 cursor-pointer"
                                onClick={() => handlePatientClick(patient)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <div className="h-10 w-10 flex items-center justify-center bg-gray-300 text-gray-700 font-semibold rounded-full">
                                        {patient.name ? patient.name.split(" ").map(n => n[0]).join("") : "?"}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        patient.painLevel >= 8 ? "bg-red-100 text-red-800" :
                                        patient.painLevel === "Waiting" ? "bg-yellow-100 text-yellow-800" :
                                        patient.painLevel === "Scheduled" ? "bg-blue-100 text-blue-800" :
                                        patient.painLevel === "Cancelled" ? "bg-red-100 text-red-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {patient.painLevel}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                No patients found.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
            <button 
                className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`} 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button 
                className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`} 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>

            {/* Pop-up Forms */}
            {showPatientForm && <AddPatient close={() => setShowPatientForm(false)} />}
            {showAmbulanceForm && <AddAmbulance close={() => setShowAmbulanceForm(false)} />}
            {showStaffForm && <AddStaff close={() => setShowStaffForm(false)} />}
            {selectedTreatment && (
            <TreatmentPopup 
                treatment={selectedTreatment} 
                close={() => setSelectedTreatment(null)} 
            />
)}
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ title, count, color }) => (
    <div className={`p-5 rounded-md text-white ${color}`}>
        <h2 className="text-xl">{title}</h2>
        <p className="text-3xl font-bold">{count}</p>
    </div>
);

export default Dashboard;
