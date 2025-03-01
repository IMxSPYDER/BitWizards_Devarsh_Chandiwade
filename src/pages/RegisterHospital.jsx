import { useState } from "react"
import { db, auth } from "../Backend/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { Building2, Mail, Lock, MapPin, Phone, Users, UserRound, Bed, Ambulance } from "lucide-react"

const RegisterHospital = () => {
  const [hospital, setHospital] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone: "",
    staff: 0,
    icuBeds: 0,
    availableIcuBeds: 0,
    doctors: 0,
    ambulances: 0,
    availableAmbulances: 0,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, hospital.email, hospital.password)
      await addDoc(collection(db, "hospitals"), {
        uid: userCredential.user.uid,
        name: hospital.name,
        email: hospital.email,
        location: hospital.location,
        phone: hospital.phone,
        staff: Number.parseInt(hospital.staff),
        icuBeds: Number.parseInt(hospital.icuBeds),
        availableIcuBeds: Number.parseInt(hospital.availableIcuBeds),
        doctors: Number.parseInt(hospital.doctors),
        ambulances: Number.parseInt(hospital.ambulances),
        availableAmbulances: Number.parseInt(hospital.availableAmbulances),
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-blue-700">Hospital Registration</h2>
          <p className="text-gray-600 mt-2">Join our healthcare network and help save lives</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Registration Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Hospital Name"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative md:col-span-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    placeholder="Hospital Address"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Staff Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Staff Information</h3>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Users className="h-5 w-5" />
                  </div>
                  <input
                    type="number"
                    name="staff"
                    placeholder="Total Staff"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <input
                    type="number"
                    name="doctors"
                    placeholder="Total Doctors"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Facilities Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Facilities</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Bed className="h-5 w-5" />
                    </div>
                    <input
                      type="number"
                      name="icuBeds"
                      placeholder="Total ICU Beds"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="availableIcuBeds"
                      placeholder="Available ICU Beds"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Ambulance className="h-5 w-5" />
                    </div>
                    <input
                      type="number"
                      name="ambulances"
                      placeholder="Total Ambulances"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="availableAmbulances"
                      placeholder="Available Ambulances"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Register Hospital"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already registered?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login to your account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterHospital

