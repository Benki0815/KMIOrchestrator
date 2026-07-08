# Konzept – KMI Orchestrator (Kicker Managerspiel Interactive)

> **Status:** Konzeptphase abgeschlossen (Interview 2026-07-07)  
> **Scope:** Kein Code – Datenmodell, Architektur, LLM-Strategie, UI-Roadmap

---

## 1. Zielbild

Webfrontend, das beim **Kicker Managerspiel Interactive** den optimalen Kader findet – mit Fokus auf den **Pre-Season-Draft**, weil Nachbesserungen während der Saison stark limitiert sind:

- Kader wird **vor Saisonbeginn** einmal komplett zusammengestellt
- Danach: **max. 4 Transfers** (1 nach Deadline Day, Rest Winterpause) – positionsgleich
- Pro Spieltag nur **Startelf aus dem 22er-Kader** (Bank ↔ Startelf)

Das Tool liefert daher ein **volles Saison-Dashboard**, aber der Kernwert liegt in der **Draft-Optimierung über 34 Spieltage**.

---

## 2. Entscheidungen aus dem Interview

| Thema | Entscheidung |
|-------|--------------|
| **Ligen** | Nur **Bundesliga (L1)** – 18 Vereine, 34 Spieltage |
| **Prognose-Granularität** | **Spieltags-Vektor** (34 Werte pro Spieler) |
| **Zusatzsignale** | SofaScore/externe APIs, LLM-Recherche, PDF-Saison-Learnings |
| **Risiko** | **Profilbaukasten** (3–5 eigene Profile, auswählbar) |
| **Überperformer-Priorität** | Marktwert-Ineffizienz, Comeback nach Verletzung, Neuzugänge, LLM-News, wenig Positions-Konkurrenz |
| **LLM-Architektur** | **Hybrid:** Statistik-Basis + LLM-Adjustments + **PuLP + OR-Tools** |
| **UI-Umfang** | **Volles Dashboard** (Draft, Startelf, Tracking, Transfer-Erinnerungen) |
| **Draft-UI** | Split-View wie Kicker (Spielfeld + DB), Profil-Vorschläge, Speichern/Laden → siehe [`konzept-draft-orchestrator-ui.md`](./konzept-draft-orchestrator-ui.md) |

---

## 3. Leitlinien aus dem Saison-Review (PDF)

Diese Regeln sind **Leitplanken, keine starren Constraints** – Gewichtungen im Scoring/Optimierer sind konfigurierbar.

### 3.1 Punkte-Verteilung (Saison 2025/26)

| Erkenntnis | Konsequenz für Scoring |
|------------|------------------------|
| **88 % der Punkte** kommen aus Aufstellung (Starter + Einwechsel) | Draft-Fokus: Einsatzwahrscheinlichkeit > reine Statistik |
| **Torhüter** erzielen im Schnitt **positive Notenpunkte** | TW-Position: Floor-Bonus im Risiko-Profil |
| **Feldspieler** Ø **3,7 Punkte/Spiel**, positionsunabhängig | Basis-Erwartung für Mittelfeld/Abwehr kalibrieren |
| **Abwehr** = viel Floor, wenig Ceiling | Konservative Profile bevorzugen ABW-Stammspieler |
| **Stürmer** = Top oder Flop (Noten negativ, Tore/SDS kompensieren) | Aggressive Profile / Überperformer-Suche fokussiert STU |
| **Einwechselspieler** brauchen Note ≥ 3 + Aktionen für Ø 4 | Backup-Qualität im 22er-Kader bewerten |
| **Dream Team** Referenz: **3-4-3** | Default-Formation, aber flexibel konfigurierbar |

### 3.2 Scoring-Kategorien (Kicker IA)

```
Punkte = Aufstellung + Noten + Tore + Assists + Weiße Weste + SDS − Karten
```

Für die Prognose relevant:

- **Einsatz** (Startelf / Einwechsel) – größter Hebel
- **Noten** – im Schnitt leicht negativer Druck (Ø 3,55)
- **Tore / Assists / SDS** – Upside-Faktoren, positionsabhängig gewichtet

### 3.3 Budget-Effizienz

PDF zeigt: **Pkt/Mio** trennt gute von teuren Picks (Dream Team ≤ 4 Mio: 47 Pkt/Mio vs. 32 Pkt/Mio beim teuren Team).  
→ Effizienz-Metrik `points_per_million` als Standard-KPI im Draft und Dashboard.

---

## 4. Datenquellen & Import

