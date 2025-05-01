"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList"; // Liste des données de salle
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditRoomPopup } from "./EditRoomPopup";
import { AddRoomPopup } from "./AddRoomPopup";
import { Room } from "@/app/interfaces"; // Type des salles
import { Dialog, DialogContent } from "@/components/ui/dialog";

/** ✅ Fonction pour récupérer le token JWT */
const getAuthToken = () => localStorage.getItem("jwtToken") || "";

/** ✅ Fonction pour créer les headers avec JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour le filtrage
  const [filterType, setFilterType] = useState<string>("name"); // Type de filtre par défaut : Nom
  const [searchTerm, setSearchTerm] = useState<string>("");

  // État du popup
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState<boolean>(false);

  /** ✅ Fetch rooms from API */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/rooms", {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch rooms");

        const responseData = await response.json();
        const roomsData = responseData.data;

        const formattedRooms = roomsData.map((room: any) => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          location: room.location || "Unknown", // Ajout d'une localisation par exemple
        }));

        setRooms(formattedRooms);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  /** ✅ Filtrage dynamique */
  const filteredRooms = rooms.filter((room) => {
    const value = room[filterType as keyof Room];
    if (value === undefined || value === null) {
      return false; // Si la valeur est undefined ou null, on ne la filtre pas.
    }
    return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  /** ✅ Fonction pour ajouter une salle */
  /** ✅ Fonction pour ajouter une salle */
const handleAddRoom = async (newRoom: { name: string; capacity: number; location: string }) => {
  try {
    const response = await fetch("http://localhost:8080/admin/rooms", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newRoom),
    });

    if (!response.ok) throw new Error("Échec de l'ajout de la salle");

    const responseData = await response.json();
    const addedRoom: Room = {
      id: responseData.data.id,
      name: responseData.data.name,
      capacity: responseData.data.capacity,
      location: responseData.data.location || "Unknown",
    };

    setRooms((prevRooms) => [...prevRooms, addedRoom]);
  } catch (err) {
    setError((err as Error).message);
  }
};

/** ✅ Fonction pour modifier une salle */
const handleEditRoom = async (updatedRoom: Room) => {
  try {
    const response = await fetch(`http://localhost:8080/admin/rooms/${updatedRoom.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        name: updatedRoom.name,
        capacity: updatedRoom.capacity,
        location: updatedRoom.location,
      }),
    });

    if (!response.ok) throw new Error("Échec de la mise à jour de la salle");

    const responseData = await response.json();
    const updatedData: Room = {
      id: responseData.data.id,
      name: responseData.data.name,
      capacity: responseData.data.capacity,
      location: responseData.data.location || "Unknown",
    };

    setRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === updatedRoom.id ? updatedData : room))
    );
  } catch (err) {
    setError((err as Error).message);
  }
};

  /** ✅ Fonction pour supprimer une salle */
const handleDeleteRoom = async (roomId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/admin/rooms/${roomId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete room");

    // Remove the deleted room from the list of rooms
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
  } catch (err) {
    setError((err as Error).message);
  }
};


  if (loading) return <p className="text-center text-gray-500">Loading rooms...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>

      {/* Search input with filter icon button at the end */}
      <div className="relative mb-2">
        <input
          type="text"
          className="p-3 border w-full pr-12"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-md bg-pastel-purple text-black border border-pastel-purple shadow-sm hover:bg-pastel-purple/80 transition"
          onClick={() => setIsFilterPopupOpen(true)}
          tabIndex={0}
          type="button"
          aria-label="Open filter dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
          </svg>
        </button>
      </div>

      {/* ✅ Liste des rooms filtrée */}
      <DataList
        data={filteredRooms}
        headers={["ID", "Name", "Capacity", "Location"]}
        displayEditDialog={(room) => (
          <EditRoomPopup room={room} onSave={handleEditRoom} />
        )}
        displayDeleteDialog={(room) => (
          <DeleteConfirmationPopup
            item={room}
            onDelete={() => handleDeleteRoom(room.id)}
          />
        )}
        displayAddDialog={() => <AddRoomPopup onAdd={handleAddRoom} />}
      />

      {/* Filter selection popup using shadcn Dialog, matching Teacher Page style */}
      <Dialog open={isFilterPopupOpen} onOpenChange={setIsFilterPopupOpen}>
        <DialogContent className="bg-white p-0 rounded-2xl shadow-2xl max-w-md">
          <div className="p-8">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={() => setIsFilterPopupOpen(false)}
              aria-label="Close"
              tabIndex={0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-100 rounded-full p-3 mb-2 shadow">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Choose a Filter</h2>
              <p className="text-gray-500 text-sm">Select which field you want to filter rooms by.</p>
            </div>
            <div className="space-y-4">
              {["name", "capacity", "location"].map((type) => (
                <button
                  key={type}
                  className={`flex items-center w-full px-4 py-3 rounded-lg border-2 transition text-lg font-medium shadow-sm
                    ${
                      filterType === type
                        ? "bg-pastel-purple text-gray-900 border-gray-700 scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:scale-105"
                    }
                  `}
                  onClick={() => {
                    setFilterType(type);
                    setIsFilterPopupOpen(false);
                  }}
                >
                  <span className="mr-3">
                    {type === "name" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {type === "capacity" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                      </svg>
                    )}
                    {type === "location" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0c-4 0-7 2.239-7 5v2a1 1 0 001 1h12a1 1 0 001-1v-2c0-2.761-3-5-7-5z" />
                      </svg>
                    )}
                  </span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {filterType === type && (
                    <span className="ml-auto text-xs bg-white text-gray-700 px-2 py-1 rounded shadow border border-gray-200">Selected</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <div className="h-2 w-24 rounded-full bg-gray-200 opacity-50"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
