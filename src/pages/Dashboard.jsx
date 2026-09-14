import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

const BACKEND_URL = "https://be-04mm.onrender.com";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    totalLulusInterview: 0,
    totalBerangkat: 0,
    photos: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats({
          total: res.data?.total ?? 0,
          totalLulusInterview: res.data?.totalLulusInterview ?? 0,
          totalBerangkat: res.data?.totalBerangkat ?? 0,
          photos: Array.isArray(res.data?.photos) ? res.data.photos : [],
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Memuat dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">
        Selamat datang, {user?.username} ({user?.role})
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Siswa</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Lulus Interview</h3>
          <p className="text-3xl font-bold">{stats.totalLulusInterview}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Sudah Berangkat</h3>
          <p className="text-3xl font-bold">{stats.totalBerangkat}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Foto Siswa Terbaru</h2>

      {stats.photos.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada foto siswa.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.photos.map((p, idx) => (
            <div key={idx} className="bg-gray-200 p-2 rounded text-center">
              <img
                src={
                  p.foto
                    ? `${BACKEND_URL}${p.foto}`
                    : "https://via.placeholder.com/150"
                }
                alt={p.nama}
                className="w-full h-24 object-cover rounded"
              />
              <p className="text-sm mt-1">{p.nama}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
