import { useState } from "react";
import { auth } from "../Backend/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../Backend/firebase"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save hospital details in Firestore
      await setDoc(doc(db, "hospitals", user.uid), {
        name,
        email,
        location,
        resources: { beds: 0, doctors: 0, ambulances: 0 }
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold mb-4">Hospital Registration</h2>
        <input type="text" placeholder="Hospital Name" className="border p-2 w-full" onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Location" className="border p-2 w-full mt-2" onChange={(e) => setLocation(e.target.value)} required />
        <input type="email" placeholder="Hospital Email" className="border p-2 w-full mt-2" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="border p-2 w-full mt-2" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full mt-4">Register</button>
      </form>
    </div>
  );
}

export default Register;
