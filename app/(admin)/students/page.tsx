"use client";

import { useEffect, useState } from "react";
import { X, Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import axios, { AxiosResponse } from "axios";

interface ICourse {
  _id: string;
  title: string;
}

export interface IStudent {
  _id?: string;
  name: string;
  phone: string;
  course: string | { _id: string; title: string };
  startDate: string;
  paymentStatus: "paid" | "unpaid" | "overdue";
  lastPaymentDate?: string;
  createdAt?: string;
  paymentAmount?: number;
}

type StudentForm = {
  name: string;
  phone: string;
  course: string;
  startDate: string;
};

// helper
function getArrayFromResponse<T>(res: AxiosResponse | T[] | undefined): T[] {
  if (!res) return [];
  if (Array.isArray((res as AxiosResponse).data)) {
    return (res as AxiosResponse).data as T[];
  }
  if (
    (res as AxiosResponse).data &&
    Array.isArray((res as AxiosResponse).data.data)
  ) {
    return (res as AxiosResponse).data.data as T[];
  }
  if (Array.isArray(res)) return res as T[];
  return [];
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
    startDate: new Date().toISOString().split("T")[0],
  });

  // payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // fetch
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get<IStudent[]>("/api/students");
        setStudents(getArrayFromResponse<IStudent>(res));
      } catch (err) {
        console.error("fetchStudents error:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await axios.get<ICourse[]>("/api/courses");
        setCourses(getArrayFromResponse<ICourse>(res));
      } catch (err) {
        console.error("fetchCourses error:", err);
      }
    };

    fetchStudents();
    fetchCourses();
  }, []);

  // add modal
  const openAddModal = () => {
    setEditStudent(null);
    setForm({
      name: "",
      phone: "",
      course: "",
      startDate: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  // edit modal
  const openEditModal = (st: IStudent) => {
    setEditStudent(st);
    setForm({
      name: st.name,
      phone: st.phone,
      course: typeof st.course === "string" ? st.course : st.course?._id || "",
      startDate: st.startDate
        ? st.startDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  // submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editStudent?._id) {
        await axios.put("/api/students", { id: editStudent._id, ...form });
      } else {
        await axios.post("/api/students", form);
      }
      setModalOpen(false);
      setEditStudent(null);
      const res = await axios.get<IStudent[]>("/api/students");
      setStudents(getArrayFromResponse<IStudent>(res));
    } catch (err) {
      console.error("handleSubmit error:", err);
      alert("Serverda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // delete
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Haqiqatan ham o`chirmoqchimisiz?")) return;
    try {
      await axios.delete("/api/students", { data: { id } });
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("O`chirishda xato yuz berdi");
    }
  };

  // open payment modal
  const openPaymentModal = (st: IStudent) => {
    setSelectedStudent(st);
    setPaymentAmount("");
    setPaymentModalOpen(true);
  };

  // confirm payment (PATCH ishlatamiz)
  const handlePaymentConfirm = async () => {
    if (!selectedStudent?._id) return;
    try {
      await axios.patch("/api/students", {
        id: selectedStudent._id,
        amount: Number(paymentAmount || 0),
        month: new Date().getMonth() + 1,
      });

      const res = await axios.get<IStudent[]>("/api/students");
      setStudents(getArrayFromResponse<IStudent>(res));
      setPaymentModalOpen(false);
      setSelectedStudent(null);
    } catch {
      alert("To`lovni yangilashda xato");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Talabalar</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Talaba qo`shish
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
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  Hozircha talabalar yo`q
                </td>
              </tr>
            ) : (
              students.map((t, idx) => {
                const courseTitle =
                  typeof t.course === "string"
                    ? courses.find((c) => c._id === t.course)?.title
                    : t.course?.title;
                return (
                  <tr key={t._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{idx + 1}</td>
                    <td
                      className="p-4 font-medium cursor-pointer text-blue-600"
                      onClick={() => openEditModal(t)}
                    >
                      {t.name}
                    </td>
                    <td className="p-4">{t.phone}</td>
                    <td className="p-4">{courseTitle || "Noma’lum kurs"}</td>
                    <td className="p-4">
                      {t.startDate
                        ? new Date(t.startDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          t.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : t.paymentStatus === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.paymentStatus}
                      </span>
                      {t.lastPaymentDate && (
                        <div className="text-xs text-gray-500">
                          Oxirgi to`lov:{" "}
                          {new Date(t.lastPaymentDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="p-4 flex justify-end gap-3">
                      <button
                        onClick={() => openPaymentModal(t)}
                        className="p-2 rounded-lg hover:bg-green-100 text-green-600"
                      >
                        <DollarSign className="w-5 h-5" />
                      </button>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Student modal (add/edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div className="bg-white w-full max-w-lg h-full p-10 shadow-xl animate-slideInRight relative pointer-events-auto">
            <button
              onClick={() => {
                setModalOpen(false);
                setEditStudent(null);
              }}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-8">
              {editStudent ? "Talabani tahrirlash" : "Talaba qo`shish"}
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
                type="text"
                placeholder="Telefon raqami"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kursni tanlang</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="border rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 flex justify-center items-center"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : editStudent ? (
                  "Saqlash"
                ) : (
                  "Qo`shish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment modal */}
      {paymentModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 w-[400px] relative">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-6">To`lov qilish</h2>
            <p className="mb-4">
              Talaba:{" "}
              <span className="font-semibold">{selectedStudent.name}</span>
            </p>
            <input
              type="number"
              placeholder="To`lov summasi"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="border rounded-lg p-3 w-full mb-6 focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handlePaymentConfirm}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex justify-center items-center"
            >
              <DollarSign className="w-5 h-5 mr-2" /> To`lovni tasdiqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
