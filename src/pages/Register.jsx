import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    noHp: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg("Registrasi berhasil! Silakan tunggu approval admin.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Gagal registrasi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {msg && <p className="text-green-600 text-sm mb-4">{msg}</p>}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          name="noHp"
          placeholder="No HP"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Daftar
        </button>
        <p className="mt-2 text-sm text-center">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
