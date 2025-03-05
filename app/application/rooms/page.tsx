"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList"; // Liste des données de salle
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditRoomPopup } from "./EditRoomPopup";
import { AddRoomPopup } from "./AddRoomPopup";
import { Room } from "@/app/interfaces"; // Type des salles

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

      {/* ✅ Barre de recherche avec sélection du filtre */}
      <div className="space-y-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => setIsFilterPopupOpen(true)}
        >
          Choose a filter
        </button>

        <input
          type="text"
          className="p-3 border w-full"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            onDelete={() => handleDeleteRoom(room.id)} // Call the handleDeleteRoom function here
          />
        )}
        displayAddDialog={() => <AddRoomPopup onAdd={handleAddRoom} />}
      />

      {/* ✅ Popup de sélection du type de filtre */}
      {isFilterPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Filter by</h2>
            <div className="space-y-2">
              {["name", "capacity", "location"].map((type) => (
                <button
                  key={type}
                  className={`block w-52 p-3 text-left text-base font-medium rounded-md ${
                    filterType === type ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setFilterType(type);
                    setIsFilterPopupOpen(false);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