### 4.1 Vorhandene Referenzdaten (`/data`)

| Datei | Rolle im System |
|-------|-----------------|
| `kickermanagerspiel2025spielertabellen-*.xlsx` | **Statistik-Basis:** historische SP01–SP34, Kosten, Position, STAB-Index, xPunkte, GEILHEIT, Vereins-Index |
| `20250725geschatzemartkwerte-*.xlsx` | **Marktwert-Referenz:** Kicker-MW vs. NEU vs. Transfermarkt pro Verein |
| `buli2526reviewfinal-*.pdf` | **Regel-Learnings:** Positions-Logik, Punkte-Verteilung, Dream-Team-Referenz |

### 4.2 Live-Inputs (zum Draft-Zeitpunkt)

| Quelle | Pflicht? | Inhalt |
|--------|----------|--------|
| **Kicker-CSV-Export** (Transfermarkt) | Ja | Aktuelle Spielerliste, Kicker-Marktwerte, Positionen, Verfügbarkeit |
| **SofaScore / API-Football** | Ja (Zusatzsignale) | Verletzungen, Form, Spielplan, Aufstellungswahrscheinlichkeit |
| **LLM-Recherche** | Ja (Zusatzsignale) | News, Kaderlage, Neuzugänge, Trainer-Aussagen, Aufsteiger-Kontext |

### 4.3 Import-Pipeline (konzeptionell)

```
[Kicker CSV] ──► Normalisierung ──► Player-Stammdaten
[XLSX Historie] ──► Feature-Engineering ──► Baseline-Vektor SP01–SP34
[SofaScore API] ──► Echtzeit-Signale ──► Adjustment-Layer
[LLM-Recherche] ──► strukturiertes JSON ──► Überperformer-Score + Confidence
                          │
                          ▼
              [Merged Player Forecast] ──► Solver ──► Draft-Empfehlung
```

**Hinweis:** Kicker-Export kommt als CSV/XLSX – Import-Adapter muss beide Formate und Encoding (UTF-8/Latin-1) tolerant handhaben.

---

## 5. Datenmodell

### 5.1 Kern-Entitäten

```
Player
├── id (Kicker-intern oder Hash aus Name+Verein)
├── name, club, league (L1)
├── position_kicker: TOR | ABW | MIT | STU
├── position_exact: TW | IV | LV | RV | DM | ZM | OM | LF | RF | ST ...
├── flexibility: int (1 = nur eine Position)
├── market_value: float (Mio €, Kicker-Export)
├── age: int
└── metadata: birthdate, nationality, height, ...

PlayerForecast
├── player_id
├── matchday_points[34]: float[]     # Erwartete Punkte SP01–SP34
├── confidence: float (0–1)          # LLM + Datenqualität
├── floor_estimate: float            # STAB-Index / Perzentil Q25
├── ceiling_estimate: float          # Perzentil Q75 / SDS-Upside
├── playing_probability[34]: float[]  # Startelf-Wahrscheinlichkeit
├── ueberperformer_score: float (0–100)
├── ueberperformer_reasons: string[]
└── source_breakdown: { stats, llm, external }

RiskProfile (User-definiert, 3–5 Stück)
├── name: "Sicherheits-FC" | "Überperformer-Jäger" | ...
├── floor_weight: float (0–1)
├── ceiling_weight: float (0–1)
├── volatility_penalty: float
├── ueberperformer_bonus: float
├── position_weights: { TOR, ABW, MIT, STU }
└── formation: "3-4-3" | "4-4-2" | ...

Squad (22 Spieler)
├── players[22]
├── total_cost: float
├── formation
├── expected_points[34]: float[]    # Summe der gewählten Startelf-Prognose
├── risk_metrics: { stab_index, pkt_per_mio, floor_coverage }
└── draft_metadata: { profile_used, solver_engine, timestamp }

MatchdayLineup (Ebene 2)
├── squad_id
├── matchday: int (1–34)
├── starters[11]
├── bench[11] (ordered)
├── expected_points: float
└── adjustments: { injuries, suspensions, form }
```

### 5.2 Überperformer-Scoring

Priorisierte Signale (aus Interview):

| Signal | Datenquelle | Gewichtung (Richtwert) |
|--------|-------------|------------------------|
| Marktwert-Ineffizienz | Kicker-MW vs. xPunkte/Mio vs. eigene Schätzung | Hoch |
| Comeback nach Verletzung | SofaScore + LLM | Hoch |
| Neuzugang / Wechsel | LLM + Kicker-MW-Unsicherheit | Hoch |
| Wenig Positions-Konkurrenz | Kaderanalyse (SofaScore/LLM) | Mittel |
| LLM-News (positiv) | LLM-Recherche | Mittel |

