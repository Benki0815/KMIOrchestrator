# Tauschen

> Stand: 2026-08-24

## Ablauf

1. Im **Entwerfen**-Modus Spieler zum Tausch markieren (Tausch-Icon auf Feld-Chip **oder Bank-Zeile**).
2. Tab **Tauschen** öffnen – bis zu drei Varianten A/B/C parallel.
3. Leeren Slot anklicken oder **Alternative wählen** → Sortierliste (gleiche Spalten wie Spielerpool: Fav, Sterne, xPunkte, MW, Score, PlAIer usw.; Fav/Sterne-Filter oben).
4. Zeile öffnet die Spieler-Card. Von dort **In Variante X übernehmen** oder **Zurück zur Liste**, dann unten **Auswahl in Variante übernehmen**.
5. **Variante übernehmen** schreibt die gesetzten Tausche direkt in den Kader und wechselt zurück zu Entwerfen.

`Präsentieren` bleibt im Code (Raus/Rein, `applySwapPlan`), ist in der Navi aber ausgeblendet.

## Regeln

- Alternative nur gleiche Position, nicht schon im Kader (außer selbst markierte Raus-Spieler).
- Startelf- und **Bank-Spieler** können markiert werden; Übernehmen ersetzt den jeweiligen Slot.
- Übernehmen ist gesperrt, wenn die Variante das Budget sprengt.
- Teilweise gesetzte Varianten (z. B. 1 von 2) tauschen nur die gesetzten Slots.
