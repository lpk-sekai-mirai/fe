import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import Background from "../assets/img-bg.webp";
import Logo from "../assets/logoFull.webp";

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
    <div className="font-sekai min-h-screen flex items-center justify-center "
    style={{ backgroundImage: `url(${Background})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-lg w-96 backdrop-blur-sm"
      >
        {/* <h2 className="text-2xl font-bold text-center">
          Login LPK Sekai Mirai
        </h2> */}
        <img 
          src={Logo} 
          alt="logo-LPK"
          className="h-32 w-32 object-contain md:w-64 ml-8 mb-8"  
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Email / Username / No HP"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-4 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-700"
        >
          Login
        </button>
        <div className="mt-4 text-sm text-center text-white">
          <Link to="/register" className="text-primary">
            Daftar
          </Link>{" "}
          |
          <Link to="/forgot-password" className="text-primary ml-2">
            Lupa Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
