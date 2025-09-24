"use client";

import { useState, useEffect } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

interface ICourse {
  _id?: string;
  title: string;
  duration: number;
  price: number;
  teacher?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<ICourse | null>(null);
  const [form, setForm] = useState<ICourse>({
    title: "",
    duration: 1,
    price: 0,
    teacher: "",
  });

  // Fetch all courses from backend
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Body scroll lock when modal open
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [modalOpen]);

  const openAddModal = () => {
    setEditCourse(null);
    setForm({ title: "", duration: 1, price: 0, teacher: "" });
    setModalOpen(true);
  };

  const openEditModal = (course: ICourse) => {
    setEditCourse(course);
    setForm(course);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editCourse?._id) {
        await axios.put("/api/courses", { ...form, _id: editCourse._id });
      } else {
        await axios.post("/api/courses", form);
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`/api/courses?id=${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kurslar</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Kurs qo‘shish
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Kurs nomi</th>
              <th className="p-4">Davomiyligi (oy)</th>
              <th className="p-4">Narxi (UZS)</th>
              <th className="p-4">O‘qituvchi</th>
              <th className="p-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Hozircha kurslar yo‘q
                </td>
              </tr>
            ) : (
              courses.map((course, idx) => (
                <tr key={course._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4">{course.duration}</td>
                  <td className="p-4">
                    {new Intl.NumberFormat("uz-UZ").format(course.price)} so‘m
                  </td>
                  <td className="p-4">{course.teacher || "-"}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button
                      onClick={() => openEditModal(course)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
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

      {/* Drawer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div className="bg-white w-full max-w-lg h-full p-10 shadow-xl animate-slideInRight relative pointer-events-auto">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-8">
              {editCourse ? "Kursni tahrirlash" : "Kurs qo‘shish"}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <input
                type="text"
                placeholder="Kurs nomini kiriting"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Davomiyligi (oylarda)"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Narxini kiriting (UZS)"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="O‘qituvchi ismini kiriting"
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700"
              >
                {editCourse ? "Saqlash" : "Qo‘shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
