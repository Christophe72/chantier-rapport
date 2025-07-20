"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RapportFormData = {
  chantier: string;
  etat: string;
  remarques?: string;
};

type Chantier = {
  id: string;
  nom: string;
  adresse: string;
  statut: "Actif" | "Terminé" | "Suspendu";
};

/**
 * Composant de la page d'accueil pour créer un rapport journalier de chantier.
 *
 * Ce c        }
      `}</style>
    </main>
  );
}ant affiche un formulaire permettant à l'utilisateur de saisir le nom du chantier,
 * l'état d'avancement et des remarques. Lors de la soumission, les données du rapport sont enregistrées
 * dans le localStorage avec un horodatage et l'utilisateur est redirigé vers la page des rapports.
 *
 * @returns {JSX.Element} La mise en page principale avec le formulaire de rapport.
 */
export default function Home() {
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<RapportFormData>();
  const router = useRouter();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [isCustomChantier, setIsCustomChantier] = useState(false);

  const watchedChantier = watch("chantier");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("chantiers") || "[]");
    const chantiersActifs = data.filter((c: Chantier) => c.statut === "Actif");
    setChantiers(chantiersActifs);
  }, []);

  const onSubmit = (data: RapportFormData) => {
    if (!data.chantier || !data.etat) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const rapports = JSON.parse(localStorage.getItem("rapports") || "[]");
    rapports.push({ ...data, date: new Date().toISOString() });
    localStorage.setItem("rapports", JSON.stringify(rapports));
    reset();
    router.push("/rapports");
  };

  const handleChantierSelect = (value: string) => {
    if (value === "custom") {
      setIsCustomChantier(true);
      setValue("chantier", "");
    } else {
      setIsCustomChantier(false);
      setValue("chantier", value);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">🏗️ Rapport journalier du chantier</h1>
        <p className="subtitle">
          Créez un nouveau rapport de suivi de chantier
        </p>
      </div>

      <div className="navigation-bar">
        <button
          className="nav-button"
          onClick={() => router.push("/chantiers")}
        >
          <span className="button-icon">🏗️</span>
          Gérer les chantiers
        </button>

        <button className="nav-button" onClick={() => router.push("/rapports")}>
          <span className="button-icon">📋</span>
          Voir l&apos;historique
        </button>

        <button
          className="nav-button"
          onClick={() => router.push("/calculs-electriques")}
        >
          <span className="button-icon">⚡</span>
          Calculs électriques
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="rapport-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                <span className="label-icon">🏢</span>
                Nom du chantier
              </span>
              {chantiers.length > 0 ? (
                <div className="chantier-selection">
                  <select
                    className="form-select"
                    onChange={(e) => handleChantierSelect(e.target.value)}
                    value={isCustomChantier ? "custom" : watchedChantier || ""}
                  >
                    <option value="">Sélectionner un chantier</option>
                    {chantiers.map((chantier) => (
                      <option key={chantier.id} value={chantier.nom}>
                        {chantier.nom} - {chantier.adresse}
                      </option>
                    ))}
                    <option value="custom">🖊️ Saisir un autre chantier</option>
                  </select>

                  {isCustomChantier && (
                    <input
                      {...register("chantier", { required: true })}
                      className="form-input custom-input"
                      placeholder="Nom du chantier personnalisé"
                    />
                  )}
                </div>
              ) : (
                <div className="no-chantiers">
                  <input
                    {...register("chantier", { required: true })}
                    className="form-input"
                    placeholder="Ex: Construction Résidence Les Jardins"
                  />
                  <p className="info-text">
                    💡{" "}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => router.push("/chantiers")}
                    >
                      Créez vos chantiers
                    </button>{" "}
                    pour les sélectionner rapidement
                  </p>
                </div>
              )}
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                <span className="label-icon">📊</span>
                État d&apos;avancement
              </span>
              <select
                {...register("etat", { required: true })}
                className="form-select"
              >
                <option value="">Sélectionner un état</option>
                <option value="Planifié">🔵 Planifié</option>
                <option value="En cours">🟠 En cours</option>
                <option value="Terminé">🟢 Terminé</option>
                <option value="Suspendu">🔴 Suspendu</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-text">
                <span className="label-icon">💬</span>
                Remarques
                <span className="optional-badge">Optionnel</span>
              </span>
              <textarea
                {...register("remarques")}
                className="form-textarea"
                placeholder="Ajoutez des détails, observations ou points d'attention..."
                rows={4}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              <span className="button-icon">💾</span>
              Enregistrer le rapport
            </button>
          </div>
        </form>
      </div>

      <style jsx>
        {`
          .container {
            max-width: 700px;
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

          .form-container {
            background: white;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(226, 232, 240, 0.8);
          }

          .rapport-form {
            display: flex;
            flex-direction: column;
            gap: 24px;
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

          .optional-badge {
            background: #e2e8f0;
            color: #64748b;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-left: auto;
          }

          .chantier-selection {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .custom-input {
            margin-top: 8px;
          }

          .no-chantiers {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .info-text {
            font-size: 0.875rem;
            color: #718096;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .link-button {
            background: none;
            border: none;
            color: #667eea;
            text-decoration: underline;
            cursor: pointer;
            font-size: inherit;
            padding: 0;
          }

          .link-button:hover {
            color: #5a67d8;
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

          .form-input::placeholder,
          .form-textarea::placeholder {
            color: #9ca3af;
            font-style: italic;
          }

          .form-select {
            cursor: pointer;
          }

          .form-textarea {
            resize: vertical;
            min-height: 100px;
            line-height: 1.5;
          }

          .form-actions {
            margin-top: 8px;
          }

          .submit-button {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }

          .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }

          .submit-button:active {
            transform: translateY(0);
          }

          .button-icon {
            font-size: 1.1rem;
          }

          @media (max-width: 768px) {
            .container {
              padding: 16px;
            }

            .title {
              font-size: 2rem;
            }

            .form-container {
              padding: 24px;
              border-radius: 16px;
            }

            .submit-button {
              padding: 14px 20px;
              font-size: 1rem;
            }

            .navigation-bar {
              flex-direction: column;
            }
          }

          @media (max-width: 480px) {
            .title {
              font-size: 1.75rem;
            }

            .subtitle {
              font-size: 1rem;
            }

            .form-container {
              padding: 20px;
            }
          }
        `}
      </style>
    </main>
  );
}
