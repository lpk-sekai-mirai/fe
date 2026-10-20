import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

import { AiTwotoneEdit } from "react-icons/ai";
import { AiTwotoneContainer } from "react-icons/ai";

const BACKEND_URL = "https://be-04mm.onrender.com";

const StatusBadge = ({ status }) => {
  const styles = {
    belum: "bg-gray-100 text-gray-700",
    lulus: "bg-green-100 text-green-700",
    tidakLulus: "bg-red-100 text-red-700",
  };
  const labels = {
    belum: "Belum",
    lulus: "Lulus",
    tidakLulus: "Tidak Lulus",
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

  const [statusFilter, setStatusFilter] = useState("semua");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

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

  const filteredStudents =
    statusFilter === "semua"
      ? students
      : students.filter(
          (student) => 
            (student.statusInterview || "belum") === statusFilter
        );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const result = a.nama.localeCompare(b.nama);

    return sortOrder === "asc" ? result : -result;
  });

   const handleSortName = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
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
        <div className="overflow-x-auto pb-32">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th>No.</th>
                <th className="p-2">Foto</th>
                {/* <th>ID</th> */}
                <th>
                  <button
                    className="cursor-pointer select-none hover:bg-gray-300 p-2"
                    onClick={handleSortName}
                  >
                    Nama {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </th>
                <th>名前</th>
                <th>Alamat</th>
                <th>住所</th>
                <th>Perusahaan</th>
                <th>会社</th>
                <th>Keberangkatan</th>
                <th className="relative p-2">
                  <button
                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                    className="cursor-pointer font-bold"
                  >
                    Status
                  </button>

                  {showStatusFilter && (
                    <div className="absolute top-full right-0 z-10 mt-1 w-40 rounded bg-white p-2 shadow-lg">
                      <button
                        onClick={() => {
                          setStatusFilter("semua");
                          setShowStatusFilter(false);
                        }}
                        className="block w-full rounded p-2 text-left hover:bg-gray-100"
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("belum");
                          setShowStatusFilter(false);
                        }}
                        className="block w-full rounded p-2 text-left hover:bg-gray-100"
                      >
                        Belum
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("lulus");
                          setShowStatusFilter(false);
                        }}
                        className="block w-full rounded p-2 text-left hover:bg-gray-100"
                      >
                        Lulus
                      </button>
                      {/* <button
                        onClick={() => {
                          setStatusFilter("tidak lulus");
                          setShowStatusFilter(false);
                        }}
                        className="block w-full rounded p-2 text-left hover:bg-gray-100"
                      >
                        Tidak Lulus
                      </button> */}
                    </div>
                  )}
                </th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map((s, index) => (
                  <tr key={s.id} className="border-b text-center">
                    <td>{index + 1}</td>
                    <td className="p-2">
                      {s.foto ? (
                        <img
                          src={`${BACKEND_URL}${s.foto}`}
                          alt={s.nama}
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="font-medium">{s.nama}</td>
                    <td>{s.namaJepang || "-"}</td>
                    <td>{s.alamat || "-"}</td>
                    <td>{s.alamatJepang || "-"}</td>
                    <td>{s.perusahaanLulus || "-"}</td>
                    <td>{s.perusahaanLulusJepang || "-"}</td>
                    <td>
                      {s.tanggalKeberangkatan
                        ? new Date(s.tanggalKeberangkatan).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </td>
                    <td>
                      <StatusBadge status={s.statusInterview || "belum"} />
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-center">
                        <Link
                          to={`/students/edit/${s.id}`}
                          className="text-white bg-blue-600 hover:underline text-sm"
                        >
                          <AiTwotoneEdit />
                          {/* Edit Data */}
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
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="p-6 text-center text-gray-500">
                    Tidak ada data dengan status "{statusFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
