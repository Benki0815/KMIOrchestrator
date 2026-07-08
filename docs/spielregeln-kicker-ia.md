# Kicker Managerspiel Interactive – Spielregeln (vollständig)

> Quelle: [kicker.de – Interactive Spielregeln](https://www.kicker.de/spielregeln-managerspiel-interactive-782799/artikel/interactive-spielregeln)  
> Stand: 2026-07-08 (User-Text + offizielle Artikel)

Diese Regeln sind **harte Constraints** für den Draft-Orchestrator, Solver und Validierung.

---

## 1. Grundprinzip

- Team mit **22 Spielern** zusammenstellen
- Spieltag für Spieltag **Startelf** aufstellen
- Aufgestellte Spieler sammeln Punkte → Saison-Ranking
- Teilnahme **kostenlos**, kicker-Account erforderlich

---

## 2. Teilnahme & Einstieg

- **3 Wettbewerbe:** Bundesliga, 2. Bundesliga, 3. Liga (bis zu 3 Teams, auch nur einer)
- Kader **üblicherweise vor Saisonbeginn** über Transfermarkt
- Bis Saisonbeginn: Kader **beliebig oft** änderbar
- **Mit Anpfiff Spiel 1:** Transfermarkt geschlossen
- Ungültiger Kader → keine Wertung; nach Korrektur Wiedereinstieg nächster Spieltag
- **10 Min vor Anpfiff:** keine Änderungen, die Kader kurzfristig ungültig machen
- **Einstieg nach Saisonbeginn:** jederzeit möglich, schlechteres Gesamt-Ranking
- Nach Saisonbeginn: Transfers bis **nächster Spieltag** möglich

---

## 3. Kaderzusammenstellung

### 3.1 Hard Constraints

```
Σ Marktwert ≤ Budget
|Kader| = 22
COUNT(TOR) = 3
COUNT(ABW) = 7
COUNT(MIT) = 7
COUNT(STU) = 5
```

| Liga | Budget |
|------|--------|
| **Bundesliga** | **42,5 Mio. €** |
| 2. Bundesliga | 10 Mio. € |
| 3. Liga | 6 Mio. € |

### 3.2 Weitere Regeln

- **Marktwerte** werden von kicker-Redaktion gesetzt, **ändern sich nicht** in der Saison
- **Positionen** einmalig festgelegt, **ändern sich nicht** (auch bei realer Positionsänderung)
- Seit 2021/22: **beliebig viele Spieler eines Vereins** erlaubt (kein Club-Limit mehr)
- Nur **vollständige, gültige** Kader in der Wertung

**KMI-Fokus:** Bundesliga, 42,5 Mio., 3-7-7-5.

---

## 4. Formationen & Aufstellung

### 4.1 Formationen (7 Stück)

Zu jedem Spieltag wählbar (teilweise bis Spielbeginn änderbar):

- 3-4-3, 4-4-2, 4-3-3, 3-5-2, 5-3-2, 5-4-1, 4-5-1

### 4.2 Spieltags-Aufstellung

- **Startelf** vor Spieltag festlegen, jeden Spieltag änderbar
- **Keine Auto-Wechsel** – nur manuell
- Seit 2021/22: Kader **nicht** mit Anpfiff gesperrt
- Spieler deren Spiel **noch nicht begonnen** hat → bis Spielbeginn tauschbar
- Formation variabel bis keine Wechsel mehr möglich
- **Nachholspiele:** Tausch bis **Montag-Auswertung** möglich (nicht explizit für Nachholspiel)

### 4.3 Bewertungsrelevant

- Nur **Startelf + Einwechsel** werden gewertet
- Bank ohne Einsatz = 0 Punkte

---

## 5. Punktesystem (exakt)

### 5.1 Aufstellung

| Ereignis | Punkte |
|----------|--------|
| Startaufstellung | **4** |
| Einwechselung | **2** |

### 5.2 Kicker-Noten (min. ~25 Min, Ausnahmen möglich)

| Note | Punkte |
|------|--------|
| 1,0 | +10 |
| 1,5 | +8 |
| 2,0 | +6 |
| 2,5 | +4 |
| 3,0 | +2 |
| 3,5 | 0 |
| 4,0 | -2 |
| 4,5 | -4 |
| 5,0 | -6 |
| 5,5 | -8 |
| 6,0 | -10 |

### 5.3 Tore (positionsabhängig)

| Position | Punkte/Tor |
|----------|------------|
| Torwart | 6 |
| Abwehr | 5 |
| Mittelfeld | 4 |
| Sturm | 3 |

### 5.4 Platzverweise

| Ereignis | Punkte |
|----------|--------|
| Gelb-Rot | -3 |
| Rot | -6 |

### 5.5 Sonstige

| Ereignis | Punkte |
|----------|--------|
| Assist | **2** |
| Weiße Weste (TW volle Spielzeit ohne Gegentor) | 2 |
| Spieler des Spiels | 3 |

---

## 6. Transferfenster

**Maximal 4 Transfers** pro Saison, zwei Zeiträume:

| Phase | Transfers |
|-------|-----------|
| Nach **Deadline Day** | **1** |
| **Winterpause** | **max. 4** (gesamt-Saison-Limit beachten) |

### 6.1 Positions-Regel

- Abwehr nur ↔ Abwehr, Stürmer nur ↔ Stürmer, etc.
- Nicht alle 4 Wechsel müssen genutzt werden

### 6.2 Beispiele (offiziell)

**Beispiel 1:** Deadline: A→B. Winter: B verkaufen, A zurückkaufen → wieder 4 Transfers frei.

**Beispiel 2:** Deadline: A→B. Winter: B→C. 21 Plätze unberührt → **3** Transfers übrig.

**Beispiel 3:** Deadline: A→B. Winter: D verkaufen, A zurückkaufen → **3** Transfers übrig.

### 6.3 Fenster-Regeln

- Winterfenster: öffnet nach letzter Auswertung vor Winterpause, schließt mit Anpfiff erstes Spiel nach Pause
- Innerhalb Fenster: **beliebig oft** kaufen/verkaufen (auch Rückgängig)
- Am Fenster-Ende: Kader muss **gültig** sein
- Vereinswechsel in der Saison: Spieler **nicht mehr** auf Transfermarkt (Verkauf rückgängig über Transferübersicht)

---

## 7. Auswertung

- Spieltags-Auswertung: üblicherweise **Montagvormittag** (EN-Wochen: Donnerstag)
- Abgesagte Spiele: Nachwertung; Aufstellung vom **ursprünglichen Spieltag** zählt
- Verkaufte Spieler: Punkte für Nachholspiel werden trotzdem gutgeschrieben
- Punktgleichstand: **Los**
- Nachholspiele: nicht bei Spieltagssieg-Preisen

---

## 8. Managerliga

- Optional, auch ohne Liga im Gesamtranking spielbar
- Max. **1.000** Manager pro Liga, **10** Ligen pro Manager
- Einladung per Link, kein Bewerbungsverfahren

---

## 9. Mapping auf KMI Orchestrator

| Regel | System |
|-------|--------|
| Budget 42,5 Mio. | `budget_max` Solver |
| 3-7-7-5 | Positions-Constraints |
| MW fix in Saison | Kein MW-Update nach Draft-Import |
| 7 Formationen | Formation-Dropdown UI |
| Punkte-Tabelle | Scoring-Engine (Simulation) |
| 4 Transfers | Dashboard-Reminder |
| Startelf-Logik | Ebene 2 – Lineup-Modul |
| 22er-Kader-UI | Draft Orchestrator (Split-View) |

---

## 10. Referenzen

- [Spielregeln Interactive](https://www.kicker.de/spielregeln-managerspiel-interactive-782799/artikel/interactive-spielregeln)
- [FAQ](https://www.kicker.de) (verlinkt in Spielregeln)
