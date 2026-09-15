import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const StatusBadge = ({ status }) => {
  const styles = {
    belum: "bg-gray-100 text-gray-700",
    lulus: "bg-green-100 text-green-700",
    "tidak lulus": "bg-red-100 text-red-700",
  };
  const labels = {
    belum: "Belum",
    lulus: "Lulus",
    "tidak lulus": "Tidak Lulus",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs ${styles[status] || styles.belum}`}
    >
      {labels[status] || status}
    </span>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/students");
      if (Array.isArray(res.data)) setStudents(res.data);
      else {
        setStudents([]);
        setError("Data dari server tidak valid.");
      }
    } catch (err) {
      setStudents([]);
      setError(err.response?.data?.error || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menghapus");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Data Siswa</h1>
        <Link
          to="/students/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Tambah Siswa
        </Link>
      </div>

      {loading && <p className="text-gray-500 italic">Memuat...</p>}
      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {!loading && !error && students.length === 0 && (
        <div className="bg-gray-100 p-6 rounded text-center text-gray-600">
          Belum ada data siswa.
        </div>
      )}

      {!loading && !error && students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Foto</th>
                <th>ID</th>
                <th>Nama</th>
                <th>Umur</th>
                <th>Telp</th>
                <th>Status</th>
                <th>Perusahaan</th>
                <th>Keberangkatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b text-center">
                  <td className="p-2">
                    {s.foto ? (
                      <img
                        src={s.foto}
                        alt={s.nama}
                        className="w-12 h-12 object-cover rounded-full mx-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="text-xs">{s.id}</td>
                  <td className="font-medium">{s.nama}</td>
                  <td>{s.umur || "-"}</td>
                  <td>{s.telp || "-"}</td>
                  <td>
                    <StatusBadge status={s.statusInterview || "belum"} />
                  </td>
                  <td>{s.perusahaanLulus || "-"}</td>
                  <td>
                    {s.tanggalKeberangkatan
                      ? new Date(s.tanggalKeberangkatan).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 items-center">
                      <Link
                        to={`/students/edit/${s.id}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Edit Data
                      </Link>
                      <Link
                        to={`/students/interview/${s.id}`}
                        className={`text-xs hover:underline ${
                          s.statusInterview === "lulus"
                            ? "text-green-600"
                            : "text-purple-600"
                        }`}
                      >
                        {s.statusInterview === "lulus"
                          ? "Edit Interview"
                          : "Set Interview"}
                      </Link>
                      <button
                        onClick={() => deleteStudent(s.id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Hapus
                      </button>
                    </div>
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

export default StudentList;
