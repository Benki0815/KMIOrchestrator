# Kader-Ingest (Spielerpool)

> Stand: 2026-08-24

Scout-Medien (YouTube/Podcast inkl. Ligainsider) und wie sie in Scores/Values
landen, inkl. Daily-Queue/Resume: [scout-quellen.md](./scout-quellen.md).

## Quelle

`kicker-scout` lädt die offizielle Kicker-CSV der **aktuellen** Bundesliga-Saison
(`players-details/se-k00012026.csv`). Darin stehen alle ~18 Kader, inklusive Aufsteiger.

Vorjahrespunkte der Aufsteiger: zuerst `se-k00022025`, Fallback `se-k00022024`
(Match über Kicker-Spieler-ID, nicht nur Name). `se-k00022025` enthält im Aug 2026
den neuen 2.-Liga-Kader ohne S04/SVE/SCP.

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

## Bekannter Fehlstand (behoben)

Am 24.08.2026 filterte der Push auf `points_source == "BL"`. Folge: Schalke nur
Adamu + Wöber, Elversberg/Paderborn fast leer. Die restlichen Kaderspieler lagen
in der Scout-DB, wurden aber mit `active=false` an KMI geschickt und vom API-
Default `includeInactive=false` versteckt.

## Re-Push

- `python scripts/fetch_kicker_data.py` lädt BL-CSV `se-k00012026` plus 2L-Fallback
  `se-k00022025` und Archiv `se-k00022024` (Aufsteiger-Punkte per Kicker-ID).
- Danach `python app/seed.py` und `python scripts/push_to_kmi.py`.
