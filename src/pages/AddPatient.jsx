import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db} from "../Backend/firebase"; // Ensure correct import


const AddPatient = ({ close }) => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [condition, setCondition] = useState("");

    const handleAddPatient = async (e) => {
        e.preventDefault();
        if (!name || !age || !condition) return alert("All fields are required");

        await addDoc(collection(db, "patients"), { name, age, condition });
        alert("Patient added!");
        close();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-md w-96">
                <h2 className="text-xl font-bold">Add Patient</h2>
                <form onSubmit={handleAddPatient}>
                    <input type="text" className="border p-2 w-full my-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="number" className="border p-2 w-full my-2" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                    <input type="text" className="border p-2 w-full my-2" placeholder="Condition" value={condition} onChange={(e) => setCondition(e.target.value)} />
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
