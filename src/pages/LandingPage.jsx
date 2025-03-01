import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50 text-center">
      <h1 className="text-4xl font-bold text-blue-600">AI Emergency Response System</h1>
      <p className="text-lg text-gray-700 mt-4">Helping hospitals respond to emergencies faster with AI</p>
      <div className="mt-6">
        <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-4">Register Hospital</Link>
        <Link to="/login" className="bg-gray-600 text-white px-6 py-2 rounded-lg">Login</Link>
      </div>
    </div>
  );
};

export default LandingPage;
