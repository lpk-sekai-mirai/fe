import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const StudentInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    statusInterview: "belum",
    perusahaanLulus: "",
    tanggalKeberangkatan: "",
  });

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => {
        setStudent(res.data);
        setForm({
          statusInterview: res.data.statusInterview || "belum",
          perusahaanLulus: res.data.perusahaanLulus || "",
          tanggalKeberangkatan: res.data.tanggalKeberangkatan || "",
        });
      })
      .catch((err) => alert(err.response?.data?.error || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/students/${id}/interview`, form);
      alert("Data interview berhasil disimpan!");
      navigate("/students");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!student) return <div className="p-6">Siswa tidak ditemukan.</div>;

  const isLulus = form.statusInterview === "lulus";

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/students" className="text-blue-600 text-sm hover:underline">
        ← Kembali ke Daftar Siswa
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-1">Hasil Interview Siswa</h1>
      <p className="text-gray-500 mb-6">
        Atur status interview dan data perusahaan untuk siswa ini.
      </p>

      {/* Info Siswa */}
      <div className="bg-gray-50 border rounded p-4 mb-6 flex gap-4 items-center">
        {student.foto ? (
          <img
            src={`${BACKEND_URL}${student.foto}`}
            alt={student.nama}
            className="w-20 h-20 object-cover rounded-full border"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
            No Photo
          </div>
        )}
        <div>
          <p className="font-semibold text-lg">{student.nama}</p>
          <p className="text-sm text-gray-600">ID: {student.id}</p>
          <p className="text-xs text-gray-500">UID: {student.uid}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Status Interview */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Status Interview <span className="text-red-500">*</span>
          </label>
          <select
            name="statusInterview"
            value={form.statusInterview}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="belum">Belum Interview</option>
            <option value="lulus">Lulus Interview</option>
            <option value="tidak lulus">Tidak Lulus</option>
          </select>
        </div>

        {/* Field yang muncul hanya kalau lulus */}
        {isLulus && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Perusahaan Lulus <span className="text-red-500">*</span>
              </label>
              <input
                name="perusahaanLulus"
                placeholder="Contoh: PT. Toyota Motor"
                value={form.perusahaanLulus}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required={isLulus}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Keberangkatan ke Jepang
              </label>
              <input
                name="tanggalKeberangkatan"
                type="date"
                value={form.tanggalKeberangkatan || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Boleh dikosongkan kalau tanggal belum pasti.
              </p>
            </div>
          </>
        )}

        {!isLulus && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm">
            Data perusahaan & tanggal keberangkatan hanya bisa diisi jika status{" "}
            <strong>Lulus Interview</strong>.
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentInterview;
