"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Rapport = {
  date: string;
  chantier: string;
  etat: string;
  remarques: string;
};

/**
 * Composant React qui affiche l'historique des rapports de chantier.
 *
 * Récupère la liste des rapports depuis le localStorage lors du montage et les affiche dans une liste stylisée.
 * Si aucun rapport n'est trouvé, affiche un message indiquant qu'aucun rapport n'est enregistré.
 *
 * @returns {JSX.Element} Le contenu principal affichant la liste des rapports de chantier.
 */
export default function Rapports() {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Rapport>({
    date: "",
    chantier: "",
    etat: "",
    remarques: "",
  });
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("rapports") || "[]");
    setRapports(data);
  }, []);

  const handleDelete = (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
      const updatedRapports = rapports.filter((_, i) => i !== index);
      localStorage.setItem("rapports", JSON.stringify(updatedRapports));
      setRapports(updatedRapports);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...rapports[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedRapports = [...rapports];
      updatedRapports[editingIndex] = editForm;
      localStorage.setItem("rapports", JSON.stringify(updatedRapports));
      setRapports(updatedRapports);
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({
      date: "",
      chantier: "",
      etat: "",
      remarques: "",
    });
  };

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">📊 Historique des rapports de chantier</h1>
        <p className="subtitle">Consultez et gérez vos rapports</p>
      </div>

      <div className="navigation-bar">
        <button className="nav-button" onClick={() => router.push("/")}>
          <span className="button-icon">📝</span>
          Nouveau rapport
        </button>

        <button
          className="nav-button"
          onClick={() => router.push("/chantiers")}
        >
          <span className="button-icon">🏗️</span>
          Gérer les chantiers
        </button>

        <button
          className="nav-button"
          onClick={() => router.push("/calculs-electriques")}
        >
          <span className="button-icon">⚡</span>
          Calculs électriques
        </button>
      </div>

      {rapports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-text">Aucun rapport enregistré.</p>
          <p className="empty-subtitle">
            Les rapports apparaîtront ici une fois créés.
          </p>
        </div>
      ) : (
        <div className="rapports-grid">
          {rapports.map((r, i) => (
            <div key={i} className="rapport-card">
              {editingIndex === i ? (
                // Mode édition
                <div className="edit-form">
                  <div className="edit-header">
                    <h3 className="edit-title">✏️ Modifier le rapport</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">📅 Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">🏗️ Chantier</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.chantier}
                      onChange={(e) =>
                        setEditForm({ ...editForm, chantier: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      📊 État d&apos;avancement
                    </label>
                    <select
                      className="form-select"
                      value={editForm.etat}
                      onChange={(e) =>
                        setEditForm({ ...editForm, etat: e.target.value })
                      }
                    >
                      <option value="">Sélectionner un état</option>
                      <option value="Planifié">Planifié</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                      <option value="Suspendu">Suspendu</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      💬 Remarques (optionnel)
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editForm.remarques}
                      onChange={(e) =>
                        setEditForm({ ...editForm, remarques: e.target.value })
                      }
                      placeholder="Ajoutez des remarques ou observations..."
                    />
                  </div>

                  <div className="edit-actions">
                    <button className="save-button" onClick={handleSaveEdit}>
                      <span className="button-icon">💾</span>
                      Enregistrer
                    </button>
                    <button
                      className="cancel-button"
                      onClick={handleCancelEdit}
                    >
                      <span className="button-icon">❌</span>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage normal
                <>
                  <div className="rapport-header">
                    <div className="date-badge">
                      📅{" "}
                      {new Date(r.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div
                      className={`status-badge status-${r.etat.toLowerCase()}`}
                    >
                      {r.etat}
                    </div>
                  </div>

                  <div className="rapport-content">
                    <div className="chantier-info">
                      <span className="label">🏗️ Chantier</span>
                      <span className="value">{r.chantier}</span>
                    </div>

                    {r.remarques && (
                      <div className="remarques-section">
                        <span className="label">💬 Remarques</span>
                        <p className="remarques-text">{r.remarques}</p>
                      </div>
                    )}
                  </div>

                  <div className="rapport-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(i)}
                    >
                      <span className="button-icon">✏️</span>
                      Modifier
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(i)}
                    >
                      <span className="button-icon">🗑️</span>
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
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

        .navigation-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-button {
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

        .nav-button:hover {
          background: #f8fafc;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .button-icon {
          font-size: 1.1rem;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

        .rapports-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        .rapport-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .rapport-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .rapport-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f7fafc;
        }

        .date-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-en-cours {
          background: #fed7aa;
          color: #c2410c;
        }

        .status-terminé {
          background: #bbf7d0;
          color: #059669;
        }

        .status-suspendu {
          background: #fecaca;
          color: #dc2626;
        }

        .status-planifié {
          background: #ddd6fe;
          color: #7c3aed;
        }

        .rapport-content {
          space-y: 16px;
        }

        .chantier-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2d3748;
          padding: 8px 0;
        }

        .remarques-section {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid #3b82f6;
        }

        .remarques-text {
          margin: 8px 0 0 0;
          color: #4a5568;
          line-height: 1.6;
          font-style: italic;
        }

        .rapport-actions {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .delete-button {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .delete-button:hover {
          background: #c53030;
          transform: translateY(-1px);
        }

        .edit-button {
          background: #3182ce;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .edit-button:hover {
          background: #2c5aa0;
          transform: translateY(-1px);
        }

        .edit-form {
          padding: 4px;
        }

        .edit-header {
          margin-bottom: 24px;
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }

        .edit-title {
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
          font-size: 0.875rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
          color: #000000;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .save-button {
          background: #38a169;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .save-button:hover {
          background: #2f855a;
          transform: translateY(-1px);
        }

        .cancel-button {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .cancel-button:hover {
          background: #c53030;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .title {
            font-size: 2rem;
          }

          .rapports-grid {
            grid-template-columns: 1fr;
          }

          .rapport-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .date-badge {
            justify-content: center;
          }

          .navigation-bar {
            flex-direction: column;
          }

          .rapport-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .edit-actions {
            flex-direction: column;
            gap: 12px;
          }

          .save-button,
          .cancel-button {
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