```python
ueberperformer_score = weighted_sum(signals) * confidence
```

Kein harter Filter – Bonus im Solver-Zielfunktion, damit Profile unterschiedlich darauf reagieren können.

---

## 6. Architektur

### 6.1 Zwei-Ebenen-System

```
┌─────────────────────────────────────────────────────────────┐
│  EBENE 1 – Pre-Season Draft (Kern)                          │
│  Input: 500+ L1-Spieler, Budget, Positions-Constraints      │
│  Output: Optimaler 22er-Kader + Begründung                  │
│  Engine: PuLP / OR-Tools (ILP/Knapsack)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  EBENE 2 – Wöchentliche Startelf (Zusatzmodul)              │
│  Input: Fester 22er-Kader + Kurzfrist-Signale               │
│  Output: Beste 11 + Bank-Reihenfolge pro Spieltag            │
│  Engine: Leichter Solver (kein Transfermarkt)                │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Hybrid LLM + Solver (bestätigt)

```
Schritt 1: STATISTIK-BASIS
  └─ XLSX-Historie → Baseline matchday_points[34] pro Spieler
  └─ STAB-Index, GEILHEIT, xPunkte als Features

Schritt 2: EXTERNE ANREICHERUNG
  └─ SofaScore: Verletzungen, Form, Gegner-Stärke, Einsatzwahrscheinlichkeit
  └─ Adjustments auf matchday_vector (pro Spieltag oder phasenweise)

Schritt 3: LLM-LAYER
  └─ Input: strukturiertes JSON (Spieler-Features + News-Kontext)
  └─ Output: adjustment_vector[34], confidence, ueberperformer_score, reasons[]
  └─ Kein LLM als alleinige Punkte-Quelle – nur Anreicherung + Erklärung

Schritt 4: SOLVER
  └─ PuLP: Standard-Draft (Budget, Position, 22 Spieler, Formation)
  └─ OR-Tools: Erweiterte Constraints (Risiko-Profil, Überperformer-Bonus,
               Floor/Ceiling-Tradeoff, Flexibilitäts-Regeln)
  └─ Zielfunktion: Σ expected_points − risk_penalty + ueberperformer_bonus
