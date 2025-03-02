import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../Backend/firebase"; // Ensure correct import
import { onAuthStateChanged } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AddPatient from "./AddPatient";
import AddAmbulance from "./AddAmbulance";
import TreatmentPopup from "./TreatmentPopup";
import { Link } from "react-router-dom";
import { deleteDoc } from "firebase/firestore";
import AddStaff from "./AddStaff";


ChartJS.register(ArcElement, Tooltip, Legend);

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

  const [diseaseData, setDiseaseData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#9966FF"],
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
  }, [patients]); // Trigger this whenever 'patients' changes

  const [selectedTreatment, setSelectedTreatment] = useState(null);

  

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
      <h1 className="text-3xl font-bold">Welcome, {hospitalName}!</h1>
      <Link to="/" className="bg-red-400 rounded-md  px-3 py-2 text-white font-bold hover:bg-red-600">Logout <i class="fa-solid fa-right-from-bracket"></i></Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-5 my-5">
        <StatCard title="Total Patients" count={patients.length} color="bg-blue-500" />
        <StatCard title="Total Ambulances" count={ambulances.length} color="bg-red-500" />
        <StatCard title="Total Staff" count={staff.length} color="bg-green-500" />
        <StatCard title="Available Beds" count={"150"} color="bg-yellow-500" />
      </div>

      {/* Pie Chart for Disease Distribution */}
      <div className="my-5" style={{ width: "30%" }}>
        <h2 className="text-2xl font-bold mb-3">Disease Distribution</h2>
        <Pie data={diseaseData} />
      </div>

      {/* Pop-up Forms */}
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
                    {patient.triageLevel|| "No treatment suggested"}
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
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
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
      {selectedTreatment && <TreatmentPopup treatment={selectedTreatment} close={() => setSelectedTreatment(null)} />}
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className={`p-5 rounded-md text-white ${color}`}>
    <h2 className="text-xl">{title}</h2>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

export default Dashboard;
