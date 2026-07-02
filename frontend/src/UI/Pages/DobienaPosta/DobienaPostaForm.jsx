import { useState, useEffect } from "react";
import api from "../../../api/api";

export default function DobienaPostaForm() {
  const [isprakjaci, setIsprakjaci] = useState([]);
  const [vidovi, setVidovi] = useState([]);
  const [korisnici, setKorisnici] = useState([]);
  const [arhivi, setArhivi] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    datumZaveduvanje: "",
    tipPosta: "DOBIEN",
    prioritet: "NORMALEN",
    isprakjacId: "",
    brAktNivni: "",
    datumIsprakjanje: "",
    brAktArhivski: "",
    vidPredmetId: "",
    sodrzina: "",
    odgovornoLiceId: "",
    informativnaPosta: false,
    realizirano: false,
    arhivaId: "",
    zabeleska: "",
  });

  useEffect(() => {
    api.get("/isprakjac").then((r) => setIsprakjaci(r.data)).catch(() => {});
    api.get("/vid-predmet").then((r) => setVidovi(r.data)).catch(() => {});
    api.get("/korisnici").then((r) => setKorisnici(r.data)).catch(() => {});
    api.get("/arhiva").then((r) => setArhivi(r.data)).catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.datumZaveduvanje) return setError("Датумот на заведување е задолжителен");
    if (!form.isprakjacId) return setError("Испраќачот е задолжителен");
    if (!form.sodrzina) return setError("Содржината е задолжителна");

    setSubmitting(true);
    try {
      await api.post("/predmet/dobieni", {
        ...form,
        isprakjacId: Number(form.isprakjacId),
        vidPredmetId: form.vidPredmetId ? Number(form.vidPredmetId) : null,
        odgovornoLiceId: form.odgovornoLiceId ? Number(form.odgovornoLiceId) : null,
        arhivaId: form.arhivaId ? Number(form.arhivaId) : null,
      });
      setSuccess(true);
      setForm({
        datumZaveduvanje: "",
        tipPosta: "DOBIEN",
        prioritet: "NORMALEN",
        isprakjacId: "",
        brAktNivni: "",
        datumIsprakjanje: "",
        brAktArhivski: "",
        vidPredmetId: "",
        sodrzina: "",
        odgovornoLiceId: "",
        informativnaPosta: false,
        realizirano: false,
        arhivaId: "",
        zabeleska: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Грешка при зачувување");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Внес на добиена пошта</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          Предметот е успешно зачуван!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Датум на заведување */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Датум на заведување *
          </label>
          <input
            type="date"
            name="datumZaveduvanje"
            value={form.datumZaveduvanje}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Приоритет */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Приоритет
          </label>
          <select
            name="prioritet"
            value={form.prioritet}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NORMALEN">Нормален</option>
            <option value="VISOK">Висок</option>
          </select>
        </div>

        {/* Испраќач */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Испраќач *
          </label>
          <select
            name="isprakjacId"
            value={form.isprakjacId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Избери испраќач --</option>
            {isprakjaci.map((i) => (
              <option key={i.id} value={i.id}>{i.naziv}</option>
            ))}
          </select>
        </div>

        {/* Нивни број на акт */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Нивни број на акт
          </label>
          <input
            type="text"
            name="brAktNivni"
            value={form.brAktNivni}
            onChange={handleChange}
            placeholder="пр. 12.1.2-9/1-2026"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Датум на испраќање */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Датум на испраќање
          </label>
          <input
            type="date"
            name="datumIsprakjanje"
            value={form.datumIsprakjanje}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Архивски број */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Архивски број на акт
          </label>
          <input
            type="text"
            name="brAktArhivski"
            value={form.brAktArhivski}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Вид на предмет */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Вид на предмет
          </label>
          <select
            name="vidPredmetId"
            value={form.vidPredmetId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Избери вид --</option>
            {vidovi.map((v) => (
              <option key={v.id} value={v.id}>{v.naziv}</option>
            ))}
          </select>
        </div>

        {/* Содржина */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Содржина *
          </label>
          <textarea
            name="sodrzina"
            value={form.sodrzina}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Одговорно лице */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Одговорно лице
          </label>
          <select
            name="odgovornoLiceId"
            value={form.odgovornoLiceId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Избери лице --</option>
            {korisnici.map((k) => (
              <option key={k.id} value={k.id}>{k.ime} {k.prezime}</option>
            ))}
          </select>
        </div>

        {/* Архива */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Архива
          </label>
          <select
            name="arhivaId"
            value={form.arhivaId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Избери архива --</option>
            {arhivi.map((a) => (
              <option key={a.id} value={a.id}>{a.naziv}</option>
            ))}
          </select>
        </div>

        {/* Забелешка */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Забелешка
          </label>
          <textarea
            name="zabeleska"
            value={form.zabeleska}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="informativnaPosta"
              checked={form.informativnaPosta}
              onChange={handleChange}
            />
            Информативна пошта
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="realizirano"
              checked={form.realizirano}
              onChange={handleChange}
            />
            Реализирано
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Се зачувува..." : "Зачувај"}
        </button>
      </form>
    </div>
  );
}