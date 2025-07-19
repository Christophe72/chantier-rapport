"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Chantier = {
  id: string;
  nom: string;
  adresse: string;
  dateDebut: string;
  dateFin?: string;
  statut: "Actif" | "Terminé" | "Suspendu";
  description?: string;
};

/**
 * Composant de gestion CRUD des chantiers.
 *
 * Permet de créer, lire, modifier et supprimer des chantiers.
 * Les chantiers sont stockés dans le localStorage.
 */
export default function Chantiers() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Chantier>>({
    nom: "",
    adresse: "",
    dateDebut: "",
    dateFin: "",
    statut: "Actif",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("chantiers") || "[]");
    setChantiers(data);
  }, []);

  const saveChantiers = (newChantiers: Chantier[]) => {
    localStorage.setItem("chantiers", JSON.stringify(newChantiers));
    setChantiers(newChantiers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.adresse || !formData.dateDebut) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (isEditing) {
      // Modification
      const updatedChantiers = chantiers.map((c) =>
        c.id === isEditing ? ({ ...formData, id: isEditing } as Chantier) : c
      );
      saveChantiers(updatedChantiers);
    } else {
      // Création
      const newChantier: Chantier = {
        ...formData,
        id: Date.now().toString(),
      } as Chantier;
      saveChantiers([...chantiers, newChantier]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      adresse: "",
      dateDebut: "",
      dateFin: "",
      statut: "Actif",
      description: "",
    });
    setIsEditing(null);
    setShowForm(false);
  };

  const handleEdit = (chantier: Chantier) => {
    setFormData(chantier);
    setIsEditing(chantier.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce chantier ?")) {
      const updatedChantiers = chantiers.filter((c) => c.id !== id);
      saveChantiers(updatedChantiers);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "Actif":
        return "status-actif";
      case "Terminé":
        return "status-termine";
      case "Suspendu":
        return "status-suspendu";
      default:
        return "status-actif";
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">🏗️ Gestion des chantiers</h1>
        <p className="subtitle">Créez et gérez vos chantiers</p>
      </div>

      <div className="actions-bar">
        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          <span className="button-icon">➕</span>
          {showForm ? "Annuler" : "Nouveau chantier"}
        </button>

        <button className="secondary-button" onClick={() => router.push("/")}>
          <span className="button-icon">📊</span>
          Créer un rapport
        </button>

        <button
          className="secondary-button"
          onClick={() => router.push("/rapports")}
        >
          <span className="button-icon">📋</span>
          Voir les rapports
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2 className="form-title">
            {isEditing ? "Modifier le chantier" : "Nouveau chantier"}
          </h2>

          <form onSubmit={handleSubmit} className="chantier-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">
                    <span className="label-icon">🏢</span>
                    Nom du chantier *
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.nom || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    placeholder="Ex: Résidence Les Jardins"
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">
                    <span className="label-icon">📍</span>
                    Adresse *
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.adresse || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, adresse: e.target.value })
                    }
                    placeholder="Adresse complète"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">
                    <span className="label-icon">📅</span>
                    Date de début *
                  </span>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dateDebut || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dateDebut: e.target.value })
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">
                    <span className="label-icon">🏁</span>
                    Date de fin prévue
                  </span>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dateFin || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dateFin: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">
                    <span className="label-icon">📊</span>
                    Statut
                  </span>
                  <select
                    className="form-select"
                    value={formData.statut || "Actif"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statut: e.target.value as Chantier["statut"],
                      })
                    }
                  >
                    <option value="Actif">🟢 Actif</option>
                    <option value="Terminé">🔵 Terminé</option>
                    <option value="Suspendu">🔴 Suspendu</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">
                  <span className="label-icon">📝</span>
                  Description
                </span>
                <textarea
                  className="form-textarea"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description du projet, détails techniques..."
                  rows={3}
                />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                <span className="button-icon">💾</span>
                {isEditing ? "Modifier" : "Créer"} le chantier
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="chantiers-section">
        <h2 className="section-title">
          Chantiers existants ({chantiers.length})
        </h2>

        {chantiers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏗️</div>
            <p className="empty-text">Aucun chantier créé</p>
            <p className="empty-subtitle">
              Créez votre premier chantier pour commencer
            </p>
          </div>
        ) : (
          <div className="chantiers-grid">
            {chantiers.map((chantier) => (
              <div key={chantier.id} className="chantier-card">
                <div className="chantier-header">
                  <h3 className="chantier-nom">{chantier.nom}</h3>
                  <div
                    className={`status-badge ${getStatusColor(
                      chantier.statut
                    )}`}
                  >
                    {chantier.statut}
                  </div>
                </div>

                <div className="chantier-content">
                  <div className="chantier-info">
                    <span className="info-label">📍 Adresse</span>
                    <span className="info-value">{chantier.adresse}</span>
                  </div>

                  <div className="chantier-dates">
                    <div className="date-info">
                      <span className="info-label">📅 Début</span>
                      <span className="info-value">
                        {new Date(chantier.dateDebut).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    {chantier.dateFin && (
                      <div className="date-info">
                        <span className="info-label">🏁 Fin prévue</span>
                        <span className="info-value">
                          {new Date(chantier.dateFin).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {chantier.description && (
                    <div className="description-section">
                      <span className="info-label">📝 Description</span>
                      <p className="description-text">{chantier.description}</p>
                    </div>
                  )}
                </div>

                <div className="chantier-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(chantier)}
                  >
                    <span className="button-icon">✏️</span>
                    Modifier
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(chantier.id)}
                  >
                    <span className="button-icon">🗑️</span>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
        }

        .title {
          color: #2d3748;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
          color: #718096;
          font-size: 1.125rem;
          margin: 0;
          font-weight: 500;
        }

        .actions-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .primary-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .secondary-button {
          background: white;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .secondary-button:hover {
          background: #f8fafc;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .form-container {
          background: white;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .form-title {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .chantier-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .label-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #2d3748;
          font-size: 0.95rem;
        }

        .label-icon {
          font-size: 1.1rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s ease;
          background: #fafbfc;
          color: #000000;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
          line-height: 1.5;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .submit-button {
          flex: 1;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(72, 187, 120, 0.6);
        }

        .cancel-button {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          padding: 16px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: #edf2f7;
        }

        .button-icon {
          font-size: 1.1rem;
        }

        .chantiers-section {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .section-title {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .empty-text {
          font-size: 1.25rem;
          color: #4a5568;
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        .empty-subtitle {
          color: #718096;
          margin: 0;
        }

        .chantiers-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .chantier-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .chantier-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          border-color: #cbd5e0;
        }

        .chantier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }

        .chantier-nom {
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-actif {
          background: #c6f6d5;
          color: #276749;
        }

        .status-termine {
          background: #bee3f8;
          color: #2c5282;
        }

        .status-suspendu {
          background: #fed7d7;
          color: #c53030;
        }

        .chantier-content {
          margin-bottom: 20px;
        }

        .chantier-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
        }

        .chantier-dates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .date-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
        }

        .info-value {
          color: #2d3748;
          font-weight: 500;
        }

        .description-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .description-text {
          margin: 8px 0 0 0;
          color: #4a5568;
          line-height: 1.5;
          font-style: italic;
        }

        .chantier-actions {
          display: flex;
          gap: 8px;
        }

        .edit-button {
          flex: 1;
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .edit-button:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .delete-button {
          flex: 1;
          background: #e53e3e;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .delete-button:hover {
          background: #c53030;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .chantiers-grid {
            grid-template-columns: 1fr;
          }

          .actions-bar {
            flex-direction: column;
          }

          .chantier-dates {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
