import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { identifier, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login LPK Sekai Mirai
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Email / Username / No HP"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <div className="mt-4 text-sm text-center">
          <Link to="/register" className="text-blue-600">
            Daftar
          </Link>{" "}
          |
          <Link to="/forgot-password" className="text-blue-600 ml-2">
            Lupa Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
