import { useState } from "react";
import api from "../api/axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("Link reset password telah dikirim ke email Anda.");
    } catch (err) {
      setMsg(err.response?.data?.error || "Gagal mengirim email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Lupa Password</h2>
        {msg && <p className="text-blue-600 text-sm mb-4">{msg}</p>}
        <input
          type="email"
          placeholder="Masukkan email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700"
        >
          Kirim Link Reset
        </button>
        <p className="mt-2 text-sm text-center">
          <a href="/login" className="text-blue-600">
            Kembali ke Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
