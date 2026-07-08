# Konzept – Draft Orchestrator (grafische Kader-Erstellung)

> **Status:** Konzeptphase – kein Code  
> **Referenz-UI:** Kicker Interactive „Aufstellung“ (Split-View: Spielfeld + Spielerliste)  
> **Bezug:** [Konzept Gesamt](./konzept-kicker-managerspiel.md) · [Spielregeln](./spielregeln-kicker-ia.md)

---

## 1. Bezeichnung

| Begriff | Verwendung |
|---------|------------|
| **KMI Orchestrator** | Gesamtprodukt / App |
| **Draft Orchestrator** | Modul für Pre-Season-Kaderbau (dieses Dokument) |
| **Kader-Orchestrator** | Alternative UI-Bezeichnung (deutsch, verständlich) |
| **Vorschlags-Engine** | Backend: Solver + LLM, liefert Vorschläge |
| **Kader-Slot** | Einer von 22 Plätzen (3 TOR · 7 ABW · 7 MIT · 5 STU) |

**Empfehlung UI:** Tab/Modul heißt **„Kader-Orchestrator“**, Button **„Vorschläge generieren“** (nicht zu technisch).

---

## 2. Zielbild (User Story)

1. User importiert Kicker-Spielerliste (CSV/XLSX)
2. User wählt ein **Risiko-Profil** aus dem Baukasten (z. B. „Überperformer-Jäger“)
3. User klickt **„Vorschläge generieren“** → Engine schlägt 22 Spieler vor
4. User sieht den Kader **grafisch** wie beim Kicker (Spielfeld + Datenbank)
5. User **übernimmt, tauscht, lockt, schließt aus** einzelne Spieler
6. Live-Validierung: Budget, Positionen, 22/22 vollständig
7. User **speichert/lädt** Kader-Entwürfe – **mehrere Varianten als Tabs**, pro Tab eigenes Profil + **5-Sterne-Favorit**

**Wireframe:** [`wireframe-draft-orchestrator.md`](./wireframe-draft-orchestrator.md)

---

## 3. Layout (Split-View)

Orientierung am Kicker-Screenshot – erweitert um Orchestrator-Funktionen.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Kader-Orchestrator]  [Startelf]  [Transfer]  [Tracking]  [Profile]        │
├──────────────────────────────────────────┬──────────────────────────────────┤
│  SPIELFELD (links ~55 %)                 │  SPIELER-DATENBANK (rechts ~45 %)│
│                                          │                                  │
│  Profil: [Überperformer-Jäger ▼]         │  Suche: [____________] 🔍        │
│  [Vorschläge generieren]  [Neu mischen]    │  Filter: Pos ▼ Verein ▼         │
│                                          │  Sortierung: [xPunkte ▼] ↕       │
│  Formation: [4-3-3 ▼]                    │  ┌────────────────────────────┐  │
│                                          │  │ ⭐ Kane      FCB  8,5M  222│  │
│         [ST]  [ST]  [ST]                 │  │   xPunkte: 198  P/M: 26    │  │
│              [MIT][MIT][MIT]             │  │   Überperf: 12  STAB: 4.2  │  │
│    [ABW][ABW][ABW][ABW]                  │  ├────────────────────────────┤  │
│              [TW]                        │  │   Olise     FCB  8,0M  163 │  │
│                                          │  │   ...                      │  │
│  ── Bank (11 aus 22) ──                  │  └────────────────────────────┘  │
│  STURM · MIT · ABWEHR · TOR              │  [+ In Kader]  [Ausschließen]    │
│  [Karten mit Foto, Name, Kennzahl]       │                                  │
├──────────────────────────────────────────┴──────────────────────────────────┤
│  Budget: 38,2 / 42,5 Mio. €  │  22/22  │  TOR 3/3  ABW 7/7  MIT 7/7  STU 5/5 │
│  Erwartete Saisonpunkte: 1.412  │  Pkt/Mio: 37  │  [Speichern] [Laden] [Export]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Spielfeld (links)

