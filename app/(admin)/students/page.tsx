'use client'

import { useEffect, useState } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import axios, { AxiosError } from "axios";

interface ICourse {
  _id: string;
  title: string;
}

export interface IStudent {
  _id?: string;
  name: string;
  phone: string;
  course: string; // course ID
  startDate: string;
  paymentStatus: "paid" | "unpaid" | "overdue";
  lastPaymentDate?: string;
  createdAt?: string;
}

type StudentForm = Omit<IStudent, "_id" | "createdAt" | "paymentStatus">;

interface IErrorResponse {
  error: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<StudentForm>({
    name: "",
    phone: "",
    course: "",
    startDate: "",
  });

  // 🔹 Fetch students & courses
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get<IStudent[]>("/api/students");
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await axios.get<ICourse[]>("/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditStudent(null);
    setForm({ name: "", phone: "", course: "", startDate: "" });
    setModalOpen(true);
  };

  const openEditModal = (st: IStudent) => {
    setEditStudent(st);
    setForm({
      name: st.name,
      phone: st.phone,
      course: st.course,
      startDate: st.startDate.split("T")[0],
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editStudent?._id) await axios.put("/api/students", { ...form, _id: editStudent._id });
      else await axios.post("/api/students", form);

      setModalOpen(false);
      setEditStudent(null);
      const res = await axios.get<IStudent[]>("/api/students");
      setStudents(res.data);
    } catch (err) {
      const error = err as AxiosError<IErrorResponse>;
      if (error.response?.data?.error) alert(error.response.data.error);
      else alert("Serverda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`/api/students?id=${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("O‘chirishda xato yuz berdi");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Talabalar</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Talaba qo‘shish
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Ism</th>
              <th className="p-4">Telefon</th>
              <th className="p-4">Kurs</th>
              <th className="p-4">Boshlanish sanasi</th>
              <th className="p-4">Holat</th>
              <th className="p-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">Hozircha talabalar yo‘q</td></tr>
            ) : (
              students.map((t, idx) => {
                const courseTitle = courses.find((c) => c._id === t.course)?.title || "Noma’lum kurs";
                return (
                  <tr key={t._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{idx + 1}</td>
                    <td className="p-4 font-medium">{t.name}</td>
                    <td className="p-4">{t.phone}</td>
                    <td className="p-4">{courseTitle}</td>
                    <td className="p-4">{new Date(t.startDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        t.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                        t.paymentStatus === "overdue" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{t.paymentStatus}</span>
                    </td>
                    <td className="p-4 flex justify-end gap-3">
                      <button onClick={() => openEditModal(t)} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div className="bg-white w-full max-w-lg h-full p-10 shadow-xl animate-slideInRight relative pointer-events-auto">
            <button onClick={() => { setModalOpen(false); setEditStudent(null); }} className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-200">
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-8">{editStudent ? "Talabani tahrirlash" : "Talaba qo‘shish"}</h2>

            <div className="grid grid-cols-1 gap-6">
              <input type="text" placeholder="Ism Familya" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"/>
              <input type="text" placeholder="Telefon raqami" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"/>
              <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500">
                <option value="">Kursni tanlang</option>
                {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
              <input type="date" placeholder="Boshlanish sanasi" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"/>
              <button onClick={handleSubmit} disabled={loading} className="mt-4 w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 flex justify-center items-center">
                {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : editStudent ? "Saqlash" : "Qo‘shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
