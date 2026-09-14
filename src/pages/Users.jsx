import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/users");

      // 🔑 Validasi: pastikan array
      if (!Array.isArray(res.data)) {
        console.error("Response bukan array:", res.data);
        setUsers([]);
        setError(
          res.data?.error ||
            "Data user tidak valid. Pastikan Anda login sebagai admin."
        );
      } else {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]);
      setError(
        err.response?.data?.error || err.message || "Gagal memuat data user."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveUser = async (id) => {
    try {
      await api.put(`/users/${id}/approve`);
      setActionMsg("User berhasil disetujui.");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal approve user");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      setActionMsg(`Role diubah menjadi ${role}.`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal mengubah role");
    }
  };

  // Auto-hide notifikasi
  useEffect(() => {
    if (!actionMsg) return;
    const t = setTimeout(() => setActionMsg(""), 2500);
    return () => clearTimeout(t);
  }, [actionMsg]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manajemen Users</h1>

      {actionMsg && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {actionMsg}
        </div>
      )}

      {loading && <p className="text-gray-500 italic">Memuat data user...</p>}

      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="bg-gray-100 p-6 rounded text-center text-gray-600">
          Belum ada user terdaftar.
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>No HP</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b text-center">
                  <td className="p-2">{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.noHp}</td>
                  <td>
                    <span
                      className={
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                          : "bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        u.status === "approved"
                          ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                          : u.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs"
                          : "bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.status === "pending" && (
                      <button
                        onClick={() => approveUser(u.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-1 hover:bg-green-600 text-xs"
                      >
                        Approve
                      </button>
                    )}
                    <select
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      defaultValue={u.role}
                      className="border rounded p-1 text-xs"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
