import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) setMsg("Token tidak valid");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMsg("Password berhasil direset!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Gagal reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {msg && <p className="text-green-600 text-sm mb-4">{msg}</p>}
        <input
          type="password"
          placeholder="Password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
