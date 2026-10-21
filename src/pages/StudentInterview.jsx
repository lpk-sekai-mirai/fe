import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

const StudentInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    statusInterview: "belum",
    perusahaanLulus: "",
    perusahaanLulusJepang: "",
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
          perusahaanLulusJepang: res.data.perusahaanLulusJepang || "",
          tanggalKeberangkatan: res.data.tanggalKeberangkatan || "",
        });
      })
      .catch((err) => alert(err.response?.data?.error || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.statusInterview === "lulus") {
      const tanggal = form.tanggalKeberangkatan.trim();

      // Menerima YYYY, YYYY-MM, atau YYYY-MM-DD.
      const polaTanggal =
        /^(\d{4}|\d{4}-(0[1-9]|1[0-2])|\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;

      if (tanggal && !polaTanggal.test(tanggal)) {
        alert(
          "Format tanggal tidak valid. Gunakan YYYY, YYYY-MM, atau YYYY-MM-DD."
        );
        return;
      }

      // Validasi tanggal kalender untuk format lengkap.
      if (tanggal.length === 10) {
        const [tahun, bulan, hari] = tanggal.split("-").map(Number);
        const tanggalValid = new Date(Date.UTC(tahun, bulan - 1, hari));

        if (
          tanggalValid.getUTCFullYear() !== tahun ||
          tanggalValid.getUTCMonth() !== bulan - 1 ||
          tanggalValid.getUTCDate() !== hari
        ) {
          alert("Tanggal kalender tidak valid.");
          return;
        }
      }
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        tanggalKeberangkatan:
          form.statusInterview === "lulus"
            ? form.tanggalKeberangkatan.trim() || null
            : null,
      };

      await api.put(`/students/${id}/interview`, payload);

      alert("Data interview berhasil disimpan!");
      navigate("/students");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!student) {
    return <div className="p-6">Siswa tidak ditemukan.</div>;
  }

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

      <div className="bg-gray-50 border rounded p-4 mb-6 flex gap-4 items-center">
        {student.foto ? (
          <img
            src={student.foto}
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
          </select>
        </div>

        {isLulus && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Perusahaan Lulus (Indonesia)
                <span className="text-red-500"> *</span>
              </label>

              <input
                name="perusahaanLulus"
                placeholder="Contoh: PT. Toyota Motor"
                value={form.perusahaanLulus}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Perusahaan Lulus (Jepang)
              </label>

              <input
                name="perusahaanLulusJepang"
                placeholder="Contoh: トヨタ自動車"
                value={form.perusahaanLulusJepang}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Keberangkatan ke Jepang
              </label>

              <input
                name="tanggalKeberangkatan"
                type="text"
                inputMode="numeric"
                placeholder="YYYY atau YYYY-MM-DD"
                value={form.tanggalKeberangkatan}
                onChange={handleChange}
                maxLength={10}
                autoComplete="off"
                className="border p-2 rounded w-full"
              />

              <p className="text-xs text-gray-500 mt-1">
                Isi sesuai informasi yang tersedia:
              </p>

              <ul className="text-xs text-gray-500 mt-1 list-disc pl-5">
                <li>2027 — hanya tahun</li>
                <li>2027-05 — bulan dan tahun</li>
                <li>2027-05-15 — tanggal lengkap</li>
              </ul>

              <p className="text-xs text-gray-500 mt-2">
                Boleh dikosongkan jika informasi keberangkatan belum tersedia.
              </p>
            </div>
          </>
        )}

        {!isLulus && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm">
            Data perusahaan dan tanggal keberangkatan hanya bisa diisi jika
            status <strong>Lulus Interview</strong>.
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
