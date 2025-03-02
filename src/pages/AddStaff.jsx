import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Backend/firebase";

const AddStaff = ({ close }) => {
  const [staffData, setStaffData] = useState({
    name: "",
    age: "",
    role: "",
    department: "",
    experience: "",
    contact: "",
    email: "",
  });

  const handleChange = (e) => {
    setStaffData({ ...staffData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "staff"), staffData);
      console.log("Staff added with ID:", docRef.id);
      alert("Staff member added successfully!");
      close();
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Error adding staff member.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-lg bg-opacity-50 flex justify-center items-center">
      <div className="bg-white h-[90%] overflow-auto p-5 rounded-md w-96">
        <h2 className="text-xl font-bold">Add Staff</h2>
        <form onSubmit={handleAddStaff}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={staffData.name}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={staffData.age}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={staffData.role}
            onChange={handleChange}
            className="border p-2 w-full my-2"
            required
          >
            <option value="">Select Role</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Ward Boy">Ward Boy</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={staffData.department}
            className="border p-2 w-full my-2"
            onChange={handleChange}
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={staffData.experience}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={staffData.contact}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={staffData.email}
            className="border p-2 w-full my-2"
            onChange={handleChange}
            required
          />
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

export default AddStaff;
