# Setup auf dockerhost274 (einmalig)

Dieses Setup richtet den Deploy-User, sudoers, Pfade und Basisrechte fuer den produktiven Betrieb ein.

## 1) User und Verzeichnis

```bash
ssh dockerhost274
sudo useradd -r -m -s /bin/bash -G docker kmi-svc
sudo mkdir -p /data/docker/kmi-orchestrator/{config,data}
sudo chown -R kmi-svc:kmi-svc /data/docker/kmi-orchestrator
```

## 2) SSH-Key fuer kmi-svc

```bash
sudo mkdir -p /home/kmi-svc/.ssh
sudo chmod 700 /home/kmi-svc/.ssh
echo "PUBLIC_KEY_HIER" | sudo tee /home/kmi-svc/.ssh/authorized_keys
sudo chmod 600 /home/kmi-svc/.ssh/authorized_keys
sudo chown -R kmi-svc:kmi-svc /home/kmi-svc/.ssh
```

## 3) Eingeschraenkte sudoers-Regel

Datei: `/etc/sudoers.d/kmi-svc`

```bash
sudo tee /etc/sudoers.d/kmi-svc >/dev/null <<'EOF'
kmi-svc ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose
EOF
sudo chmod 440 /etc/sudoers.d/kmi-svc
```

## 4) .env bereitstellen

Auf dem Host in `/data/docker/kmi-orchestrator/.env`:

```env
SOFASCORE_RAPIDAPI_KEY=...
OPENROUTER_API_KEY=...
SOFASCORE_QUOTA_PROTECT=500
SOFASCORE_MIN_REMAINING_BEFORE_FETCH=10
NEXT_PUBLIC_APP_URL=http://100.84.97.16:3050
```

## 5) Erstdeploy

```bash
ssh dockerhost274-kmi "cd /data/docker/kmi-orchestrator && docker compose up -d --build"
ssh dockerhost274-kmi "docker compose -f /data/docker/kmi-orchestrator/docker-compose.yml ps"
ssh dockerhost274-kmi "curl -sS http://127.0.0.1:8050/health"
```

## 6) Persistenz + Backup

- Persistente Daten liegen in `/data/docker/kmi-orchestrator/data/` (SQLite + Backups).
- Config liegt in `/data/docker/kmi-orchestrator/config/`.
- Der bestehende Host-Backupjob (`/data/docker` -> NAS) nimmt beides automatisch mit.
