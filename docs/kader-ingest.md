# Kader-Ingest (Spielerpool)

> Stand: 2026-09-04 · Version `v.0904.001`

Scout-Medien (YouTube/Podcast inkl. Ligainsider) und wie sie in Scores/Values
landen, inkl. Daily-Queue/Resume: [scout-quellen.md](./scout-quellen.md).

## Quelle

`kicker-scout` lädt die offizielle Kicker-CSV der **aktuellen** Bundesliga-Saison
(`players-details/se-k00012026.csv`). Darin stehen alle ~18 Kader, inklusive Aufsteiger.

Vorjahrespunkte der Aufsteiger: zuerst `se-k00022025`, Fallback `se-k00022024`
(Match über Kicker-Spieler-ID, nicht nur Name). `se-k00022025` enthält im Aug 2026
den neuen 2.-Liga-Kader ohne S04/SVE/SCP.

`Notendurchschnitt=0.0` in der BL-CSV ist **keine Note**, sondern „nicht benotet“
(typisch Aufsteiger). `fetch_kicker_data.py` übernimmt in dem Fall die 2.-Liga-Note
(z.B. Curda 3.69). `0.0` darf nicht als vorhandener Wert gelten, sonst landet der
Slider bei 3.50 und die Notenpunkte bei 0.

## Stale 2L-Archivpunkte (Curda-Fall, 26.08.2026)

`se-k00022024` liefert für Aufsteiger oft **2024/25**-Kickerpunkte, während
Tore/Vorlagen/Einsätze aus geozocco die **2025/26**-Saison sind.

Beispiel Curda: CSV 62 Punkte (Saison 24/25) gegen 32 Starts / 7 Tore / 8 Assists
(25/26). Selbst als reine Einwechslung: 32×2 + 7×4 + 8×2 = 108. 62 ist unmöglich.

Audit 26.08.2026: Die erste Heuristik (`stored < starts×4×0.7`) hat **80 BL-Spieler
falsch überschrieben** (Bank/Einwechsel, z.B. Höler 86→147) und Transfers mit
CSV=0 voll aus geozocco-Stats erfunden (Vogt 0→187).

Aktuelle Regel:

| Quelle | Pkt 25/26 | xPunkte 26/27 |
|---|---|---|
| `BL` und CSV > 0 | immer offizielle Kicker-CSV | Modell aus Stats/Note/Baseline-Override |
| `2L` und CSV unmöglich (unter All-Subs-Boden) | Rekonstruktion (alle Apps als Startelf, Note 3.50) | dieselbe Rekonstruktion |
| CSV = 0 / None (Transfer, Ausland, Jugend) | **0** | Modell aus Vorsaison-Stats (kein Kicker-Jahr) |

## Anzeige (Feld / Bank / Liste)

Rohdaten bleiben wie oben (Pkt 25/26 = 0 ist bei Transfers korrekt). In der UI gilt
für die **eine** sichtbare Punktzahl:

1. xPunkte, wenn gesetzt (übernommene Prognose oder Modell)
2. sonst Pkt 25/26

Im Toggle **Saison 25/26** bleibt die Vorsaison führend, fällt aber auf xPunkte
zurück wenn 25/26 leer ist (Karetsas/Veerman nicht mehr als 0er). **Prognose 26/27**
zeigt xPunkte und fällt auf 25/26 zurück wenn das Modell 0 ist.

Ramaj/Batz: Pkt 25/26 bleiben die echten Vorjahres-Kickerpunkte (anderer Verein),
xPunkte kommen aus dem manuellen Baseline-Override (Ersatzrolle).

## Deal-Score (`ueberperformerScore`)

Kein reines Mention-Ja/Nein mehr. Skala 0–99, absichtlich streng:

- 50 = kein Scout-Signal
- ~80 = interessant (billig + Scouts + etwas Breite)
- Anfang 90 = Mega-Deal
- 99 nur alle paar Jahre

Faktoren: Scout-Score, Preis (günstig lohnt), xPunkte/Mio, Anzahl Mentions (einzelnes Mention reicht nicht für 90). Neutral ohne Mentions bleibt 50.

## Pool-Regel

Ein Spieler gehört in die SDB, wenn sein **aktueller Verein** ein BL-Club 2026/27 ist –
nicht nur, wenn die Vorsaisonspunkte aus der 1. Liga stammen.

| `points_source` | Bedeutung | Im Pool? |
|---|---|---|
| `BL` | Vorsaison 1. Liga | ja |
| `2L` | Vorsaison 2. Liga (Aufsteiger) | ja, wenn Verein jetzt BL |
| `None` | kein Punkte-Match | ja, wenn Verein jetzt BL |

Umgesetzt in `kicker-scout/scripts/push_to_kmi.py` (`current_pool_teams`) und
verteidigt in `backend/app/main.py` (`CURRENT_BUNDESLIGA_CODES`).

Nach jedem Ingest läuft ein **CSV-Overlay** gegen `se-k00012026`: Club/Preis der
offiziellen IDs werden überschrieben, jeder Spieler der nicht mehr in der CSV steht
wird `active=false` (Default-API blendet Inactive aus). Ohne Overlay bleiben Abgänge
ewig im Pool, weil Seed/Push nur upserten.

Manuell: `POST /api/admin/ingest/refresh-squad`.

Kicker-CSV kann sich **nach** dem Daily-Job (09:00) noch ändern. Dann fehlen
Zugänge bis zum nächsten Fetch; Abgänge erst nach Overlay/Re-Push.

## Bekannter Fehlstand (behoben)

Am 24.08.2026 filterte der Push auf `points_source == "BL"`. Folge: Schalke nur
Adamu + Wöber, Elversberg/Paderborn fast leer. Die restlichen Kaderspieler lagen
in der Scout-DB, wurden aber mit `active=false` an KMI geschickt und vom API-
Default `includeInactive=false` versteckt.

## Re-Push

- `python scripts/fetch_kicker_data.py` lädt BL-CSV `se-k00012026` plus 2L-Fallback
  `se-k00022025` und Archiv `se-k00022024` (Aufsteiger-Punkte per Kicker-ID).
- Danach `python app/seed.py` und `python scripts/push_to_kmi.py`.
