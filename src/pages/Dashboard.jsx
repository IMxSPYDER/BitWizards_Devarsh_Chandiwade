import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { db, auth } from "../Backend/firebase"; // Ensure correct import
import { onAuthStateChanged } from "firebase/auth";
import AddPatient from "./AddPatient";
import AddAmbulance from "./AddAmbulance";

const Dashboard = () => {
    const [hospitalName, setHospitalName] = useState("Hospital Dashboard");
    const [patients, setPatients] = useState([]);
    const [ambulances, setAmbulances] = useState([]);
    const [staff, setStaff] = useState([]);
    const [beds, setBeds] = useState(0);

    // Pop-up form states
    const [showPatientForm, setShowPatientForm] = useState(false);
    const [showAmbulanceForm, setShowAmbulanceForm] = useState(false);
    const [showStaffForm, setShowStaffForm] = useState(false);

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

            {/* Patient List */}
            <h2 className="text-2xl font-bold mt-5">Patient List</h2>
            <table className="w-full mt-3 border">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Age</th>
                        <th className="p-2 border">Condition</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient, index) => (
                        <tr key={index} className="border">
                            <td className="p-2 border">{patient.name}</td>
                            <td className="p-2 border">{patient.age}</td>
                            <td className="p-2 border">{patient.condition}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pop-up Forms */}
            {showPatientForm && <AddPatient close={() => setShowPatientForm(false)} />}
            {showAmbulanceForm && <AddAmbulance close={() => setShowAmbulanceForm(false)} />}
            {showStaffForm && <AddStaff close={() => setShowStaffForm(false)} />}
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
