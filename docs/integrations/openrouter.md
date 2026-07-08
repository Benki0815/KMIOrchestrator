# OpenRouter-Integration (KMI Orchestrator)

> LLM-Provider für Überperformer-Recherche, News-Kontext und Erklärungen  
> API: https://openrouter.ai/api/v1

---

## 1. Verbindung

| Setting | Value |
|---------|-------|
| Base URL | `https://openrouter.ai/api/v1` |
| Env | `OPENROUTER_API_KEY` in `.env` |
| SDK | OpenAI-kompatibel (`openai` Python package) |
| Referenz | `BallistiXG/backend/app/services/llm_service.py` |

```python
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)
```

---

## 2. Einsatz im KMI-Orchestrator

| Task | Input | Output (Structured JSON) |
|------|-------|--------------------------|
| Überperformer-Analyse | Spieler-Features + News-Kontext | `adjustment_vector[34]`, `ueberperformer_score`, `reasons[]` |
| Verletzungs-Comeback | Name, Verein, SofaScore-Form | `confidence`, `playing_probability_adjustment` |
| Neuzugang-Bewertung | Transfer-News, alter vs. neuer Verein | `mw_inefficiency_flag`, `notes` |
| Draft-Erklärung | Solver-Ergebnis | Natürlichsprachige Begründung für User |

**Wichtig:** LLM liefert **Adjustments**, nicht die alleinige Punkte-Quelle (Hybrid-Architektur).

---

## 3. Modellwahl

**Status:** Noch offen – User liefert neuen API-Key, Modell wird separat diskutiert.

Kriterien für Modellauswahl:
- Structured Output / JSON Schema Support
- Kosten pro 500+ Spieler-Batch (Draft-Saison)
- Latenz für interaktive Erklärungen
- Deutsch-sprachige Outputs

BallistiXG-Defaults (nur Referenz, nicht übernommen):
- `minimax/minimax-m2.7` für Narrative/Analysis

---

## 4. Quota & Kosten-Schutz

Übernommen aus BallistiXG (`llm_service.py`):

- Usage-Tracking in `system_metrics.key = 'openrouter_usage'`
- Optional: Wochenbudget-Cap (BallistiXG: `WEEKLY_BUDGET_USD = 5.00`)
- Logging aller Calls via API-Logger

**KMI-Vorschlag:**
- Kein LLM-Call für alle 500 Spieler auf einmal
- Nur für: Shortlist (Top 50), Überperformer-Kandidaten, User-angefragte Erklärungen
- Cache: `llm_player_analysis` mit TTL 48h

---

## 5. Env

```env
OPENROUTER_API_KEY=          # neuer Key vom User
OPENROUTER_WEEKLY_BUDGET_USD=5.00   # optional
OPENROUTER_MODEL_DRAFT=      # TBD
OPENROUTER_MODEL_EXPLAIN=    # TBD
```

Siehe `/.env.example`. Key wird vom User neu erstellt und ersetzt den interim kopierten BallistiXG-Key.
