"use client";
import { useState, useEffect } from "react";

//const API_BASE = "https://koya-booking-backend.de2.netrun.io/api";

const API_BASE = "/api-backend";
const API_KEY = "koya-secret-key";

export default function Home() {
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [error, setError] = useState("");

  const loadSlots = async () => {
    try {
      const res = await fetch(`${API_BASE}/slots`, {
        headers: { "X-API-Key": API_KEY },
      });
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({ slot_id: selectedSlot, name, email }),
    });

    const data = await res.json();
    if (res.ok) {
      setConfirmation(data);
      loadSlots();
    } else {
      setError(data.error || "Failed to book");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Clinic Booking</h1>
        
        {/* Slot List */}
        <div className="space-y-4">
          {slots.length === 0 && <p className="text-gray-500">No slots available. Add some using the API docs.</p>}
          {slots.map((slot) => (
            <div key={slot.id} className={`p-4 border rounded ${slot.available ? "bg-white" : "bg-gray-200"}`}>
              <p className="font-semibold">{slot.provider}</p>
              <p className="text-sm text-gray-600">{new Date(slot.start).toLocaleString()}</p>
              {slot.available ? (
                <button
                  onClick={() => setSelectedSlot(slot.id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Select Slot
                </button>
              ) : (
                <span className="text-red-500 text-sm mt-2 block">Already Booked</span>
              )}
            </div>
          ))}
        </div>

        {/* Booking Form */}
        {selectedSlot && !confirmation && (
          <form onSubmit={handleBook} className="mt-6 border-t pt-4">
            <h2 className="text-lg font-bold mb-2">Book Slot: {selectedSlot}</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Confirm Booking
            </button>
          </form>
        )}

        {/* Confirmation */}
        {confirmation && (
          <div className="mt-6 bg-green-100 p-4 rounded border border-green-400">
            <h2 className="font-bold text-green-800">Booking Confirmed!</h2>
            <p>Booking ID: {confirmation.id}</p>
            <button onClick={() => { setConfirmation(null); setSelectedSlot(null); setName(""); setEmail(""); }} className="mt-4 text-blue-600 underline">
              Book another slot
            </button>
          </div>
        )}
      </div>
    </main>
  );
}