| Element | Verhalten |
|---------|-----------|
| **Formation-Dropdown** | 7 Kicker-Formationen (3-4-3, 4-4-2, 4-3-3, 3-5-2, 5-3-2, 5-4-1, 4-5-1) |
| **11 Feldpositionen** | Bevorzugte Startelf-Preview (nicht bindend für Draft, aber visuell) |
| **Spielerkarte** | Foto (SofaScore), Name, Vereinslogo, Kennzahl (user-wählbar) |
| **Bank-Bereich** | Restliche 11 Kader-Spieler, gruppiert nach TOR/ABW/MIT/STU |
| **Drag & Drop** | Spieler zwischen Feld, Bank und „frei“ tauschen |
| **Lock-Icon** | Spieler fixieren → Solver darf bei „Neu mischen“ nicht ersetzen |
| **Highlight** | Orchestrator-Vorschläge: dezenter Cyan-Rand; manuell geändert: Amber |

**Draft-Modus vs. Kicker:** Im Draft zeigt das Feld eine **Vorschau-Startelf** aus dem 22er-Kader. Die restlichen 11 sind die Bank. Im Kicker-Spieltag-Modus (Ebene 2) wird dieselbe UI für die echte Aufstellung wiederverwendet.

### 3.2 Spieler-Datenbank (rechts)

**Kern-Unterschied zum Kicker:** Nicht nur 3 Tabs (Punkte / Einsätze / Marktwert), sondern **voll sortier- und filterbar** nach allen berechneten Kriterien.

#### Sortierbare Spalten (Vorschlag)

| Gruppe | Spalten |
|--------|---------|
| **Kicker-Basis** | Marktwert, Position, Verein, Vorjahres-Punkte |
| **Prognose** | xPunkte (Saison), xPunkte/Mio, Spieltags-Vektor-Summe HR/RR |
| **Risiko** | Floor, Ceiling, STAB-Index, STABW, Volatilität |
| **Effizienz** | Pkt/Mio, GEILHEIT, MW-Index |
| **Einsatz** | xStartelf-Einsätze, Einsatzwahrscheinlichkeit, Einsätze HR |
| **Überperformer** | Überperformer-Score, MW-Ineffizienz, LLM-Confidence |
| **SofaScore** | Ø Rating, Tore, Assists, xG, xA |
| **Meta** | Alter, Flexibilität, Verletzungs-Flag |

- **Multi-Sort:** Primär + Sekundär (z. B. xPunkte/Mio ↓, dann STAB ↑)
- **Spalten ein-/ausblenden** (User-Präferenz speichern)
- **Schnellfilter:** „Nur Überperformer“, „Unter 2 Mio“, „Comeback“, „Neuzugang“

#### Aktionen pro Spieler

| Aktion | Effekt |
|--------|--------|
| **In Kader** | Spieler auf nächsten freien Positions-Slot |
| **Auf Position X** | Direkt auf TOR/ABW/MIT/STU-Slot (wenn frei) |
| **Ausschließen** | Blacklist für Solver (bleibt bis Entfernen) |
| **Details** | Drawer: Spieltags-Chart SP01–34, LLM-Begründung, SofaScore-KPIs |

---

## 4. Orchestrator-Workflow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Risiko-Profil│────►│ Vorschlags-     │────►│ 22 Spieler in    │
│ auswählen    │     │ Engine (Solver) │     │ Kader-Slots      │
└──────────────┘     └────────┬────────┘     └────────┬─────────┘
                              │                        │
                              ▼                        ▼
                     ┌─────────────────┐     ┌──────────────────┐
                     │ Locked/Excluded │     │ User passt an    │
                     │ berücksichtigt  │     │ (Drag/Drop/DB)   │
                     └─────────────────┘     └────────┬─────────┘
                                                      │
                              ┌────────────────────────┘
                              ▼
                     ┌──────────────────┐
                     │ Validierung OK?  │
                     │ Speichern/Laden  │
                     └──────────────────┘
