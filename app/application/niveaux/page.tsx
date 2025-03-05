"use client";
import { useState, useEffect } from "react";
import DataListNiv from "@/components/dataListNiv";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditNiveauPopup } from "./EditNiveauPopup";
import { AddNiveauPopup } from "./AddNiveauPopup";
import { Niveau } from "@/app/interfaces";

// Récupérer le token JWT
const getAuthToken = () => localStorage.getItem("jwtToken") || "";

// Créer les headers avec JWT
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export default function NiveauPage() {
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Récupération des niveaux depuis l'API
  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/niveau", {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Échec du chargement des niveaux");

        const responseData = await response.json();

        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Format de réponse invalide");
        }

        const formattedNiveaux = responseData.data.map((niveau: any) => ({
          id: niveau.id,
          name: niveau.name,
        }));

        setNiveaux(formattedNiveaux);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNiveaux();
  }, []);

  // Filtrer les niveaux en fonction du terme de recherche
  const filteredNiveaux = niveaux.filter((niveau) =>
    niveau.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mise à jour d'un niveau
  const handleEditNiveau = async (updatedNiveau: Niveau) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/niveau/${updatedNiveau.id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ name: updatedNiveau.name }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour du niveau");

      const responseData = await response.json();
      const updatedData: Niveau = {
        id: responseData.data.id,
        name: responseData.data.name,
        students: [],
      };

      setNiveaux((prev) =>
        prev.map((niv) => (niv.id === updatedNiveau.id ? updatedData : niv))
      );
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    }
  };

  // Suppression d'un niveau
  const handleDeleteNiveau = async (niveauToDelete: Niveau) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/niveau/${niveauToDelete.id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Échec de la suppression du niveau");

      setNiveaux((prev) => prev.filter((niv) => niv.id !== niveauToDelete.id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // Ajout d'un nouveau niveau
  const handleAddNiveau = async (newNiveau: { name: string }) => {
    try {
      const response = await fetch("http://localhost:8080/admin/niveau", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: newNiveau.name }),
      });

      if (!response.ok) throw new Error("Échec de l'ajout du niveau");

      const responseData = await response.json();
      const createdNiveau = responseData.data;

      setNiveaux((prev) => [...prev, createdNiveau]);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Chargement des niveaux...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Grades</h1>

      {/* Champ de recherche */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border w-full"
        />
      </div>

      <DataListNiv
        data={filteredNiveaux}
        headers={["ID", "Nom"]}

        // Fenêtre d'édition
        displayEditDialog={(niveau) => (
          <EditNiveauPopup niveau={niveau} onSave={handleEditNiveau} />
        )}

        // Fenêtre de suppression
        displayDeleteDialog={(niveau) => (
          <DeleteConfirmationPopup
            item={niveau}
            onDelete={handleDeleteNiveau}
          />
        )}

        // Fenêtre d'ajout
        displayAddDialog={() => <AddNiveauPopup onAdd={handleAddNiveau} />}
      />
    </div>
  );
}
