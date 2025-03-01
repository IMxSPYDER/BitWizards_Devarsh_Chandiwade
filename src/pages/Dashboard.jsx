import { useEffect, useState } from "react";
import { db, auth } from "../Backend/firebase";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHospitalData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "hospitals", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHospital(docSnap.data());
        } else {
          setError("Hospital data not found.");
        }
      } catch (err) {
        setError("Error fetching data. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-blue-600">Hospital Dashboard</h2>
      {hospital && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <p><strong>Name:</strong> {hospital.name}</p>
          <p><strong>Email:</strong> {hospital.email}</p>
          <p><strong>Location:</strong> {hospital.location}</p>
          <p><strong>Phone:</strong> {hospital.phone}</p>
          <p><strong>Doctors:</strong> {hospital.doctors}</p>
          <p><strong>ICU Beds:</strong> {hospital.availableIcuBeds} / {hospital.icuBeds}</p>
          <p><strong>Ambulances:</strong> {hospital.availableAmbulances} / {hospital.ambulances}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
