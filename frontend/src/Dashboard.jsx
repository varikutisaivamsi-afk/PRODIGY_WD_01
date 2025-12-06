import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:4000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((error) => {
        console.error("Error fetching dashboard:", error);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p className="mt-20 text-center text-lg">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {user.role === "admin"
            ? "Welcome Admin"
            : `Welcome, ${user.name}`}
        </h1>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Name:</p>
            <p className="font-semibold text-gray-800">{user.name}</p>
          </div>
          {user.email && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
          )}
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">Role:</p>
            <p className="font-semibold text-gray-800 capitalize">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="mt-6 w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
