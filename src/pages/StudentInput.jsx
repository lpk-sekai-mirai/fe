import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const StudentInput = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);

  const [form, setForm] = useState({
    uid: "",
    id: "",
    nama: "",
    alamat: "",
    umur: "",
    telp: "",
  });

  // Auto-generate uid untuk tambah baru
  useEffect(() => {
    if (!isEdit) {
      const autoUid = `SMC-${Date.now()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
      setForm((prev) => ({ ...prev, uid: autoUid, id: "" }));
    }
  }, [isEdit]);

  // Load data saat edit
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api
        .get(`/students/${id}`)
        .then((res) => {
          const d = res.data;
          setForm({
            uid: d.uid,
            id: d.id,
            nama: d.nama || "",
            alamat: d.alamat || "",
            umur: d.umur || "",
            telp: d.telp || "",
          });
          // ✅ d.foto sudah berupa URL Cloudinary lengkap
          if (d.foto) setPreview(d.foto);
        })
        .catch((err) => alert(err.response?.data?.error || "Gagal memuat data"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("File harus gambar");
    if (file.size > 5 * 1024 * 1024) return alert("Maks 5 MB");
    setFotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key] ?? ""));
      if (fotoFile) formData.append("foto", fotoFile);

      if (isEdit) await api.put(`/students/${id}`, formData);
      else await api.post("/students", formData);

      navigate("/students");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit" : "Tambah"} Data Siswa
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Data dasar siswa. Data perusahaan & keberangkatan akan diisi setelah
        siswa lulus interview.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* UID & ID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">UID</label>
            <input
              name="uid"
              value={form.uid}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID Siswa</label>
            <input
              name="id"
              value={form.id}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
              placeholder={isEdit ? "" : "Auto saat simpan"}
            />
          </div>
        </div>

        {/* Foto */}
        <div>
          <label className="block text-sm font-medium mb-1">Foto Siswa</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded border shadow mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm border rounded p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maks 5 MB. JPG/PNG/WEBP/GIF.
          </p>
        </div>

        {/* Field dasar */}
        <input
          name="nama"
          placeholder="Nama Lengkap"
          value={form.nama}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="alamat"
          placeholder="Alamat"
          value={form.alamat}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="umur"
          type="number"
          placeholder="Umur"
          value={form.umur}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="telp"
          placeholder="No Telepon"
          value={form.telp}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Simpan
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

export default StudentInput;
