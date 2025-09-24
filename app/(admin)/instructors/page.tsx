"use client";

import { useState, useEffect } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import axios, { AxiosError } from "axios";

export interface IInstructor {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "admin" | "instructor";
  createdAt?: string;
  updatedAt?: string;
}

type InstructorForm = Omit<IInstructor, "_id" | "createdAt" | "updatedAt">;

interface IErrorResponse {
  error: string;
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState<IInstructor | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<InstructorForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "instructor",
  });

  // Fetch all
  const fetchInstructors = async (): Promise<void> => {
    try {
      const res = await axios.get<IInstructor[]>("/api/instructors");
      setInstructors(res.data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Modal scroll lock
  useEffect(() => {
    if (modalOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [modalOpen]);

  const openAddModal = (): void => {
    setEditInstructor(null);
    setForm({ name: "", email: "", phone: "", password: "", role: "instructor" });
    setModalOpen(true);
  };

  const openEditModal = (inst: IInstructor): void => {
    setEditInstructor(inst);
    setForm({
      name: inst.name,
      email: inst.email,
      phone: inst.phone ?? "",
      password: "",
      role: inst.role,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      if (editInstructor?._id) {
        await axios.put<IInstructor>("/api/instructors", {
          ...form,
          _id: editInstructor._id,
        });
      } else {
        await axios.post<IInstructor>("/api/instructors", form);
      }
      setModalOpen(false);
      setEditInstructor(null);
      setForm({ name: "", email: "", phone: "", password: "", role: "instructor" });
      await fetchInstructors();
    } catch (err) {
      const error = err as AxiosError<IErrorResponse>;
      if (error.response?.data?.error) alert(error.response.data.error);
      else alert("Serverda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string): Promise<void> => {
    if (!id) return;
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/instructors?id=${id}`);
      await fetchInstructors();
    } catch (err) {
      console.error("Delete error:", err);
      alert("O‘chirishda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">O‘qituvchilar</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          O‘qituvchi qo‘shish
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Ism</th>
              <th className="p-4">Email</th>
              <th className="p-4">Telefon</th>
              <th className="p-4">Role</th>
              <th className="p-4">Qo‘shilgan sana</th>
              <th className="p-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {instructors.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  Hozircha o‘qituvchilar yo‘q
                </td>
              </tr>
            ) : (
              instructors.map((t, idx) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4 font-medium">{t.name}</td>
                  <td className="p-4">{t.email}</td>
                  <td className="p-4">{t.phone ?? "-"}</td>
                  <td className="p-4">{t.role}</td>
                  <td className="p-4">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div className="bg-white w-full max-w-lg h-full p-10 shadow-xl animate-slideInRight relative pointer-events-auto">
            <button
              onClick={() => {
                setModalOpen(false);
                setEditInstructor(null);
              }}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-8">
              {editInstructor ? "O‘qituvchini tahrirlash" : "O‘qituvchi qo‘shish"}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <input
                type="text"
                placeholder="Ism Familya"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email manzili"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Telefon raqami"
                value={form.phone ?? ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value as "admin" | "instructor",
                  })
                }
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="password"
                placeholder={
                  editInstructor ? "Yangi parol (ixtiyoriy)" : "Parol kiriting"
                }
                value={form.password ?? ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`mt-4 w-full py-4 rounded-lg text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saqlanmoqda...
                  </div>
                ) : editInstructor ? (
                  "Saqlash"
                ) : (
                  "Qo‘shish"
                )}
              </button>
            </div>
          </div>

          <style jsx>{`
            .animate-slideInRight {
              animation: slideInRight 0.25s ease-out forwards;
            }
            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