```

### 4.1 „Vorschläge generieren“

- Input: Profil-Gewichtungen + Kicker-Import + Forecast-Daten
- Constraints: Budget 42,5 Mio., 3-7-7-5, excluded/locked
- Output: 22 Spieler + erwartete Saisonpunkte + Begründungs-Snippets (LLM optional)
- **„Neu mischen“:** Re-Run mit gleichen Locks, andere Zufalls-/Alternative-Lösung (OR-Tools)

### 4.2 „Teilübernahme“

User kann einzelne Vorschläge:
- ✅ behalten (lock)
- 🔄 manuell ersetzen (aus DB)
- ❌ ausschließen (Solver findet Ersatz bei Re-Run)

---

## 5. Kader speichern / laden

### 5.1 Datenmodell `SavedSquad`

```
SavedSquad
├── id, name ("Variante A – Floor", "Überperformer-Test")
├── created_at, updated_at
├── risk_profile_id
├── league: "BL"
├── players[22]: { player_id, slot_type: TOR|ABW|MIT|STU, locked: bool }
├── preferred_formation: "4-3-3"
├── preferred_starters[11]: player_ids (optional)
├── excluded_player_ids[]
├── metadata: { total_cost, expected_points, pkt_per_mio, solver_version }
└── notes: string (User-Kommentar)
```

### 5.2 UI-Funktionen

| Funktion | Beschreibung |
|----------|--------------|
| **Auto-Save** | Jede Änderung speichert den Tab sofort (kein Button) |
| **Laden** | Dropdown pro Tab – gespeicherte Entwürfe |
| **Duplizieren** | „Variante B von A“ – kleine Tweaks testen |
| **Export** | JSON/CSV mit Spielernamen für manuelles Eintragen in Kicker |
| **Import** | Gespeicherten Stand wieder öffnen |

**Hinweis:** Direktes Schreiben in Kicker-Account ist nicht möglich (kein API) – Export als Hilfsliste.

---

## 6. Validierungs-Leiste (permanent sichtbar)

| Check | Anzeige |
|-------|---------|
| Budget | Fortschrittsbalken 38,2 / 42,5 Mio. € (grün/gelb/rot) |
| Kadergröße | 22/22 |
| Positionen | TOR 3/3 · ABW 7/7 · MIT 7/7 · STU 5/5 |
| Gültigkeit | ✅ Regelkonform / ⚠️ Unvollständig |
| Prognose | Erwartete Saisonpunkte, Pkt/Mio |

Fehler blockieren nicht das Speichern als „Entwurf“, aber markieren „nicht kicker-ready“.

---

## 7. Unterschiede zum Kicker-UI

| Aspekt | Kicker | KMI Orchestrator |
|--------|--------|------------------|
| Datenbank-Sortierung | 3 feste Tabs | Alle Kriterien, Multi-Sort, Filter |
| Spielervorschläge | Keine | Profil-basierte Engine |
| Kader speichern | Nur im Kicker-Account | Mehrere lokale Varianten |
| Kennzahlen | Punkte, Einsätze, MW | + xPunkte, STAB, Überperformer, LLM |
| Begründung | Keine | „Warum dieser Pick?“ (optional) |
| Re-Optimierung | Keine | „Neu mischen“ mit Locks |

---

## 8. Phasen-Roadmap UI

| Phase | Scope |
|-------|-------|
| **P1 – Draft Orchestrator** | Split-View, Profilwahl, Vorschläge, manuelle Anpassung, Speichern/Laden |
| **P2 – Startelf-Modus** | Gleiche UI, 22er-Kader fix, Spieltags-Optimizer |
| **P3 – Saison-Dashboard** | Tracking, Transfer-Erinnerungen, Ist vs. Prognose |

---

## 9. Wireframe-Referenz

Visuelle Orientierung: Kicker Interactive Aufstellung (grünes Spielfeld, Spielerkarten mit Foto, rechte Sidebar nach Positionen gruppiert).  
KMI übernimmt das vertraute Layout, erweitert die rechte Spalte zur **vollwertigen Analyse-Datenbank**.

---

## 10. Entscheidungen UI (fixiert 2026-07-08)

| # | Entscheidung |
|---|--------------|
| 1 | **Tabs** pro Kader-Variante – je Tab eigenes Risiko-Profil + Laden |
| 2 | Pro Tab **5-Sterne-Favorit** (subjektiv, unabhängig von xPunkte) |
| 3 | Feld = **11 Startelf-Preview + 11 Bank** (wie Kicker-Screenshot) |
| 4 | Wireframe → Google Stitch → dann Implementierung |

Siehe [`wireframe-draft-orchestrator.md`](./wireframe-draft-orchestrator.md) – **ersetzt offene Punkte unten.**

---

## 11. Referenz-Dokumente

- [Wireframe v1](./wireframe-draft-orchestrator.md) (Stitch-Handoff)
- [Spielregeln](./spielregeln-kicker-ia.md)
