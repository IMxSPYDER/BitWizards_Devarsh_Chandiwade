import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../Backend/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import AddPatient from "./AddPatient";
import AddAmbulance from "./AddAmbulance";
import TreatmentPopup from "./TreatmentPopup";
import { Link } from "react-router-dom";
import { deleteDoc } from "firebase/firestore";
import AddStaff from "./AddStaff";
import axios from "axios"; // Import axios to make POST requests

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [hospitalName, setHospitalName] = useState("");
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

  const [diseaseData, setDiseaseData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#9966FF"],
      },
    ],
  });

  const [resourceData, setResourceData] = useState({
    labels: ["Beds", "Doctors", "Oxygen Cylinder", "PPEkits", "Ventilator"],
    datasets: [
      {
        label: "Resources Requirement",
        data: [],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"],
      },
    ],
  });

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
      const patientData = patientSnapshot.docs.map((doc) => doc.data());
      setPatients(patientData);

      const diseases = ["COVID-19", "Stroke", "Sepsis", "Pneumonia", "Severe_Trauma", "Heart_Failure"];
      const diseaseCounts = diseases.reduce((acc, disease) => {
        acc[disease] = patientData.filter(
          (patient) => patient.predictedDisease === disease
        ).length;
        return acc;
      }, {});

      // Update the pie chart data
      setDiseaseData((prevState) => ({
        ...prevState,
        labels: diseases,
        datasets: [
          {
            ...prevState.datasets[0],
            data: Object.values(diseaseCounts),
          },
        ],
      }));

      // Fetch ambulances, staff, and beds
      const ambulanceSnapshot = await getDocs(collection(db, "ambulances"));
      setAmbulances(ambulanceSnapshot.docs.map((doc) => doc.data()));

      const staffSnapshot = await getDocs(collection(db, "staff"));
      setStaff(staffSnapshot.docs.map((doc) => doc.data()));

      const bedsSnapshot = await getDocs(collection(db, "beds"));
      setBeds(bedsSnapshot.docs.length);
    };

    fetchData();
  }, [patients]);

  // Fetch resource data from API on load
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:5001/predict", {
          disease: "Covid", 
          patients: 100,
          severity: 3,
        });
        
        const { Beds, Doctors, "Oxygen Cylinder": OxygenCylinder, PPEkits, Ventilator } = response.data;
        
        setResourceData((prevState) => ({
          ...prevState,
          datasets: [
            {
              ...prevState.datasets[0],
              data: [Beds, Doctors, OxygenCylinder, PPEkits, Ventilator],
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching resource data:", error);
      }
    };

    fetchResources();
  }, []);

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await deleteDoc(doc(db, "patients", patientId)); 
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.id !== patientId)
      );
      alert("Patient deleted successfully!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient.");
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div>
        <h1 className="text-3xl font-bold">Welcome, {hospitalName}!</h1>
        </div>
        {/* Pop-up Forms */}
        <div className="flex items-center gap-4">
      <div className="flex gap-5 my-5">
        <button className="bg-blue-500 text-white px-5 py-2 rounded" onClick={() => setShowPatientForm(true)}>
          Add Patient
        </button>
        <button className="bg-red-500 text-white px-5 py-2 rounded" onClick={() => setShowAmbulanceForm(true)}>
          Add Ambulance
        </button>
        <button className="bg-green-500 text-white px-5 py-2 rounded" onClick={() => setShowStaffForm(true)}>
          Add Staff
        </button>
      </div>
        <Link to="/" className="bg-red-400 rounded-md px-3 py-2 text-white font-bold hover:bg-red-600">
          Logout <i className="fa-solid fa-right-from-bracket"></i>
        </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-5 my-5">
        <StatCard title="Total Patients" count={patients.length} color="bg-blue-500" smalls={"+15% from yesterday"}/>
        <StatCard title="Total Ambulances" count={ambulances.length} color="bg-red-500" smalls={"+15% from yesterday"}/>
        <StatCard title="Total Staff" count={staff.length} color="bg-green-500" smalls={"+15% from yesterday"}/>
        <StatCard title="Available Beds" count={"150"} color="bg-yellow-500" smalls={"+15% from yesterday"}/>
      </div>

      


      

      {/* Patient Table */}
      <h2 className="text-2xl font-bold mt-5 mb-3">Recent Patients</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Predicted Disease</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Triage Level</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Suggested Treatment</th>
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
                      {patient.name ? patient.name.split(" ").map((n) => n[0]).join("") : "?"}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.predictedDisease || "No disease detected"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        patient.painLevel >= 8
                          ? "bg-red-100 text-red-800"
                          : patient.painLevel >= 4
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.suggestedTreatment || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.triageLevel || "No treatment suggested"}
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
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      
      {/* Charts Section */}
      <div className="flex justify-center items-start gap-20 my-20">
        {/* Pie Chart for Disease Distribution */}
        <div className="w-2/6">
          <h2 className="text-2xl font-bold mb-3">Disease Distribution</h2>
          <Pie data={diseaseData} />
        </div>

        {/* Bar Graph for Resource Availability */}
        <div className="w-3/6">
          <h2 className="text-2xl font-bold mb-3">Resource Requirement</h2>
          <Bar data={resourceData} />
        </div>
      </div>

      {/* Pop-up Forms */}
      {showPatientForm && <AddPatient close={() => setShowPatientForm(false)} />}
      {showAmbulanceForm && <AddAmbulance close={() => setShowAmbulanceForm(false)} />}
      {showStaffForm && <AddStaff close={() => setShowStaffForm(false)} />}
    </div>
  );
};

const StatCard = ({ title, count, color, smalls }) => (
  <div className={`p-5 rounded-md text-white ${color}`}>
    <h2 className="text-xl">{title}</h2>
    <p className="text-3xl font-bold">{count}</p>
    <small className="text-xs">+15% from yesterday{smalls}</small>
  </div>
);

export default Dashboard;
