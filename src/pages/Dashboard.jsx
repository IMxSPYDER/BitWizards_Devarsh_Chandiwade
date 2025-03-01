import { useEffect, useState } from "react";
import { db, auth } from "../Backend/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) navigate("/login");

    const fetchHospitals = async () => {
      const querySnapshot = await getDocs(collection(db, "hospitals"));
      setHospitals(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchHospitals();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600">Hospital Dashboard</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{hospital.name}</h3>
            <p className="text-gray-600"><strong>Location:</strong> {hospital.location}</p>
            <p className="text-gray-600"><strong>Email:</strong> {hospital.email}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {hospital.phone}</p>
            <p className="text-gray-600"><strong>Total Staff:</strong> {hospital.staff}</p>
            <p className="text-gray-600"><strong>Total Doctors:</strong> {hospital.doctors}</p>
            <p className="text-gray-600"><strong>Total ICU Beds:</strong> {hospital.icuBeds}</p>
            <p className="text-gray-600"><strong>Available ICU Beds:</strong> {hospital.availableIcuBeds}</p>
            <p className="text-gray-600"><strong>Total Ambulances:</strong> {hospital.ambulances}</p>
            <p className="text-gray-600"><strong>Available Ambulances:</strong> {hospital.availableAmbulances}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
