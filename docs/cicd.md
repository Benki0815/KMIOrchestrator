# CI/CD und Deployment-Regeln (Projekt: KMI Orchestrator)

## Zweck
Projektspezifische Regeln für Build, Deploy, Versionierung und Zielumgebung auf **DockerHost274**.

## Grundregeln
- Nur deployen, wenn die aktuelle Änderung dies wirklich erfordert.
- Nur neu bauen, wenn ein Rebuild technisch notwendig ist.
- Nur neu starten, wenn Hot-Reload, Reload oder ein reiner Datei-Sync nicht ausreicht.
- Änderungen mit möglichem Betriebsrisiko zuerst knapp benennen.

## Git
- Remote: https://github.com/Benki0815/KMIOrchestrator.git
- Commits klar und kurz auf Englisch formulieren.
- Push nur bei vorhandenem Remote und wenn der Projektablauf dies vorsieht.

## Env-Variablen (lokal, nicht committen)

| Variable | Zweck |
|----------|-------|
| `SOFASCORE_RAPIDAPI_KEY` | SofaScore via RapidAPI (shared BallistiXG) |
| `OPENROUTER_API_KEY` | LLM (neuer Key ausstehend) |
| `SOFASCORE_QUOTA_PROTECT` | Quota-Schutz-Schwelle (default 500) |
| `NEXT_PUBLIC_APP_URL` | Öffentliche Frontend-URL (default Tailscale) |

Siehe `.env.example` und `docs/integrations/`.

## Versionierung
- Schema: `v.<MM><DD>.<NNN>` — Tageszähler startet täglich bei 001.
- Anpassen in `frontend/package.json`, `frontend/src/lib/version.ts` und `backend/app/main.py` (`APP_VERSION`). Footer liest `APP_VERSION`.

## Zielumgebung (DockerHost274)

| Item | Wert |
|------|------|
| Admin-SSH | `ssh dockerhost274` (`herbergsvater`) |
| Deploy-SSH | `ssh dockerhost274-kmi` (`kmi-svc`) |
| Host Tailscale | `100.84.97.16` |
| Host LAN | `192.168.178.251` |
| Projektpfad | `/data/docker/kmi-orchestrator/` |
| Compose | `/data/docker/kmi-orchestrator/docker-compose.yml` |
| Container | `kmi-frontend`, `kmi-backend` |
| Ports | Frontend **3050**, Backend **8050** |
| Mounts | `./config` → `/app/config:ro`, `./data` → `/app/data` (rw, Backend) |
| Sudoers | `/etc/sudoers.d/kmi-svc` (docker / docker-compose, NOPASSWD) |

### SSH-Alias (lokal `~/.ssh/config`)

```
Host dockerhost274-kmi
    HostName 100.84.97.16
    User kmi-svc
    IdentityFile ~/.ssh/id_ed25519_kmi
```

### Erreichbarkeit

| Kontext | Frontend | Backend Health |
|---------|----------|----------------|
| LAN | http://192.168.178.251:3050/ | http://192.168.178.251:8050/health |
| Tailscale | http://100.84.97.16:3050/ | http://100.84.97.16:8050/health |

Homepage listet den Service mit Auto-Switch LAN/Tailscale (`id: kmi-orchestrator`).

## Deploy-Ablauf

```powershell
# Sync (Beispiel: tar über SSH)
# Danach auf dem Host:
ssh dockerhost274-kmi "cd /data/docker/kmi-orchestrator && docker compose up -d --build"
ssh dockerhost274-kmi "docker compose -f /data/docker/kmi-orchestrator/docker-compose.yml ps"
ssh dockerhost274-kmi "curl -sS http://127.0.0.1:8050/health"
```

- Reiner Config-/Data-Sync: oft kein Rebuild nötig; Backend ggf. `docker compose restart backend`.
- Frontend-Code: Rebuild (`--build`) erforderlich (Next.js Production-Image).

## Homepage-Eintrag aktualisieren

Workspace: `c:\Dev\Homepage`

```powershell
scp C:\Dev\Homepage\config\services.yaml dockerhost274-homepage:/data/docker/homepage/config/services.yaml
scp C:\Dev\Homepage\config\custom.js dockerhost274-homepage:/data/docker/homepage/config/custom.js
ssh dockerhost274-homepage "cd /data/docker/homepage && docker compose restart"
```

## Validierung nach Deployment
- `docker compose ps` → beide Container `Up`
- `GET /health` → `{"status":"ok",...}`
- Frontend HTTP 200 auf Port 3050
- Homepage-Kachel `KMI Orchestrator` sichtbar; Link LAN vs. Tailscale je nach Client
