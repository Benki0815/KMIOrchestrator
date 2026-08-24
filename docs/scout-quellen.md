# Scout-Quellen (kicker-scout → KMI)

> Stand: 2026-08-24 · Version `v.0824.012`

Analysen, Values und Kernaussagen kommen nicht aus dem KMI-Repo selbst, sondern
aus **kicker-scout** (`c:\Dev\privateTemp\kicker-scout`). Der tägliche Job
(`scripts/daily_update.py`, Windows-Task `KickerScoutDailyUpdate`, 09:00)
lädt neue Medien, transkribiert sie, extrahiert Spieler-/Team-Einschätzungen
und pusht sie nach `http://100.84.97.16:8050/api/admin/ingest/payload` bzw.
`/api/admin/ingest/teams`.

## YouTube

| Quelle (`source_name`) | Kanal | Gewicht | Seit |
|---|---|---|---|
| `ManagerUnited11` | [@ManagerUnited11](https://www.youtube.com/@ManagerUnited11) Videos | 1.0 | 2026-07-30 |
| `ManagerUnited11_Shorts` | dieselben Shorts | 1.0 | 2026-07-30 |
| `Ligainsider` | [@ligainsider_de](https://www.youtube.com/@ligainsider_de) Videos | 1.0 | 2026-05-21 |
| `Ligainsider_Shorts` | dieselben Shorts | 1.0 | 2026-05-21 |
| `Magisches_zweieck` | [@Magisches_zweieck](https://www.youtube.com/@Magisches_zweieck) | 0.5 | Test (max. 3) |

**Ligainsider-Startpunkt:** Video
[So spielt UNION BERLIN unter dem neuen Trainer Mauro Lustrinelli!](https://www.youtube.com/watch?v=rRxOMU5A0V0)
(Upload 2026-05-21). Alles ab diesem Datum inkl. wird geholt, transkribiert
und in Spieler-Mentions / Team-Kernaussagen / Value-Flags übernommen.

Gewicht 1.0 wie Manager United: Taktik-/Teamchecks fließen voll in Score und
Value-Picks ein (`kicker-scout/app/scoring.py` `SOURCE_WEIGHTS`). Im Dashboard
erscheint die Quelle **amber**.

Shorts: der neueste Clip lag am 24.08.2026 vor dem Stichtag (15.05.) — im
Backfill-Fenster also keine Shorts.

## Queue / Resume (Manifest)

Status pro Medium in `kicker-scout/data/manifest.json`:

| Status | Bedeutung |
|---|---|
| `downloaded` | MP3 liegt da, Transkription ausstehend (Queue) |
| `transcribed` | Whisper fertig, Extraktion ausstehend |
| `extracted` | Spieler-/Team-JSON geschrieben |
| `error` | Download/Transkription fehlgeschlagen; Daily-Job heilt/retried |

`transcribe.py` schreibt das Manifest **nach jeder fertigen Datei**. Ein
heruntergefahrener PC verliert nur das **aktuell laufende** Video (kein
Whisper-Checkpoint). Fertige Transkripte bleiben. Beim nächsten Lauf
(manuell oder Daily 09:00) geht es mit dem ersten Eintrag `downloaded` weiter,
nicht mitten in der Datei.

YouTube-IDs stehen zusätzlich in `data/youtube_download_archive.txt` — bereits
geholte Videos werden nicht nochmal geladen.

**Daily 09:00** (`KickerScoutDailyUpdate`, unbegrenzt, `StartWhenAvailable`):

1. Kicker-CSV nur bis 02.09.2026
2. YouTube/Podcast fetchen + Error-Heal
3. Restliche `downloaded` transkribieren
4. Cursor-Agent extrahiert Transkripte (Standard max. 8 pro Runde × 3 Runden =
   24/Tag, Rest bleibt `transcribed` bis zum Folgetag)
5. Reseed, Git, KMI-Push

PC aus über Nacht: Queue bleibt auf Platte. Um 09:00 (sobald der Rechner wieder
läuft bzw. nachholt, falls der Task `StartWhenAvailable` greift) geht es nach
dem letzten vollständigen Video weiter.

## Podcasts

| Quelle | Feed | Gewicht |
|---|---|---|
| `MAIK mit AI` | MAIK mit AI | 1.0 |
| `MML Daily` | Bundesliga-Vorschau 26/27 (Team-Rubrik) | Default 0.5, primär Teams |

## Daily-Job nach Transferfenster

Ab 03.09.2026 entfällt nur der Kicker-CSV-Abgleich. YouTube/Podcast, Whisper,
Extraktion und KMI-Push laufen weiter, damit neue Ligainsider-/MU-Videos
weiter ins System kommen.
