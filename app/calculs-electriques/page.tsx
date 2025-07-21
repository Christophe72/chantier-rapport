"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CalculElectrique = {
  id: string;
  nom: string;
  type: "puissance" | "section" | "protection" | "eclairage";
  parametres:
    | {
        tension: number;
        courant: number;
        facteurPuissance: number;
        typologie: string;
      }
    | {
        puissance: number;
        tension: number;
        longueur: number;
        chuteMax: number;
        materiau: string;
      }
    | {
        courantNominal: number;
        typeCircuit: string;
        longueurMax: number;
      };
  resultats:
    | {
        puissanceApparente: number;
        puissanceActive: number;
        puissanceReactive: number;
      }
    | {
        courant: string;
        sectionCalculee: string;
        sectionRecommandee: number;
        chuteRelle: number;
      }
    | {
        disjoncteurRecommande: number;
        sectionMinimale: number;
        nombrePointsMax: number;
        conformeNFC15100: boolean;
      };
  dateCalcul: string;
};

// type Materiel = {
//   id: string;
//   categorie: "cable" | "disjoncteur" | "luminaire" | "prise" | "autre";
//   nom: string;
//   caracteristiques: unknown;
//   prix?: number;
// };

export default function CalculsElectriques() {
  const [activeTab, setActiveTab] = useState<
    "calculs" | "materiels" | "schemas"
  >("calculs");
  const [selectedCalcul, setSelectedCalcul] = useState<string>("puissance");
  const [calculs, setCalculs] = useState<CalculElectrique[]>([]);
  //   const [materiels, setMateriels] = useState<Materiel[]>([]);
  const router = useRouter();

  // Paramètres pour les calculs
  const [calculPuissance, setCalculPuissance] = useState({
    tension: 230,
    courant: 0,
    facteurPuissance: 0.8,
    typologie: "monophase",
  });

  const [calculSection, setCalculSection] = useState({
    puissance: 0,
    tension: 230,
    longueur: 0,
    chuteMax: 3,
    materiau: "cuivre",
  });

  const [calculProtection, setCalculProtection] = useState({
    courantNominal: 0,
    typeCircuit: "eclairage",
    longueurMax: 0,
  });

  useEffect(() => {
    const calculsSauvegardes = JSON.parse(
      localStorage.getItem("calculs-electriques") || "[]"
    );
    setCalculs(calculsSauvegardes);
  }, []);

  // Fonctions de calcul
  const calculerPuissance = () => {
    const { tension, courant, facteurPuissance, typologie } = calculPuissance;
    let puissance = 0;

    if (typologie === "monophase") {
      puissance = tension * courant * facteurPuissance;
    } else if (typologie === "triphase") {
      puissance = Math.sqrt(3) * tension * courant * facteurPuissance;
    }

    return {
      puissanceApparente:
        tension * courant * (typologie === "triphase" ? Math.sqrt(3) : 1),
      puissanceActive: puissance,
      puissanceReactive: Math.sqrt(
        Math.pow(tension * courant, 2) - Math.pow(puissance, 2)
      ),
    };
  };

  const calculerSection = () => {
    const { puissance, tension, longueur, chuteMax, materiau } = calculSection;
    const resistivite = materiau === "cuivre" ? 0.0225 : 0.037; // Ohm.mm²/m
    const courant = puissance / tension;

    // Calcul section par chute de tension
    const sectionChute =
      (2 * resistivite * courant * longueur * 100) / (tension * chuteMax);

    // Sections normalisées
    const sectionsNormalisees = [
      1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150,
    ];
    const sectionRecommandee =
      sectionsNormalisees.find((s) => s >= sectionChute) ||
      sectionsNormalisees[sectionsNormalisees.length - 1];

    return {
      courant: courant.toFixed(2),
      sectionCalculee: sectionChute.toFixed(2),
      sectionRecommandee,
      chuteRelle:
        (2 * resistivite * courant * longueur * 100) /
        (tension * sectionRecommandee),
    };
  };

  const calculerProtection = () => {
    const { courantNominal, typeCircuit } = calculProtection;

    // Règles de protection selon NF C 15-100
    const reglesProtection = {
      eclairage: { maxDisjoncteur: 16, sectionMin: 1.5, nbPointsMax: 8 },
      prise: { maxDisjoncteur: 20, sectionMin: 2.5, nbPointsMax: 12 },
      force: { maxDisjoncteur: 32, sectionMin: 6, nbPointsMax: 6 },
    };

    const regle =
      reglesProtection[typeCircuit as keyof typeof reglesProtection] ||
      reglesProtection.eclairage;
    const disjoncteurRecommande = Math.min(
      Math.ceil(courantNominal * 1.25),
      regle.maxDisjoncteur
    );

    return {
      disjoncteurRecommande,
      sectionMinimale: regle.sectionMin,
      nombrePointsMax: regle.nbPointsMax,
      conformeNFC15100: courantNominal <= regle.maxDisjoncteur,
    };
  };

  const sauvegarderCalcul = (
    type: CalculElectrique["type"],
    resultats:
      | {
          puissanceApparente: number;
          puissanceActive: number;
          puissanceReactive: number;
        }
      | {
          courant: string;
          sectionCalculee: string;
          sectionRecommandee: number;
          chuteRelle: number;
        }
      | {
          disjoncteurRecommande: number;
          sectionMinimale: number;
          nombrePointsMax: number;
          conformeNFC15100: boolean;
        }
  ) => {
    const nouveauCalcul: CalculElectrique = {
      id: Date.now().toString(),
      nom: `Calcul ${type} - ${new Date().toLocaleDateString()}`,
      type: type,
      parametres:
        type === "puissance"
          ? calculPuissance
          : type === "section"
          ? calculSection
          : calculProtection,
      resultats,
      dateCalcul: new Date().toISOString(),
    };

    const calculsSauvegardes = [...calculs, nouveauCalcul];
    setCalculs(calculsSauvegardes);
    localStorage.setItem(
      "calculs-electriques",
      JSON.stringify(calculsSauvegardes)
    );
  };

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">⚡ Calculs Électriques</h1>
        <p className="subtitle">
          Outils de calculs et sélection de matériel électrique
        </p>
      </div>

      <div className="navigation-bar">
        <button className="nav-button" onClick={() => router.push("/")}>
          <span className="button-icon">🏠</span>
          Accueil
        </button>
        <button className="nav-button" onClick={() => router.push("/rapports")}>
          <span className="button-icon">📋</span>
          Rapports
        </button>
        <button
          className="nav-button"
          onClick={() => router.push("/chantiers")}
        >
          <span className="button-icon">🏗️</span>
          Chantiers
        </button>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "calculs" ? "active" : ""}`}
            onClick={() => setActiveTab("calculs")}
          >
            🧮 Calculs
          </button>
          <button
            className={`tab ${activeTab === "materiels" ? "active" : ""}`}
            onClick={() => setActiveTab("materiels")}
          >
            🔌 Matériels
          </button>
          <button
            className={`tab ${activeTab === "schemas" ? "active" : ""}`}
            onClick={() => setActiveTab("schemas")}
          >
            📐 Historique
          </button>
        </div>
      </div>

      {activeTab === "calculs" && (
        <div className="calculs-section">
          <div className="calcul-selector">
            <h3>Type de calcul</h3>
            <div className="calcul-buttons">
              <button
                className={`calcul-btn ${
                  selectedCalcul === "puissance" ? "active" : ""
                }`}
                onClick={() => setSelectedCalcul("puissance")}
              >
                ⚡ Puissance
              </button>
              <button
                className={`calcul-btn ${
                  selectedCalcul === "section" ? "active" : ""
                }`}
                onClick={() => setSelectedCalcul("section")}
              >
                📏 Section
              </button>
              <button
                className={`calcul-btn ${
                  selectedCalcul === "protection" ? "active" : ""
                }`}
                onClick={() => setSelectedCalcul("protection")}
              >
                🛡️ Protection
              </button>
            </div>
          </div>

          {selectedCalcul === "puissance" && (
            <div className="calcul-card">
              <h3>🔋 Calcul de Puissance</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tension (V)</label>
                  <input
                    type="number"
                    value={calculPuissance.tension}
                    onChange={(e) =>
                      setCalculPuissance({
                        ...calculPuissance,
                        tension: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Courant (A)</label>
                  <input
                    type="number"
                    value={calculPuissance.courant}
                    onChange={(e) =>
                      setCalculPuissance({
                        ...calculPuissance,
                        courant: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Facteur de puissance</label>
                  <input
                    type="number"
                    step="0.1"
                    max="1"
                    min="0"
                    value={calculPuissance.facteurPuissance}
                    onChange={(e) =>
                      setCalculPuissance({
                        ...calculPuissance,
                        facteurPuissance: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={calculPuissance.typologie}
                    onChange={(e) =>
                      setCalculPuissance({
                        ...calculPuissance,
                        typologie: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="monophase">Monophasé</option>
                    <option value="triphase">Triphasé</option>
                  </select>
                </div>
              </div>

              {calculPuissance.courant > 0 && (
                <div className="resultats">
                  <h4>📊 Résultats</h4>
                  {(() => {
                    const resultats = calculerPuissance();
                    return (
                      <div className="resultats-grid">
                        <div className="resultat-item">
                          <span className="label">Puissance active</span>
                          <span className="value">
                            {resultats.puissanceActive.toFixed(2)} W
                          </span>
                        </div>
                        <div className="resultat-item">
                          <span className="label">Puissance apparente</span>
                          <span className="value">
                            {resultats.puissanceApparente.toFixed(2)} VA
                          </span>
                        </div>
                        <div className="resultat-item">
                          <span className="label">Puissance réactive</span>
                          <span className="value">
                            {resultats.puissanceReactive.toFixed(2)} VAR
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  <button
                    className="save-button"
                    onClick={() =>
                      sauvegarderCalcul("puissance", calculerPuissance())
                    }
                  >
                    💾 Sauvegarder
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedCalcul === "section" && (
            <div className="calcul-card">
              <h3>📏 Calcul de Section de Câble</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Puissance (W)</label>
                  <input
                    type="number"
                    value={calculSection.puissance}
                    onChange={(e) =>
                      setCalculSection({
                        ...calculSection,
                        puissance: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Tension (V)</label>
                  <input
                    type="number"
                    value={calculSection.tension}
                    onChange={(e) =>
                      setCalculSection({
                        ...calculSection,
                        tension: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Longueur (m)</label>
                  <input
                    type="number"
                    value={calculSection.longueur}
                    onChange={(e) =>
                      setCalculSection({
                        ...calculSection,
                        longueur: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Chute max (%)</label>
                  <input
                    type="number"
                    value={calculSection.chuteMax}
                    onChange={(e) =>
                      setCalculSection({
                        ...calculSection,
                        chuteMax: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Matériau</label>
                  <select
                    value={calculSection.materiau}
                    onChange={(e) =>
                      setCalculSection({
                        ...calculSection,
                        materiau: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="cuivre">Cuivre</option>
                    <option value="aluminium">Aluminium</option>
                  </select>
                </div>
              </div>

              {calculSection.puissance > 0 && calculSection.longueur > 0 && (
                <div className="resultats">
                  <h4>📊 Résultats</h4>
                  {(() => {
                    const resultats = calculerSection();
                    return (
                      <div className="resultats-grid">
                        <div className="resultat-item">
                          <span className="label">Courant</span>
                          <span className="value">{resultats.courant} A</span>
                        </div>
                        <div className="resultat-item">
                          <span className="label">Section calculée</span>
                          <span className="value">
                            {resultats.sectionCalculee} mm²
                          </span>
                        </div>
                        <div className="resultat-item highlighted">
                          <span className="label">Section recommandée</span>
                          <span className="value">
                            {resultats.sectionRecommandee} mm²
                          </span>
                        </div>
                        <div className="resultat-item">
                          <span className="label">Chute réelle</span>
                          <span className="value">
                            {resultats.chuteRelle.toFixed(2)} %
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  <button
                    className="save-button"
                    onClick={() =>
                      sauvegarderCalcul("section", calculerSection())
                    }
                  >
                    💾 Sauvegarder
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedCalcul === "protection" && (
            <div className="calcul-card">
              <h3>🛡️ Calcul de Protection</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Courant nominal (A)</label>
                  <input
                    type="number"
                    value={calculProtection.courantNominal}
                    onChange={(e) =>
                      setCalculProtection({
                        ...calculProtection,
                        courantNominal: +e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Type de circuit</label>
                  <select
                    value={calculProtection.typeCircuit}
                    onChange={(e) =>
                      setCalculProtection({
                        ...calculProtection,
                        typeCircuit: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="eclairage">Éclairage</option>
                    <option value="prise">Prise de courant</option>
                    <option value="force">Force motrice</option>
                  </select>
                </div>
              </div>

              {calculProtection.courantNominal > 0 && (
                <div className="resultats">
                  <h4>📊 Résultats</h4>
                  {(() => {
                    const resultats = calculerProtection();
                    return (
                      <div className="resultats-grid">
                        <div className="resultat-item highlighted">
                          <span className="label">Disjoncteur recommandé</span>
                          <span className="value">
                            {resultats.disjoncteurRecommande} A
                          </span>
                        </div>
                        <div className="resultat-item">
                          <span className="label">Section minimale</span>
                          <span className="value">
                            {resultats.sectionMinimale} mm²
                          </span>
                        </div>
                        <div className="resultat-item">
                          <span className="label">Points max par circuit</span>
                          <span className="value">
                            {resultats.nombrePointsMax}
                          </span>
                        </div>
                        <div
                          className={`resultat-item ${
                            resultats.conformeNFC15100
                              ? "conforme"
                              : "non-conforme"
                          }`}
                        >
                          <span className="label">Conformité NF C 15-100</span>
                          <span className="value">
                            {resultats.conformeNFC15100
                              ? "✅ Conforme"
                              : "❌ Non conforme"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  <button
                    className="save-button"
                    onClick={() =>
                      sauvegarderCalcul("protection", calculerProtection())
                    }
                  >
                    💾 Sauvegarder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "materiels" && (
        <div className="materiels-section">
          <div className="section-header">
            <h3>🔌 Base de données de matériels électriques</h3>
            <p>Sélection et caractéristiques des équipements électriques</p>
          </div>

          <div className="materiels-categories">
            <div className="materiel-category">
              <h4>📏 Câbles et conducteurs</h4>
              <div className="materiels-list">
                <div className="materiel-item">
                  <span className="materiel-name">Câble U1000 R2V 3G1.5</span>
                  <span className="materiel-specs">
                    Section: 1.5mm² | Tension: 1000V
                  </span>
                  <span className="materiel-price">~2.50€/m</span>
                </div>
                <div className="materiel-item">
                  <span className="materiel-name">Câble U1000 R2V 3G2.5</span>
                  <span className="materiel-specs">
                    Section: 2.5mm² | Tension: 1000V
                  </span>
                  <span className="materiel-price">~3.80€/m</span>
                </div>
                <div className="materiel-item">
                  <span className="materiel-name">Câble U1000 R2V 3G6</span>
                  <span className="materiel-specs">
                    Section: 6mm² | Tension: 1000V
                  </span>
                  <span className="materiel-price">~8.50€/m</span>
                </div>
              </div>
            </div>

            <div className="materiel-category">
              <h4>🛡️ Protection</h4>
              <div className="materiels-list">
                <div className="materiel-item">
                  <span className="materiel-name">
                    Disjoncteur 16A courbe C
                  </span>
                  <span className="materiel-specs">
                    Mono | Pouvoir coupure: 4.5kA
                  </span>
                  <span className="materiel-price">~25€</span>
                </div>
                <div className="materiel-item">
                  <span className="materiel-name">
                    Disjoncteur 20A courbe C
                  </span>
                  <span className="materiel-specs">
                    Mono | Pouvoir coupure: 4.5kA
                  </span>
                  <span className="materiel-price">~28€</span>
                </div>
                <div className="materiel-item">
                  <span className="materiel-name">
                    Disjoncteur 32A courbe C
                  </span>
                  <span className="materiel-specs">
                    Mono | Pouvoir coupure: 4.5kA
                  </span>
                  <span className="materiel-price">~35€</span>
                </div>
              </div>
            </div>

            <div className="materiel-category">
              <h4>💡 Éclairage</h4>
              <div className="materiels-list">
                <div className="materiel-item">
                  <span className="materiel-name">
                    Spot LED encastrable 12W
                  </span>
                  <span className="materiel-specs">3000K | 1200lm | IP20</span>
                  <span className="materiel-price">~15€</span>
                </div>
                <div className="materiel-item">
                  <span className="materiel-name">Réglette LED 36W</span>
                  <span className="materiel-specs">4000K | 3600lm | IP65</span>
                  <span className="materiel-price">~45€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "schemas" && (
        <div className="historique-section">
          <div className="section-header">
            <h3>📐 Historique des calculs</h3>
            <p>Vos calculs précédents sauvegardés</p>
          </div>

          {calculs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">Aucun calcul sauvegardé.</p>
              <p className="empty-subtitle">
                Vos calculs apparaîtront ici une fois sauvegardés.
              </p>
            </div>
          ) : (
            <div className="calculs-grid">
              {calculs.map((calc) => (
                <div key={calc.id} className="calcul-historique-card">
                  <div className="calcul-header">
                    <div className="calcul-type-badge">
                      {calc.type === "puissance" && "⚡"}
                      {calc.type === "section" && "📏"}
                      {calc.type === "protection" && "🛡️"}
                      {calc.type}
                    </div>
                    <div className="calcul-date">
                      {new Date(calc.dateCalcul).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <h4 className="calcul-nom">{calc.nom}</h4>

                  <div className="calcul-details">
                    <div className="parametres">
                      <h5>Paramètres</h5>
                      <pre className="param-display">
                        {JSON.stringify(calc.parametres, null, 2)}
                      </pre>
                    </div>

                    <div className="resultats-historique">
                      <h5>Résultats</h5>
                      <pre className="result-display">
                        {JSON.stringify(calc.resultats, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

        .tabs-container {
          margin-bottom: 32px;
        }

        .tabs {
          display: flex;
          background: white;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
        }

        .tab {
          background: transparent;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #718096;
        }

        .tab.active {
          background: #3182ce;
          color: white;
          box-shadow: 0 2px 8px rgba(49, 130, 206, 0.3);
        }

        .tab:hover:not(.active) {
          background: #f8fafc;
          color: #4a5568;
        }

        .calculs-section {
          space-y: 24px;
        }

        .calcul-selector {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }

        .calcul-selector h3 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .calcul-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .calcul-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #4a5568;
        }

        .calcul-btn.active {
          background: #3182ce;
          color: white;
          border-color: #3182ce;
        }

        .calcul-btn:hover:not(.active) {
          background: white;
          border-color: #cbd5e0;
        }

        .calcul-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .calcul-card h3 {
          margin: 0 0 24px 0;
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
          font-size: 0.875rem;
        }

        .form-input,
        .form-select {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
          color: #000000;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .resultats {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #3182ce;
        }

        .resultats h4 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 1.125rem;
          font-weight: 700;
        }

        .resultats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .resultat-item {
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .resultat-item.highlighted {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .resultat-item.conforme {
          background: #bbf7d0;
          border-left: 4px solid #059669;
        }

        .resultat-item.non-conforme {
          background: #fecaca;
          border-left: 4px solid #dc2626;
        }

        .resultat-item .label {
          font-size: 0.875rem;
          font-weight: 600;
          opacity: 0.8;
        }

        .resultat-item .value {
          font-size: 1.25rem;
          font-weight: 700;
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
          margin: 0 auto;
        }

        .save-button:hover {
          background: #2f855a;
          transform: translateY(-1px);
        }

        .materiels-section,
        .historique-section {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .section-header h3 {
          margin: 0 0 8px 0;
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .section-header p {
          margin: 0;
          color: #718096;
        }

        .materiels-categories {
          display: grid;
          gap: 24px;
        }

        .materiel-category {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          background: #f8fafc;
        }

        .materiel-category h4 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 1.125rem;
          font-weight: 700;
        }

        .materiels-list {
          display: grid;
          gap: 12px;
        }

        .materiel-item {
          background: white;
          padding: 16px;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 2fr 2fr 1fr;
          gap: 12px;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .materiel-name {
          font-weight: 600;
          color: #2d3748;
        }

        .materiel-specs {
          font-size: 0.875rem;
          color: #718096;
        }

        .materiel-price {
          font-weight: 700;
          color: #38a169;
          text-align: right;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f8fafc;
          border-radius: 16px;
          border: 2px dashed #e2e8f0;
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

        .calculs-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .calcul-historique-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .calcul-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .calcul-type-badge {
          background: #3182ce;
          color: white;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .calcul-date {
          color: #718096;
          font-size: 0.875rem;
        }

        .calcul-nom {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 1.125rem;
          font-weight: 700;
        }

        .calcul-details {
          display: grid;
          gap: 16px;
        }

        .parametres h5,
        .resultats-historique h5 {
          margin: 0 0 8px 0;
          color: #4a5568;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .param-display,
        .result-display {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          font-size: 0.75rem;
          color: #4a5568;
          overflow-x: auto;
          white-space: pre-wrap;
          margin: 0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .title {
            font-size: 2rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .resultats-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-direction: column;
          }

          .calcul-buttons {
            flex-direction: column;
          }

          .navigation-bar {
            flex-direction: column;
          }

          .materiel-item {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .materiel-price {
            text-align: left;
          }

          .calculs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