```

### 6.3 PuLP vs. OR-Tools – Aufgabenteilung

| Engine | Einsatz |
|--------|---------|
| **PuLP** | Schnelle Standard-Optimierung, Prototyping, einfache Constraints |
| **OR-Tools** | Komplexe Constraints (Risiko-Profil-Baukasten, correlated picks, SOS1-ähnliche Regeln) |

Beide implementieren dieselbe `SolverInterface` – User/Profil kann Engine wählen oder Auto-Modus.

### 6.4 Risiko-Profilbaukasten

User erstellt **3–5 Profile** mit Reglern:

- **Floor-Gewicht** (0–100): Wie stark STAB-Index / Q25 belohnt wird
- **Ceiling-Gewicht** (0–100): Wie stark SDS-/Tor-Upside belohnt wird
- **Volatilitäts-Strafe** (0–100): STABW-Penalty
- **Überperformer-Bonus** (0–100): Gewichtung des Überperformer-Scores
- **Positions-Schieber**: TOR / ABW / MIT / STU individuell
- **Formations-Vorgabe**: 3-4-3 default

Beispiel-Presets (User kann überschreiben):

| Profil | Floor | Ceiling | Überperformer | Typisch für |
|--------|-------|---------|---------------|-------------|
| Sicherheits-FC | 80 | 20 | 30 | TW + ABW-Stamm, wenig Risiko |
| Ausgewogen | 50 | 50 | 50 | Mix aller Positionen |
| Überperformer-Jäger | 20 | 80 | 90 | Neuzugänge, MW-Ineffizienzen |
| Ceiling-Hunter | 10 | 90 | 60 | STU + offensive MIT, SDS-Fokus |

---

## 7. UI-Konzept (Volles Dashboard)

### 7.1 Module

| Modul | Priorität | Funktion |
|-------|-----------|----------|
| **Draft-Assistent** | P1 | CSV importieren, Profil wählen, Solver starten, Kader-Vorschläge vergleichen |
| **Spieler-Explorer** | P1 | Suche, Filter (Überperformer, Position, Pkt/Mio), Spieltags-Chart SP01–34 |
| **Profil-Editor** | P1 | 3–5 Risiko-Profile anlegen/speichern |
| **Kader-Übersicht** | P1 | 22er-Kader, Kosten, erwartete Saisonpunkte, Schwachstellen |
| **Startelf-Planer** | P2 | Wöchentliche Aufstellung aus dem Kader, Verletzungs-Override |
| **Punkte-Tracker** | P2 | Ist vs. Prognose pro Spieltag, Abweichungsanalyse |
| **Transfer-Erinnerungen** | P2 | Countdown: 1 Tausch nach SP4, 4 Tausche bis Winterpause (SP15) |
| **LLM-Erklärungen** | P2 | Natürlichsprachige Begründung je Pick („Warum Überperformer?") |

### 7.2 Draft-Workflow (User Journey)

1. Kicker-CSV hochladen (oder auto-sync)
2. Risiko-Profil aus Baukasten wählen
3. Solver-Engine: Auto / PuLP / OR-Tools
4. Ergebnis: Top-3 Kader-Vorschläge mit Punkte-Kurve, Kosten, Pkt/Mio
5. Manuelle Anpassung (Lock/Exclude Spieler) → Re-Optimierung
6. Kader bestätigen → Dashboard-Modus für Saison

---

## 8. Technische Eckpunkte (für spätere Implementierung)

| Aspekt | Vorschlag |
|--------|-----------|
| **Backend** | Python (FastAPI) – PuLP + OR-Tools nativ |
| **Frontend** | React/Next.js, Ultra-Dark Corporate Design (siehe `cicd-example.md` im Template) |
| **Datenbank** | SQLite/PostgreSQL für Profile, Kader, Prognose-Caches |
| **LLM** | Structured Output (JSON Schema) – kein Freitext-Scoring |
| **Deployment** | DockerHost274 (siehe `docs/cicd.md`) |
| **Versionierung** | `v.<MM><DD>.<NNN>` im Frontend |

---

## 9. Spielregeln & Integrationen (ergänzt 2026-07-08)

### Offizielle Kicker-Regeln

Siehe [`spielregeln-kicker-ia.md`](./spielregeln-kicker-ia.md):

- Budget BL: **42,5 Mio. €**
- Kader: **3 TOR · 7 ABW · 7 MIT · 5 STU** (= 22)
- Transfers: **1** nach Deadline Day + **bis 3** in Winterpause (positionsgleich)
- Assist-Punkte: **2** (seit 2024/25)

### SofaScore (BallistiXG-shared)

- Credentials: `.env` → `SOFASCORE_RAPIDAPI_KEY`
- Doku: [`integrations/sofascore-kmi.md`](./integrations/sofascore-kmi.md)
- API-Referenz: [`integrations/sofascore-sport-api.md`](./integrations/sofascore-sport-api.md)
- Quota-Schutz + DB-Cache für Bilder und Saison-KPIs

### OpenRouter (LLM)

- Credentials: `.env` → `OPENROUTER_API_KEY` (neuer Key vom User ausstehend)
- Doku: [`integrations/openrouter.md`](./integrations/openrouter.md)
- Modellwahl: **TBD**

---

## 10. Offene Punkte (nach Konzeptphase)

| # | Thema | Nächster Schritt |
|---|-------|------------------|
| 1 | **Kicker-CSV-Format live** | Beim nächsten Export Spaltenmapping gegen XLSX abgleichen |
| 2 | **OpenRouter-Key + Modell** | User liefert neuen Key; Modell für Draft/Explain festlegen |
| 3 | **Profilbaukasten-UI** | Wireframe vor GUI-Implementierung (Stopp-Regel beachten) |
| 4 | **Kicker↔SofaScore Mapping** | Such-Endpoint + manuelles Override-UI |

---

## 11. Zusammenfassung

Das Tool kombiniert **bewährte Optimierung** (PuLP/OR-Tools) mit **LLM-Intelligenz** für die Fälle, wo Statistik allein nicht reicht: Neuzugänge, Comebacks, Marktwert-Ineffizienzen. Die **34-Spieltags-Prognose** ermöglicht Spielplan- und Form-Analysen. Der **Profilbaukasten** gibt dir volle Kontrolle über Risiko vs. Überperformer-Jagd. Das **volle Dashboard** deckt Draft und Saison ab – aber der Architektur-Kern bleibt der Pre-Season-Draft.

**Nächster Schritt:** Wireframes + API-Schnittstellen-Design, dann Phase-1-Implementierung (Draft-Assistent + Import + Solver).
