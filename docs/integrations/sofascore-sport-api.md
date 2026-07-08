# Sofascore Sport API (apisummit) — BallistiXG Referenz

BallistiXG nutzt **von Beginn an** die [Sofascore Sport API auf RapidAPI (Provider: apisummit)](https://rapidapi.com/apisummit/api/sofascore-sport-api) als primäre Sportdatenquelle.

| | |
|---|---|
| **RapidAPI** | https://rapidapi.com/apisummit/api/sofascore-sport-api |
| **Host** | `sofascore-sport-api.p.rapidapi.com` |
| **Base URL** | `https://sofascore-sport-api.p.rapidapi.com` |
| **Pfad-Präfix** | `/api/...` (ohne `/api/v1`) |
| **Auth** | Header `X-RapidAPI-Key` + `X-RapidAPI-Host` |
| **Env (Backend)** | `SOFASCORE_RAPIDAPI_KEY` |
| **Client** | `backend/app/services/sofascore_client.py` |

> **Plan-Hinweis (2026):** Der frühere Pro-Plan ist auf RapidAPI abgekündigt, läuft für Bestandskunden aber noch. Renewal und Limits im [RapidAPI-Dashboard](https://rapidapi.com/developer/billing) prüfen.

## Was diese Datei ist

- **Beispiel-Sammlung** mit echten JSON-Responses für **18 dokumentierte Endpunkte** (siehe Index unten).
- **Keine vollständige API-Referenz** — viele im Code genutzte Endpunkte (z. B. `statistics`, `incidents`, `graph`, `events/next`) fehlen hier noch.
- Ergänzung / vollständiger Katalog geplant ab **08.06.2026** (nach Quota-Reset), per RapidAPI-Hub-Scrape + Code-Audit.

## Dokumentierte Endpunkte (Index)

| # | Pfad (Template) | Zeile |
|---|-----------------|-------|
| 1 | `GET /api/sport/football/{date}/{timezone}/categories` | 67 |
| 2 | `GET /api/unique-tournament/{id}` | 96 |
| 3 | `GET /api/tournament/{id}/seasons` | 372 |
| 4 | `GET /api/tournament/{id}/season/{seasonId}/events/round/{round}` | 386 |
| 5 | `GET /api/tournament/{id}/season/{seasonId}/events/round/{round}/slug/{slug}` | 396 |
| 6 | `GET /api/tournament/.../events/round/{round}/{span}/{page}` | 8507 |
| 7 | `GET /api/tournament/.../events/round/{round}` | 8509 |
| 8 | `GET /api/event/{id}/lineups` | 8519 |
| 9 | `GET /api/event/{id}` | 8655 |
| 10 | `GET /api/odds/provider/{id}/logo` | 8859 |
| 11 | `GET /api/odds/{id}/recommended-prematch/tournament/{tournamentId}` | 8861 |
| 12 | `GET /api/event/{id}/odds/{providerId}/all` | 9088 |
| 13 | `GET /api/team/{id}/players` | 9707 |
| 14 | `GET /api/player/{id}/attribute-overviews` | 10105 |
| 15 | `GET /api/player/{id}/events/last/{page}` | 10144 |
| 16 | `GET /api/player/{id}` | 17099 |
| 17 | `GET /api/player/{id}/unique-tournament/{tournamentId}/events/last/{page}` | 17192 |
| 18 | `GET /api/event/{id}/player/{playerId}/statistics` | 17487 |

## Im Code genutzt, aber hier noch ohne Beispiel-Block

Aus `SofascoreClient` / `LeagueFetcher` (Auszug):

- `GET /api/sport/football/scheduled-events/{date}`
- `GET /api/unique-tournament/{id}/season/{seasonId}/events/next/{page}`
- `GET /api/unique-tournament/{id}/season/{seasonId}/events/last/{page}`
- `GET /api/unique-tournament/{id}/season/{seasonId}/standings/total`
- `GET /api/event/{id}/statistics`
- `GET /api/event/{id}/incidents`
- `GET /api/event/{id}/graph`
- `GET /api/event/{id}/player/{playerId}/heatmap`
- `GET /api/team/{id}/unique-tournament/{tId}/season/{sId}/statistics/overall`
- `GET /api/unique-tournament/{id}/seasons`

---

## Beispiele (xhr + Response)

Nachfolgend die erfassten Endpunkte mit Beispiel-Responses:

xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/sport/football/2025-11-02/%7Btimezone%7D/categories');
xhr.setRequestHeader('x-rapidapi-key', '8kadQ7FX4Jmsh4Tmi6bJ0nToTXSPp1r5yK9jsnpHqMZPAHRvdq');
xhr.setRequestHeader('x-rapidapi-host', 'sofascore-sport-api.p.rapidapi.com');

Example Response:

[
  {
    "name": "England",
    "slug": "england",
    "sport": {
      "id": 1,
      "name": "Football",
      "slug": "football"
    },
    "tournaments": [
      {
        "id": 17,
        "name": "Premier League",
        "slug": "premier-league",
        "scheduledEvents": 5
      }
    ],
    "alpha2": "EN",
    "flag": "england"
  }
]


xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/unique-tournament/17');
Example Response:
{
  "uniqueTournament": {
    "name": "Premier League",
    "slug": "premier-league",
    "primaryColorHex": "#3c1c5a",
    "secondaryColorHex": "#f80158",
    "logo": {
      "md5": "36861710766b10701e2126a2d33021c4",
      "id": 1418035
    },
    "darkLogo": {
      "md5": "cac4c64c7f9e0878f33117bb29f7021a",
      "id": 1418033
    },
    "category": {
      "name": "England",
      "slug": "england",
      "sport": {
        "name": "Football",
        "slug": "football",
        "id": 1
      },
      "id": 1,
      "country": {
        "alpha2": "EN",
        "name": "England"
      },
      "flag": "england",
      "alpha2": "EN",
      "fieldTranslations": {
        "nameTranslation": {
          "ar": "إنجلترا",
          "hi": "इंग्लैंड",
          "bn": "ইংল্যান্ড"
        },
        "shortNameTranslation": {}
      }
    },
    "userCount": 1181400,
    "tier": 1,
    "titleHolder": {
      "name": "Liverpool",
      "slug": "liverpool",
      "shortName": "Liverpool",
      "gender": "M",
      "sport": {
        "name": "Football",
        "slug": "football",
        "id": 1
      },
      "userCount": 3322601,
      "nameCode": "LIV",
      "disabled": false,
      "national": false,
      "type": 0,
      "id": 44,
      "country": {
        "alpha2": "EN",
        "name": "England"
      },
      "teamColors": {
        "primary": "#cc0000",
        "secondary": "#ffffff",
        "text": "#ffffff"
      },
      "fieldTranslations": {
        "nameTranslation": {
          "ar": "ليفربول",
          "ru": "Ливерпуль",
          "hi": "लिवरपूल",
          "bn": "লিভারপুল"
        },
        "shortNameTranslation": {}
      }
    },
    "titleHolderTitles": 20,
    "mostTitles": 20,
    "linkedUniqueTournaments": [],
    "hasRounds": true,
    "hasGroups": false,
    "hasPlayoffSeries": false,
    "upperDivisions": [],
    "lowerDivisions": [
      {
        "name": "Championship",
        "slug": "championship",
        "primaryColorHex": "#20429a",
        "secondaryColorHex": "#ac944a",
        "logo": {
          "md5": "29a945d83732f069f92fb0986738b57f",
          "id": 294000
        },
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "country": {
            "alpha2": "EN",
            "name": "England"
          },
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "tier": 2,
        "hasRounds": true,
        "hasGroups": false,
        "hasPlayoffSeries": false,
        "hasPerformanceGraphFeature": true,
        "periodLength": {},
        "gender": "M",
        "id": 18,
        "country": {},
        "startDateTimestamp": 1754611200,
        "endDateTimestamp": 1779494400,
        "mostTitlesTeams": [
          {
            "name": "Leicester City",
            "slug": "leicester-city",
            "shortName": "Leicester",
            "gender": "M",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "userCount": 354039,
            "nameCode": "LEI",
            "disabled": false,
            "national": false,
            "type": 0,
            "id": 31,
            "country": {
              "alpha2": "EN",
              "name": "England"
            },
            "teamColors": {
              "primary": "#003090",
              "secondary": "#ffffff",
              "text": "#ffffff"
            },
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "ليستر سيتي",
                "ru": "Лестер Сити",
                "hi": "लैस्टर सिटी ऍफ़सी"
              },
              "shortNameTranslation": {
                "ar": "ليستر",
                "hi": "लीसेस्टर",
                "bn": "লেস্টার"
              }
            }
          }
        ],
        "disabledHomeAwayStandings": false,
        "displayInverseHomeAwayTeams": false,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري البطولة الإنجليزية",
            "hi": "चैंपियनशिप",
            "bn": "চ্যাম্পিয়নশিপ"
          },
          "shortNameTranslation": {}
        }
      }
    ],
    "hasPerformanceGraphFeature": true,
    "periodLength": {},
    "gender": "M",
    "id": 17,
    "country": {},
    "startDateTimestamp": 1755216000,
    "endDateTimestamp": 1779580800,
    "mostTitlesTeams": [
      {
        "name": "Manchester United",
        "slug": "manchester-united",
        "shortName": "Man Utd",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2935552,
        "nameCode": "MUN",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 35,
        "country": {
          "alpha2": "EN",
          "name": "England"
        },
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#373737",
          "text": "#373737"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "مانتشستر يونايتد",
            "ru": "Манчестер Юнайтед",
            "hi": "मेनचेस्टर यूनाइटेड ऍफ़सी"
          },
          "shortNameTranslation": {
            "ar": "مان يونايتد",
            "hi": "मैन यूनाइटेड",
            "bn": "ম্যান ইউনাইটেড"
          }
        }
      },
      {
        "name": "Liverpool",
        "slug": "liverpool",
        "shortName": "Liverpool",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3322601,
        "nameCode": "LIV",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 44,
        "country": {
          "alpha2": "EN",
          "name": "England"
        },
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ليفربول",
            "ru": "Ливерпуль",
            "hi": "लिवरपूल",
            "bn": "লিভারপুল"
          },
          "shortNameTranslation": {}
        }
      }
    ],
    "disabledHomeAwayStandings": false,
    "displayInverseHomeAwayTeams": false,
    "fieldTranslations": {
      "nameTranslation": {
        "ar": "الدوري الإنجليزي الممتاز",
        "hi": "प्रिमियर लीग",
        "bn": "প্রিমিয়ার লীগ"
      },
      "shortNameTranslation": {}
    }
  }
}

xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/tournament/1/seasons');
Example Response:
{
  "seasons": [
    {
      "name": "UEFA Champions League 24/25",
      "year": "24/25",
      "id": 61644,
      "seasonCoverageInfo": {}
    }
  ]
}

Get events by round and slug for a tournament season:
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/tournament/17/season/76986/events/round/14');
Example Response:
{
  "events": [],
  "hasNextPage": false
}
Kein Ergebnis?


Get events by round and slug for a tournament season
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/tournament/16/season/82557/events/round/1/slug/round-1');
{
  "events": [
    {
      "correctAiInsight": true,
      "correctHalftimeAiInsight": true,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "xbsUb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Luton Town",
        "slug": "luton-town",
        "shortName": "Luton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 81749,
        "nameCode": "LUT",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 72,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff3300",
          "secondary": "#000033",
          "text": "#000033"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "لوتون تاون",
            "ru": "Лутон Таун",
            "hi": "लूटन टाउन"
          },
          "shortNameTranslation": {
            "ar": "لوتون",
            "hi": "लूटन",
            "bn": "লুটন"
          }
        }
      },
      "awayTeam": {
        "name": "Forest Green Rovers",
        "slug": "forest-green-rovers",
        "shortName": "Forest Green",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 11272,
        "nameCode": "FGR",
        "national": false,
        "type": 0,
        "id": 94,
        "subTeams": [],
        "teamColors": {
          "primary": "#99ff00",
          "secondary": "#99ff00",
          "text": "#99ff00"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "فورست جرين روفر",
            "ru": "Форест Грин Роверс",
            "hi": "फारेस्ट ग्रीन रोवर्स"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 2,
        "period2": 2,
        "normaltime": 4
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 0,
        "period2": 3,
        "normaltime": 3
      },
      "time": {
        "injuryTime1": 1,
        "currentPeriodStartTimestamp": 1761942748
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1761945883
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888300,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "forest-green-rovers-luton-town",
      "startTimestamp": 1761939000,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": false,
      "correctHalftimeAiInsight": true,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "HdsiEj",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Chelmsford City",
        "slug": "chelmsford-city",
        "shortName": "Chelmsford",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2651,
        "nameCode": "CHE",
        "national": false,
        "type": 0,
        "id": 23958,
        "subTeams": [],
        "teamColors": {
          "primary": "#960000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كيلمزفورد",
            "ru": "Челмсфорд Сити"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Braintree Town",
        "slug": "braintree-town",
        "shortName": "Braintree",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2845,
        "nameCode": "BRA",
        "national": false,
        "type": 0,
        "id": 182,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff6600",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برينتري تاون",
            "ru": "Брейнтри Таун"
          },
          "shortNameTranslation": {
            "ar": "برينتري"
          }
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 3,
        "period2": 1,
        "normaltime": 4
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 6,
        "currentPeriodStartTimestamp": 1762002287
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762005393
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888316,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "chelmsford-city-braintree-town",
      "startTimestamp": 1761998400,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "hdshEj",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "AFC Wimbledon",
        "slug": "afc-wimbledon",
        "shortName": "Wimbledon",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 11258,
        "nameCode": "WIM",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 23957,
        "subTeams": [],
        "teamColors": {
          "primary": "#353a6e",
          "secondary": "#353a6e",
          "text": "#353a6e"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ويمبلدون",
            "ru": "АФК Уимблдон",
            "hi": "एऍफ़सी विम्बलडॉन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Gateshead",
        "slug": "gateshead",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 4985,
        "nameCode": "GAT",
        "national": false,
        "type": 0,
        "id": 157,
        "subTeams": [],
        "teamColors": {
          "primary": "#39596e",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "غيتسهيد",
            "ru": "Гейтсхед"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012972
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016111
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888320,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "afc-wimbledon-gateshead",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "ysyb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barnsley",
        "slug": "barnsley",
        "shortName": "Barnsley",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 14306,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 23,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff3333",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بارنسلي",
            "ru": "Барнсли"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "York City",
        "slug": "york-city",
        "shortName": "York",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 8791,
        "nameCode": "YOR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 73,
        "subTeams": [],
        "teamColors": {
          "primary": "#000099",
          "secondary": "#ff0000",
          "text": "#ff0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "يورك سيتي",
            "ru": "Йорк Сити"
          },
          "shortNameTranslation": {
            "ar": "يورك"
          }
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 2,
        "normaltime": 3
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "time": {
        "injuryTime1": 4,
        "injuryTime2": 7,
        "currentPeriodStartTimestamp": 1762272923
      },
      "changes": {
        "changes": [
          "time.injuryTime1",
          "time.injuryTime2"
        ],
        "changeTimestamp": 1762281531
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888313,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "york-city-barnsley",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "rbsKb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Blackpool",
        "slug": "blackpool",
        "shortName": "Blackpool",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 12998,
        "nameCode": "BLP",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 67,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff6600",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بلاكبوول",
            "ru": "Блэкпул"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Scunthorpe United",
        "slug": "scunthorpe-united",
        "shortName": "Scunthorpe",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 4361,
        "nameCode": "SCU",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 85,
        "subTeams": [],
        "teamColors": {
          "primary": "#66ccff",
          "secondary": "#663399",
          "text": "#663399"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سكونثورب يونايتد",
            "ru": "Сканторп Юнайтед",
            "hi": "स्कान्थोर्पे यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012879
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762015890
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888311,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "scunthorpe-united-blackpool",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "fsjb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Bolton Wanderers",
        "slug": "bolton-wanderers",
        "shortName": "Bolton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 17854,
        "nameCode": "BOL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 5,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#000033",
          "text": "#000033"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بولتون وانديريرز",
            "ru": "Болтон Уондерерс",
            "hi": "बोल्टन वंडरेर"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Huddersfield Town",
        "slug": "huddersfield-town",
        "shortName": "Huddersfield",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 16481,
        "nameCode": "HUD",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 59,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "هيديرسفيلد تاون",
            "ru": "Хаддерсфилд Таун",
            "hi": "हड्डल्सफील्ड टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012892
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762015934
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888312,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "huddersfield-town-bolton-wanderers",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "AXbsrEo",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Boreham Wood",
        "slug": "boreham-wood",
        "shortName": "Boreham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5585,
        "nameCode": "BOR",
        "national": false,
        "type": 0,
        "id": 36467,
        "subTeams": [],
        "teamColors": {
          "primary": "#edeeef",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بورهام وود",
            "ru": "Борэм Вуд"
          },
          "shortNameTranslation": {
            "ar": "بورهام"
          }
        }
      },
      "awayTeam": {
        "name": "Crawley Town",
        "slug": "crawley-town",
        "shortName": "Crawley",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 7994,
        "nameCode": "CRA",
        "national": false,
        "type": 0,
        "id": 4875,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كرولي تاون",
            "ru": "Кроули Таун",
            "hi": "क्रेव्ले टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 2,
        "period2": 1,
        "normaltime": 3
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013151
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016160
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888309,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "boreham-wood-crawley-town",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "BbsFd",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Bromley",
        "slug": "bromley",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 7473,
        "nameCode": "BRO",
        "national": false,
        "type": 0,
        "id": 180,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#ff0000",
          "text": "#ff0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بروملي",
            "ru": "ФК Бромли"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Bristol Rovers",
        "slug": "bristol-rovers",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 8532,
        "nameCode": "BR",
        "national": false,
        "type": 0,
        "id": 76,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بريستول روفيرز",
            "ru": "Бристоль Роверс",
            "hi": "ब्रिस्टल रोवर्स"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013006
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016625
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888318,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "bromley-bristol-rovers",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "JcsKc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Burton Albion",
        "slug": "burton-albion",
        "shortName": "Burton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 8830,
        "nameCode": "BUR",
        "national": false,
        "type": 0,
        "id": 134,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffff00",
          "secondary": "#ffff00",
          "text": "#ffff00"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بورتون البيون",
            "ru": "Бертон Альбион",
            "hi": "बुर्टोन एल्बिओन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "St Albans City",
        "slug": "st-albans-city",
        "shortName": "St Albans",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1792,
        "nameCode": "STA",
        "national": false,
        "type": 0,
        "id": 135,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffff33",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سن البان سيتي",
            "ru": "Ст. Олбанс Сити"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 6,
        "display": 6,
        "period1": 1,
        "period2": 5,
        "normaltime": 6
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012923
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "homeScore.period2",
          "homeScore.normaltime"
        ],
        "changeTimestamp": 1762015986
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888317,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "st-albans-city-burton-albion",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "GCospNt",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Buxton FC",
        "slug": "buxton-fc",
        "shortName": "Buxton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2336,
        "nameCode": "BUX",
        "national": false,
        "type": 0,
        "id": 36381,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بوكستو",
            "ru": "ФК Бакстон"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Chatham Town",
        "slug": "chatham-town",
        "shortName": "Chatham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1634,
        "nameCode": "CHT",
        "national": false,
        "type": 0,
        "id": 46915,
        "subTeams": [],
        "teamColors": {
          "primary": "#374df5",
          "secondary": "#374df5",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "شاثام تاون",
            "ru": "Чатем Таун"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017744
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762018838
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888319,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "chatham-town-buxton-fc",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "nbsmf",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Cambridge United",
        "slug": "cambridge-united",
        "shortName": "Cambridge",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 7493,
        "nameCode": "CAM",
        "national": false,
        "type": 0,
        "id": 63,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff9900",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كامبريدج يونايتد",
            "ru": "Кембридж Юнайтед",
            "hi": "कैंब्रिज यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Chester FC",
        "slug": "chester",
        "shortName": "Chester",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3603,
        "nameCode": "CHE",
        "national": false,
        "type": 0,
        "id": 262,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "تشستر",
            "ru": "ФК Честер"
          },
          "shortNameTranslation": {
            "ar": "تشستر"
          }
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 3,
        "period2": 0,
        "normaltime": 3
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013022
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762015905
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888321,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "chester-fc-cambridge-united",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "xsub",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Cheltenham Town",
        "slug": "cheltenham-town",
        "shortName": "Cheltenham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5917,
        "nameCode": "CHE",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 69,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#d5283c",
          "text": "#d5283c"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "شيلتنهام تاون",
            "ru": "Челтенхем Таун",
            "hi": "चेल्टेन्हेम टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Bradford City",
        "slug": "bradford-city",
        "shortName": "Bradford",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 12250,
        "nameCode": "BRA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 22,
        "subTeams": [],
        "teamColors": {
          "primary": "#660033",
          "secondary": "#ffcc00",
          "text": "#ffcc00"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برادفورد سيتي",
            "ru": "Брэдфорд Сити"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012997
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016058
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888323,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "cheltenham-town-bradford-city",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "esqb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Colchester United",
        "slug": "colchester-united",
        "shortName": "Colchester",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5028,
        "nameCode": "COL",
        "national": false,
        "type": 0,
        "id": 66,
        "subTeams": [],
        "teamColors": {
          "primary": "#0278d8",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كولشيستر يونايتد",
            "ru": "Колчестер Юнайтед",
            "hi": "कोलचेस्टर यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Milton Keynes Dons",
        "slug": "milton-keynes-dons",
        "shortName": "MK Dons",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6715,
        "nameCode": "MKD",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 4,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#ff0000",
          "text": "#ff0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ميلتون كينز دونز",
            "ru": "Милтон Кинс Донс",
            "hi": "मिल्टन कीन्स डोंस"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 2,
        "normaltime": 3
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012984
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016061
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888324,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "colchester-united-milton-keynes-dons",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "usJb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Crewe Alexandra",
        "slug": "crewe-alexandra",
        "shortName": "Crewe",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 7180,
        "nameCode": "CRA",
        "national": false,
        "type": 0,
        "id": 19,
        "subTeams": [],
        "teamColors": {
          "primary": "#ba0b12",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كرو الكسندرا",
            "ru": "Крю Александра",
            "hi": "क्रेवे एलेक्सांद्रा"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Doncaster Rovers",
        "slug": "doncaster-rovers",
        "shortName": "Doncaster",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 11045,
        "nameCode": "DR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 84,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#ff0000",
          "text": "#ff0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دنكاستر روفرز",
            "ru": "Донкастер Роверс",
            "hi": "डॉनकास्टर रोवर्स"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013009
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016116
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888325,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "doncaster-rovers-crewe-alexandra",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "LbsMb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "FC Halifax Town",
        "slug": "fc-halifax-town",
        "shortName": "Halifax",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 4057,
        "nameCode": "HAL",
        "national": false,
        "type": 0,
        "id": 87,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "هاليفاكس تون",
            "ru": "Галифакс Таун",
            "hi": "ऍफ़सी हैलिफैक्स टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Exeter City",
        "slug": "exeter-city",
        "shortName": "Exeter",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 10030,
        "nameCode": "EXC",
        "national": false,
        "type": 0,
        "id": 86,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#e92553",
          "text": "#e92553"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "إكسترستي",
            "ru": "Эксетер Сити",
            "hi": "एक्सेटर सिटी"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 2,
        "period2": 0,
        "normaltime": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013302
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016197
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888327,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "fc-halifax-town-exeter-city",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "CbsjEj",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Fleetwood Town",
        "slug": "fleetwood-town",
        "shortName": "Fleetwood",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 7002,
        "nameCode": "FLE",
        "national": false,
        "type": 0,
        "id": 23959,
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#cc0000",
          "text": "#cc0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "فليتوود تاون",
            "ru": "Флитвуд Таун",
            "hi": "फ्लीटवुड टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barnet",
        "slug": "barnet",
        "shortName": "Barnet",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 9898,
        "nameCode": "BAR",
        "national": false,
        "type": 0,
        "id": 77,
        "subTeams": [],
        "teamColors": {
          "primary": "#f07d04",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بارنيت",
            "ru": "ФК Барнет"
          },
          "shortNameTranslation": {
            "ar": "بارنيت"
          }
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013198
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016219
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888329,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "fleetwood-town-barnet",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "tsoc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Grimsby Town",
        "slug": "grimsby-town",
        "shortName": "Grimsby",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 16763,
        "nameCode": "GRI",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 18,
        "subTeams": [],
        "teamColors": {
          "primary": "#000000",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "جرمسبي تاون",
            "ru": "Гримсби Таун",
            "hi": "ग्रिम्सबी टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Ebbsfleet United",
        "slug": "ebbsfleet-united",
        "shortName": "Ebbsfleet",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2378,
        "nameCode": "EBB",
        "national": false,
        "type": 0,
        "id": 114,
        "subTeams": [],
        "teamColors": {
          "primary": "#e30f10",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "إيبسفليت يونايتد",
            "ru": "Эббсфлит Юнайтед"
          },
          "shortNameTranslation": {
            "ar": "إيبسفليت"
          }
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 0,
        "period2": 3,
        "normaltime": 3
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013290
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016351
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888331,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "ebbsfleet-united-grimsby-town",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "JtksgfEd",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Macclesfield FC",
        "slug": "macclesfield-fc",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3004,
        "nameCode": "MAC",
        "national": false,
        "type": 0,
        "id": 447756,
        "subTeams": [],
        "teamColors": {
          "primary": "#001b5e",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ماكلسفيلد إف سي"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "AFC Totton",
        "slug": "totton",
        "shortName": "Totton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2231,
        "nameCode": "TOT",
        "national": false,
        "type": 0,
        "id": 25934,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#ffff00",
          "text": "#ffff00"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "إيه إف سي توتون",
            "ru": "АФК Тоттон"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 6,
        "display": 6,
        "period1": 3,
        "period2": 3,
        "normaltime": 6
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 3,
        "period2": 0,
        "normaltime": 3
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013366
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016315
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888296,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "macclesfield-fc-afc-totton",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "vbsjd",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Mansfield Town",
        "slug": "mansfield-town",
        "shortName": "Mansfield",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 9170,
        "nameCode": "MAT",
        "national": false,
        "type": 0,
        "id": 70,
        "subTeams": [],
        "teamColors": {
          "primary": "#f3ba2b",
          "secondary": "#1d56db",
          "text": "#1d56db"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "مانسفيلد تاون",
            "ru": "Мансфилд Таун",
            "hi": "मेन्सफील्ड टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Harrogate Town",
        "slug": "harrogate-town",
        "shortName": "Harrogate",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5194,
        "nameCode": "HTO",
        "national": false,
        "type": 0,
        "id": 159,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffff00",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "هاروجيت تاون",
            "ru": "Харрогейт Таун",
            "hi": "हेर्रोगेट टाउन"
          },
          "shortNameTranslation": {
            "ar": "هاروجيت"
          }
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 2,
        "normaltime": 3
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013198
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016234
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888299,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "harrogate-town-mansfield-town",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "vsEb",
      "status": {
        "code": 120,
        "description": "AP",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Newport County",
        "slug": "newport-county",
        "shortName": "Newport",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 7180,
        "nameCode": "NC",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 79,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffc709",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "نيو بورت كاونتي",
            "ru": "Ньюпорт Каунти",
            "hi": "न्यूपोर्ट काउंटी"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Gillingham",
        "slug": "gillingham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6244,
        "nameCode": "GIL",
        "national": false,
        "type": 0,
        "id": 20,
        "subTeams": [],
        "teamColors": {
          "primary": "#0033ff",
          "secondary": "#0033ff",
          "text": "#0033ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "غيلينغهام",
            "ru": "ФК Джиллингем"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 6,
        "display": 2,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1,
        "penalties": 4
      },
      "awayScore": {
        "current": 5,
        "display": 2,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1,
        "penalties": 3
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017808
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "homeScore.display",
          "homeScore.penalties",
          "awayScore.display",
          "awayScore.penalties"
        ],
        "changeTimestamp": 1762019788
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888314,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "newport-county-gillingham",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "hbspb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Oldham Athletic",
        "slug": "oldham-athletic",
        "shortName": "Oldham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5595,
        "nameCode": "OLD",
        "national": false,
        "type": 0,
        "id": 65,
        "subTeams": [],
        "teamColors": {
          "primary": "#2869b2",
          "secondary": "#f2f2f1",
          "text": "#f2f2f1"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "أولدهام اتلتيك",
            "ru": "Олдхэм Атлетик",
            "hi": "ओल्डहैम एथलेटिक"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Northampton Town",
        "slug": "northampton-town",
        "shortName": "Northampton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6415,
        "nameCode": "NOR",
        "national": false,
        "type": 0,
        "id": 57,
        "subTeams": [],
        "teamColors": {
          "primary": "#890000",
          "secondary": "#890000",
          "text": "#890000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "نورثهامبتون تاون",
            "ru": "Нортхэмптон Таун",
            "hi": "नार्थहैम्प्टन टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 2,
        "period2": 1,
        "normaltime": 3
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012934
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016253
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888303,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "oldham-athletic-northampton-town",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "ebslb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Peterborough United",
        "slug": "peterborough-united",
        "shortName": "Peterborough Utd",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 12386,
        "nameCode": "PET",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 54,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000cc",
          "secondary": "#0000cc",
          "text": "#0000cc"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بيتربورو يونايتد",
            "ru": "Питерборо Юнайтед",
            "hi": "पीटरब्रौह यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Cardiff City",
        "slug": "cardiff-city",
        "shortName": "Cardiff",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 26865,
        "nameCode": "CAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 61,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000eb",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كاردف ستي",
            "ru": "Кардифф Сити",
            "hi": "कार्डिफ सिटी"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012988
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016116
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 4,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888307,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "cardiff-city-peterborough-united",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "DsDb",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Reading",
        "slug": "reading",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 13065,
        "nameCode": "REA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 28,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#003399",
          "text": "#003399"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ردنغ",
            "ru": "Рединг"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Carlisle United",
        "slug": "carlisle-united",
        "shortName": "Carlisle",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6551,
        "nameCode": "CAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 78,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كارلايل",
            "ru": "Карлайл Юнайтед",
            "hi": "कार्लाइल यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 0,
        "period2": 2,
        "normaltime": 2,
        "extra1": 1,
        "extra2": 0,
        "overtime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017683
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762018725
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888294,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "carlisle-united-reading",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "nsdb",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Rotherham United",
        "slug": "rotherham-united",
        "shortName": "Rotherham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 9352,
        "nameCode": "ROU",
        "national": false,
        "type": 0,
        "id": 13,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "روثيرهام يونايتد",
            "ru": "Ротерхэм Юнайтед",
            "hi": "रोथेरहैम यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Swindon Town",
        "slug": "swindon-town",
        "shortName": "Swindon",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6737,
        "nameCode": "SWI",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 53,
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سويندون تاون",
            "ru": "Суиндон Таун",
            "hi": "स्विन्ड़न टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017624
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762018571
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888293,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "swindon-town-rotherham-united",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "RbsYjp",
      "status": {
        "code": 120,
        "description": "AP",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Salford City",
        "slug": "salford-city",
        "shortName": "Salford",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 11402,
        "nameCode": "SAL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 37998,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff1300",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سالفورد سيتي",
            "ru": "Салфорд Сити",
            "hi": "सेलफोर्ड सिटी"
          },
          "shortNameTranslation": {
            "ar": "سالفورد"
          }
        }
      },
      "awayTeam": {
        "name": "Lincoln City",
        "slug": "lincoln-city",
        "shortName": "Lincoln",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 12942,
        "nameCode": "LIC",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 92,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "لينكولن سيتي",
            "ru": "Линкольн Сити",
            "hi": "लिंकोल्न सिटी"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 5,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 4
      },
      "awayScore": {
        "current": 3,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017673
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "homeScore.display",
          "homeScore.penalties",
          "awayScore.display",
          "awayScore.penalties"
        ],
        "changeTimestamp": 1762019311
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888295,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "salford-city-lincoln-city",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "kcsYd",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Slough Town",
        "slug": "slough-town",
        "shortName": "Slough",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1694,
        "nameCode": "SLO",
        "national": false,
        "type": 0,
        "id": 198,
        "subTeams": [],
        "teamColors": {
          "primary": "#f2bf41",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سلاخ تاون",
            "ru": "Слау Таун",
            "hi": "Slough Town FC"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Altrincham FC",
        "slug": "altrincham",
        "shortName": "Altrincham",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3408,
        "nameCode": "ALT",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 110,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ألتريتشام",
            "ru": "Олтрингем",
            "hi": "एल्त्रिनचाम"
          },
          "shortNameTranslation": {
            "ar": "ألتريتشام"
          }
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 2,
        "period2": 0,
        "normaltime": 2
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013133
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016450
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888315,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "slough-town-altrincham-fc",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "Xbswd",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Spennymoor Town",
        "slug": "spennymoor-town",
        "shortName": "Spennymoor",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1537,
        "nameCode": "SPE",
        "national": false,
        "type": 0,
        "id": 171,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سبينينغمور تاون",
            "ru": "Спеннимур Таун"
          },
          "shortNameTranslation": {
            "ar": "سبينينغمور"
          }
        }
      },
      "awayTeam": {
        "name": "Barrow AFC",
        "slug": "barrow",
        "shortName": "Barrow",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6531,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 97,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#000081",
          "text": "#000081"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بارو",
            "ru": "Барроу",
            "hi": "बार्रो एएफसी"
          },
          "shortNameTranslation": {
            "ar": "بارو"
          }
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013080
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762015989
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888291,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "spennymoor-town-barrow-afc",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "tbsIc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Stevenage",
        "slug": "stevenage",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 9348,
        "nameCode": "STE",
        "national": false,
        "type": 0,
        "id": 133,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#cc0000",
          "text": "#cc0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ستيفيناج",
            "ru": "Стивенэйдж"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Chesterfield",
        "slug": "chesterfield",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 9120,
        "nameCode": "CHE",
        "national": false,
        "type": 0,
        "id": 68,
        "subTeams": [],
        "teamColors": {
          "primary": "#083d9b",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "تشيسترفيلد",
            "ru": "ФК Честерфилд"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012912
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762015986
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888306,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "stevenage-chesterfield",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "FcsOBc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Sutton United",
        "slug": "sutton-united",
        "shortName": "Sutton",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 4910,
        "nameCode": "SUT",
        "national": false,
        "type": 0,
        "id": 6339,
        "subTeams": [],
        "teamColors": {
          "primary": "#fcf042",
          "secondary": "#fcf042",
          "text": "#fcf042"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ساتون يونايتد",
            "ru": "Саттон Юнайтед",
            "hi": "सुट्टोन यूनाइटेड"
          },
          "shortNameTranslation": {
            "ar": "ساتون"
          }
        }
      },
      "awayTeam": {
        "name": "Telford United",
        "slug": "telford-united",
        "shortName": "Telford",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1521,
        "nameCode": "TEL",
        "national": false,
        "type": 0,
        "id": 130,
        "subTeams": [],
        "teamColors": {
          "primary": "#13294b",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "تيلفورد يونايتد",
            "ru": "Телфорд Юнайтед"
          },
          "shortNameTranslation": {
            "ar": "تيلفورد"
          }
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013119
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016095
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888292,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "sutton-united-telford-united",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "Ibscc",
      "status": {
        "code": 60,
        "description": "Postponed",
        "type": "postponed"
      },
      "homeTeam": {
        "name": "Tamworth",
        "slug": "tamworth",
        "shortName": "Tamworth",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5089,
        "nameCode": "TAM",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 102,
        "subTeams": [],
        "teamColors": {
          "primary": "#be1414",
          "secondary": "#f6d562",
          "text": "#f6d562"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "تامورث",
            "ru": "ФК Тамворт"
          },
          "shortNameTranslation": {
            "ar": "تامورث"
          }
        }
      },
      "awayTeam": {
        "name": "Leyton Orient",
        "slug": "leyton-orient",
        "shortName": "Leyton Orient",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 14143,
        "nameCode": "LEY",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 83,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ليتون أوريانت",
            "ru": "Лейтон Ориент"
          },
          "shortNameTranslation": {
            "ar": "ليتون أوريانت"
          }
        }
      },
      "homeScore": {},
      "awayScore": {},
      "time": {},
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1760806399
      },
      "hasGlobalHighlights": false,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888297,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "tamworth-leyton-orient",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "ksbb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Tranmere Rovers",
        "slug": "tranmere-rovers",
        "shortName": "Tranmere",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5253,
        "nameCode": "TRA",
        "national": false,
        "type": 0,
        "id": 51,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ترانمير روفرز",
            "ru": "Транмир Роверс"
          },
          "shortNameTranslation": {
            "ar": "ترانمير"
          }
        }
      },
      "awayTeam": {
        "name": "Stockport County",
        "slug": "stockport-county",
        "shortName": "Stockport County",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 13486,
        "nameCode": "STO",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 10,
        "subTeams": [],
        "teamColors": {
          "primary": "#7e7e7e",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ستوكبورت كاونتي",
            "ru": "ФК Стокпорт Каунти"
          },
          "shortNameTranslation": {
            "ar": "ستوكبورت"
          }
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 0,
        "period2": 3,
        "normaltime": 3
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012995
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016073
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888301,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "tranmere-rovers-stockport-county",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "ZbsNe",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Wealdstone",
        "slug": "wealdstone",
        "shortName": "Wealdstone",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3152,
        "nameCode": "WEA",
        "national": false,
        "type": 0,
        "id": 238,
        "subTeams": [],
        "teamColors": {
          "primary": "#2b6bb4",
          "secondary": "#cf362e",
          "text": "#cf362e"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ويالدستون",
            "ru": "Уэлдстон"
          },
          "shortNameTranslation": {
            "ar": "ويالدستون"
          }
        }
      },
      "awayTeam": {
        "name": "Southend United",
        "slug": "southend-united",
        "shortName": "Southend",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5258,
        "nameCode": "SOU",
        "national": false,
        "type": 0,
        "id": 99,
        "subTeams": [],
        "teamColors": {
          "primary": "#006699",
          "secondary": "#f1c327",
          "text": "#f1c327"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ساوثيند يونايتد",
            "ru": "Саутенд Юнайтед",
            "hi": "साउथएंड यूनाइटेड"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762013200
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016206
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888304,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "wealdstone-southend-united",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "AbsQBc",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Weston Super Mare",
        "slug": "weston-super-mare",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2162,
        "nameCode": "WSM",
        "national": false,
        "type": 0,
        "id": 6341,
        "subTeams": [],
        "teamColors": {
          "primary": "#000000",
          "secondary": "#997f4e",
          "text": "#997f4e"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ويستون سوبر مار",
            "ru": "ФК Уэстон-сьюпер-Мэр"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Aldershot Town",
        "slug": "aldershot-town",
        "shortName": "Aldershot",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3804,
        "nameCode": "ALD",
        "national": false,
        "type": 0,
        "id": 75,
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ألديرشوت تاون",
            "ru": "ФК Олдершот Таун"
          },
          "shortNameTranslation": {
            "ar": "ألديرشوت"
          }
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017861
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762019020
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888305,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "weston-super-mare-aldershot-town",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "ZsVPt",
      "status": {
        "code": 120,
        "description": "AP",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Wigan Athletic",
        "slug": "wigan-athletic",
        "shortName": "Wigan",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 12525,
        "nameCode": "WIG",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 49,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ويجان اثليتيك",
            "ru": "Уиган Атлетик",
            "hi": "विगन एथलेटिक"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Hemel Hempstead",
        "slug": "hemel-hempstead",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1826,
        "nameCode": "HHT",
        "national": false,
        "type": 0,
        "id": 47045,
        "subTeams": [],
        "teamColors": {
          "primary": "#008000",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "هيميل هيمبستيد",
            "ru": "Хемел Хэмпстед"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 6,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 5
      },
      "awayScore": {
        "current": 4,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 3
      },
      "time": {
        "currentPeriodStartTimestamp": 1762017527
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "homeScore.display",
          "homeScore.penalties",
          "awayScore.display",
          "awayScore.penalties"
        ],
        "changeTimestamp": 1762019191
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888308,
      "homeRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "hemel-hempstead-wigan-athletic",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "mbswb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Wycombe Wanderers",
        "slug": "wycombe-wanderers",
        "shortName": "Wycombe",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 17273,
        "nameCode": "WYW",
        "national": false,
        "type": 0,
        "id": 62,
        "subTeams": [],
        "teamColors": {
          "primary": "#0099ff",
          "secondary": "#000099",
          "text": "#000099"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ويكمب وندررز",
            "ru": "Уикомб Уондерерс",
            "hi": "व्य्कोम्बे वंडरेर"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Plymouth Argyle",
        "slug": "plymouth-argyle",
        "shortName": "Plymouth",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 25258,
        "nameCode": "PA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 71,
        "subTeams": [],
        "teamColors": {
          "primary": "#339900",
          "secondary": "#339900",
          "text": "#339900"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بليموث ارجايل",
            "ru": "Плимут Аргайл",
            "hi": "प्लाईमौत आर्गाइल"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "currentPeriodStartTimestamp": 1762012966
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762016188
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": false,
      "detailId": 3,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888332,
      "homeRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "plymouth-argyle-wycombe-wanderers",
      "startTimestamp": 1762009200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": false,
      "correctHalftimeAiInsight": false,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "gbsKtk",
      "status": {
        "code": 120,
        "description": "AP",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Brackley Town",
        "slug": "brackley-town",
        "shortName": "Brackley",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3165,
        "nameCode": "BRA",
        "national": false,
        "type": 0,
        "id": 25935,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "براكلي تاون",
            "ru": "ФК Брэкли Таун"
          },
          "shortNameTranslation": {
            "ar": "براكلي"
          }
        }
      },
      "awayTeam": {
        "name": "Notts County",
        "slug": "notts-county",
        "shortName": "Notts County",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 12339,
        "nameCode": "NOC",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 56,
        "subTeams": [],
        "teamColors": {
          "primary": "#84754e",
          "secondary": "#222226",
          "text": "#222226"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "نوتس كاونتي",
            "ru": "Ноттс Каунти",
            "hi": "नोट्ट्स काउंटी"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 6,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 4
      },
      "awayScore": {
        "current": 5,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 3
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 6,
        "injuryTime3": 0,
        "injuryTime4": 0,
        "currentPeriodStartTimestamp": 1762026656
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "homeScore.display",
          "homeScore.penalties",
          "awayScore.display",
          "awayScore.penalties"
        ],
        "changeTimestamp": 1762028316
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888310,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "brackley-town-notts-county",
      "startTimestamp": 1762018200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": false,
      "correctHalftimeAiInsight": true,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "HbsxRfc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "South Shields",
        "slug": "south-shields",
        "shortName": "South Shields",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 2933,
        "nameCode": "SOS",
        "national": false,
        "type": 0,
        "id": 264622,
        "subTeams": [],
        "teamColors": {
          "primary": "#970045",
          "secondary": "#82caff",
          "text": "#82caff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ساوث شيلدز",
            "ru": "Саут Шилдс"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Shrewsbury Town",
        "slug": "shrewsbury-town",
        "shortName": "Shrewsbury",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5568,
        "nameCode": "SHR",
        "national": false,
        "type": 0,
        "id": 82,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#ffff00",
          "text": "#ffff00"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "شوروسبري تاون",
            "ru": "Шрусбери Таун",
            "hi": "श्रेव्स्बेरी टाउन"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 3,
        "period2": 0,
        "normaltime": 3
      },
      "time": {
        "injuryTime1": 4,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1762088804
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762091824
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888302,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "south-shields-shrewsbury-town",
      "startTimestamp": 1762084800,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": true,
      "correctHalftimeAiInsight": false,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "BsQyc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Eastleigh",
        "slug": "eastleigh",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 3493,
        "nameCode": "EFC",
        "national": false,
        "type": 0,
        "id": 6191,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#0000ff",
          "text": "#0000ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "Eastleigh",
            "ru": "ФК Истли"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Walsall",
        "slug": "walsall",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 11303,
        "nameCode": "WAl",
        "national": false,
        "type": 0,
        "id": 26,
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#cc0000",
          "text": "#cc0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "والسول",
            "ru": "ФК Уолсолл"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 2,
        "normaltime": 3
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1762096743
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762099706
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888326,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "eastleigh-walsall",
      "startTimestamp": 1762092900,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": true,
      "correctHalftimeAiInsight": true,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "fbsfRt",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Port Vale",
        "slug": "port-vale",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 11802,
        "nameCode": "PVA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 55,
        "subTeams": [],
        "teamColors": {
          "primary": "#e1dce3",
          "secondary": "#e4bf3a",
          "text": "#e4bf3a"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بورت فايل",
            "ru": "Порт Вэйл",
            "hi": "पोर्ट वेल"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Maldon & Tiptree FC",
        "slug": "maldon-tiptree-fc",
        "shortName": "Maldon & Tiptree",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 424,
        "nameCode": "MT",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 47105,
        "subTeams": [],
        "teamColors": {
          "primary": "#0000ff",
          "secondary": "#b22222",
          "text": "#b22222"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "مالدون & تيبتري إف سي",
            "ru": "ФК Малдон энд Типтри"
          },
          "shortNameTranslation": {
            "ar": "مالدون & تيبتري"
          }
        }
      },
      "homeScore": {
        "current": 5,
        "display": 5,
        "period1": 4,
        "period2": 1,
        "normaltime": 5
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 7,
        "currentPeriodStartTimestamp": 1762099384
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762102718
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888298,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "maldon-and-tiptree-fc-port-vale",
      "startTimestamp": 1762095600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": false,
      "correctHalftimeAiInsight": false,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "MdsJBc",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Gainsborough Trinity",
        "slug": "gainsborough-trinity",
        "shortName": "Gainsborough",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1282,
        "nameCode": "GAI",
        "national": false,
        "type": 0,
        "id": 6334,
        "subTeams": [],
        "teamColors": {
          "primary": "#345b8d",
          "secondary": "#ffe600",
          "text": "#ffe600"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "جينزبورو ترينتي",
            "ru": "Гейнсборо Тринити"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Accrington Stanley",
        "slug": "accrington-stanley",
        "shortName": "Accrington",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6555,
        "nameCode": "ACS",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 187,
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#ff0000",
          "text": "#ff0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "اكرينجتون ستانلي",
            "ru": "Аккрингтон Стэнли",
            "hi": "एक्क्रिन्टोन स्टैनले"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "extra1": 1,
        "extra2": 0,
        "overtime": 1
      },
      "time": {
        "injuryTime1": 1,
        "injuryTime2": 5,
        "injuryTime3": 1,
        "injuryTime4": 0,
        "currentPeriodStartTimestamp": 1762111975
      },
      "changes": {
        "changes": [
          "time.injuryTime4",
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762112950
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14888330,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "gainsborough-trinity-accrington-stanley",
      "startTimestamp": 1762103700,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": true,
      "correctHalftimeAiInsight": true,
      "tournament": {
        "name": "FA Cup",
        "slug": "fa-cup",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "alpha2": "EN",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إنجلترا",
              "hi": "इंग्लैंड",
              "bn": "ইংল্যান্ড"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "FA Cup",
          "slug": "fa-cup",
          "primaryColorHex": "#bc1821",
          "secondaryColorHex": "#e60411",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "alpha2": "EN",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إنجلترا",
                "hi": "इंग्लैंड",
                "bn": "ইংল্যান্ড"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 181932,
          "hasPerformanceGraphFeature": false,
          "id": 19,
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس الاتحاد الإنجليزي",
              "hi": "एफए कप",
              "bn": "এফএ কাপ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 485,
        "isGroup": false,
        "isLive": false,
        "id": 16,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس الاتحاد الإنجليزي",
            "hi": "एफए कप",
            "bn": "এফএ কাপ"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "FA Cup 25/26",
        "year": "25/26",
        "editor": false,
        "id": 82557
      },
      "roundInfo": {
        "round": 1,
        "name": "Round 1",
        "slug": "round-1"
      },
      "customId": "Ibscc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Tamworth",
        "slug": "tamworth",
        "shortName": "Tamworth",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5089,
        "nameCode": "TAM",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 102,
        "subTeams": [],
        "teamColors": {
          "primary": "#be1414",
          "secondary": "#f6d562",
          "text": "#f6d562"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "تامورث",
            "ru": "ФК Тамворт"
          },
          "shortNameTranslation": {
            "ar": "تامورث"
          }
        }
      },
      "awayTeam": {
        "name": "Leyton Orient",
        "slug": "leyton-orient",
        "shortName": "Leyton Orient",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 14143,
        "nameCode": "LEY",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 83,
        "subTeams": [],
        "teamColors": {
          "primary": "#ff0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ليتون أوريانت",
            "ru": "Лейтон Ориент"
          },
          "shortNameTranslation": {
            "ar": "ليتون أوريانت"
          }
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 5,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1762202229
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1762205301
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 14910471,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "tamworth-leyton-orient",
      "startTimestamp": 1762198200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    }
  ],
  "hasNextPage": false
}

xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/tournament/16/season/82557/events/round/1/%7Bspan%7D/%7Bpage%7D');

xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/tournament/16/season/82557/events/round/1');
Example Request:
{
  "events": [],
  "hasNextPage": false
}
Leider wieder leer. Ich denke, keine passenden Events weil keine passenden Parameter.


Get event lineups and team formations (hörts sich perfekt für uns an)
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/event/14566662/lineups');
Example response:
{
  "confirmed": true,
  "home": {
    "players": [
      {
        "avgRating": 0,
        "player": {
          "name": "",
          "firstName": "",
          "lastName": "",
          "slug": "",
          "shortName": "",
          "position": "",
          "marketValue": 0,
          "userCount": 0,
          "id": 0,
          "marketValueCurrency": "",
          "dateOfBirthTimestamp": 0,
          "cricketPlayerInfo": ""
        },
        "shirtNumber": 0,
        "jerseyNumber": "",
        "position": "",
        "substitute": true,
        "captain": true,
        "inPlay": true,
        "statistics": {}
      }
    ],
    "formation": "",
    "playerColor": {
      "primary": "",
      "secondary": "",
      "text": "",
      "number": "",
      "outline": "",
      "fancyNumber": ""
    },
    "goalkeeperColor": {
      "primary": "",
      "secondary": "",
      "text": "",
      "number": "",
      "outline": "",
      "fancyNumber": ""
    },
    "missingPlayers": [
      {
        "player": {
          "name": "",
          "firstName": "",
          "lastName": "",
          "slug": "",
          "shortName": "",
          "position": "",
          "marketValue": 0,
          "userCount": 0,
          "id": 0,
          "marketValueCurrency": "",
          "dateOfBirthTimestamp": 0,
          "cricketPlayerInfo": ""
        },
        "type": "missing",
        "reason": 1
      }
    ]
  },
  "away": {
    "players": [
      {
        "avgRating": 0,
        "player": {
          "name": "",
          "firstName": "",
          "lastName": "",
          "slug": "",
          "shortName": "",
          "position": "",
          "marketValue": 0,
          "userCount": 0,
          "id": 0,
          "marketValueCurrency": "",
          "dateOfBirthTimestamp": 0,
          "cricketPlayerInfo": ""
        },
        "shirtNumber": 0,
        "jerseyNumber": "",
        "position": "",
        "substitute": true,
        "captain": true,
        "inPlay": true,
        "statistics": {}
      }
    ],
    "formation": "",
    "playerColor": {
      "primary": "",
      "secondary": "",
      "text": "",
      "number": "",
      "outline": "",
      "fancyNumber": ""
    },
    "goalkeeperColor": {
      "primary": "",
      "secondary": "",
      "text": "",
      "number": "",
      "outline": "",
      "fancyNumber": ""
    },
    "missingPlayers": [
      {
        "player": {
          "name": "",
          "firstName": "",
          "lastName": "",
          "slug": "",
          "shortName": "",
          "position": "",
          "marketValue": 0,
          "userCount": 0,
          "id": 0,
          "marketValueCurrency": "",
          "dateOfBirthTimestamp": 0,
          "cricketPlayerInfo": ""
        },
        "type": "missing",
        "reason": 1
      }
    ]
  }
}

xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/event/14566662');
Example response:
{
  "event": {
    "tournament": {
      "name": "Premier League",
      "slug": "premier-league",
      "category": {
        "name": "England",
        "slug": "england",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "id": 1,
        "flag": "england",
        "country": {
          "alpha2": "UK",
          "alpha3": "UK",
          "name": "England",
          "slug": "England"
        }
      },
      "uniqueTournament": {
        "name": "Premier League",
        "slug": "premier-league",
        "primaryColorHex": "#3c1c5a",
        "secondaryColorHex": "#f80158",
        "userCount": 1250229,
        "id": 17,
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "country": {
            "alpha2": "UK",
            "alpha3": "UK",
            "name": "England",
            "slug": "England"
          }
        }
      }
    },
    "season": {
      "name": "UEFA Champions League 24/25",
      "year": "24/25",
      "id": 61644,
      "seasonCoverageInfo": {}
    },
    "status": {
      "code": 100,
      "description": "Ended",
      "type": "finished"
    },
    "homeTeam": {
      "id": 44,
      "name": "Liverpool",
      "slug": "liverpool",
      "shortName": "Liverpool",
      "gender": "M",
      "sport": {
        "name": "Football",
        "slug": "football",
        "id": 1
      },
      "tournament": {
        "name": "Premier League",
        "slug": "premier-league",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "country": {
            "alpha2": "UK",
            "alpha3": "UK",
            "name": "England",
            "slug": "England"
          }
        },
        "uniqueTournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "primaryColorHex": "#3c1c5a",
          "secondaryColorHex": "#f80158",
          "userCount": 1250229,
          "id": 17,
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          }
        }
      },
      "teamColors": {
        "primary": "#cc0000",
        "secondary": "#ffffff",
        "text": "#ffffff"
      }
    },
    "awayTeam": {
      "id": 44,
      "name": "Liverpool",
      "slug": "liverpool",
      "shortName": "Liverpool",
      "gender": "M",
      "sport": {
        "name": "Football",
        "slug": "football",
        "id": 1
      },
      "tournament": {
        "name": "Premier League",
        "slug": "premier-league",
        "category": {
          "name": "England",
          "slug": "england",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1,
          "flag": "england",
          "country": {
            "alpha2": "UK",
            "alpha3": "UK",
            "name": "England",
            "slug": "England"
          }
        },
        "uniqueTournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "primaryColorHex": "#3c1c5a",
          "secondaryColorHex": "#f80158",
          "userCount": 1250229,
          "id": 17,
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          }
        }
      },
      "teamColors": {
        "primary": "#cc0000",
        "secondary": "#ffffff",
        "text": "#ffffff"
      }
    },
    "homeScore": {
      "current": 2,
      "period1": 0,
      "period2": 2
    },
    "awayScore": {
      "current": 0,
      "period1": 0,
      "period2": 0
    },
    "startTimestamp": 1732737600,
    "slug": "real-madrid-liverpool",
    "id": 12764328
  }
}

Odds:
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/odds/provider/1/logo');
Get recommended prematch odds by provider: (könnte etwas viel sein...)
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/odds/1/recommended-prematch/tournament/36');
{
  "odds": [
    {
      "event": {
        "tournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          },
          "uniqueTournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "primaryColorHex": "#3c1c5a",
            "secondaryColorHex": "#f80158",
            "userCount": 1250229,
            "id": 17,
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            }
          }
        },
        "season": {
          "name": "UEFA Champions League 24/25",
          "year": "24/25",
          "id": 61644,
          "seasonCoverageInfo": {}
        },
        "status": {
          "code": 100,
          "description": "Ended",
          "type": "finished"
        },
        "homeTeam": {
          "id": 44,
          "name": "Liverpool",
          "slug": "liverpool",
          "shortName": "Liverpool",
          "gender": "M",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "tournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            },
            "uniqueTournament": {
              "name": "Premier League",
              "slug": "premier-league",
              "primaryColorHex": "#3c1c5a",
              "secondaryColorHex": "#f80158",
              "userCount": 1250229,
              "id": 17,
              "category": {
                "name": "England",
                "slug": "england",
                "sport": {
                  "name": "Football",
                  "slug": "football",
                  "id": 1
                },
                "id": 1,
                "flag": "england",
                "country": {
                  "alpha2": "UK",
                  "alpha3": "UK",
                  "name": "England",
                  "slug": "England"
                }
              }
            }
          },
          "teamColors": {
            "primary": "#cc0000",
            "secondary": "#ffffff",
            "text": "#ffffff"
          }
        },
        "awayTeam": {
          "id": 44,
          "name": "Liverpool",
          "slug": "liverpool",
          "shortName": "Liverpool",
          "gender": "M",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "tournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            },
            "uniqueTournament": {
              "name": "Premier League",
              "slug": "premier-league",
              "primaryColorHex": "#3c1c5a",
              "secondaryColorHex": "#f80158",
              "userCount": 1250229,
              "id": 17,
              "category": {
                "name": "England",
                "slug": "england",
                "sport": {
                  "name": "Football",
                  "slug": "football",
                  "id": 1
                },
                "id": 1,
                "flag": "england",
                "country": {
                  "alpha2": "UK",
                  "alpha3": "UK",
                  "name": "England",
                  "slug": "England"
                }
              }
            }
          },
          "teamColors": {
            "primary": "#cc0000",
            "secondary": "#ffffff",
            "text": "#ffffff"
          }
        },
        "homeScore": {
          "current": 2,
          "period1": 0,
          "period2": 2
        },
        "awayScore": {
          "current": 0,
          "period1": 0,
          "period2": 0
        },
        "startTimestamp": 1732737600,
        "slug": "real-madrid-liverpool",
        "id": 12764328
      },
      "sourceId": 0,
      "structureType": 0,
      "marketId": 0,
      "marketName": "",
      "choiceGroup": "",
      "isLive": true,
      "fid": 0,
      "suspended": true,
      "id": 0,
      "choices": [
        {
          "initialFractionalValue": "",
          "fractionalValue": "",
          "sourceId": 0,
          "name": "",
          "winning": true,
          "slipContent": "",
          "change": 0
        }
      ]
    }
  ]
}

Get all betting odds for a specific event (Bingo!)
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/event/14566745/odds/1/all');
Example response:
{
  "markets": [
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 1,
      "marketName": "Full time",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 128950978,
      "marketGroup": "1X2",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "6/1",
          "fractionalValue": "9/2",
          "sourceId": 1874382183,
          "name": "1",
          "winning": false,
          "change": -1
        },
        {
          "initialFractionalValue": "4/1",
          "fractionalValue": "4/1",
          "sourceId": 1874382189,
          "name": "X",
          "winning": true,
          "change": 0
        },
        {
          "initialFractionalValue": "2/5",
          "fractionalValue": "1/2",
          "sourceId": 1874382191,
          "name": "2",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 2,
      "marketName": "Double chance",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109494,
      "marketGroup": "Double chance",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "11/8",
          "fractionalValue": "6/4",
          "sourceId": 1927686311,
          "name": "1X",
          "winning": true,
          "change": 1
        },
        {
          "initialFractionalValue": "1/6",
          "fractionalValue": "1/7",
          "sourceId": 1927686302,
          "name": "X2",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "1/6",
          "fractionalValue": "1/6",
          "sourceId": 1927686304,
          "name": "12",
          "winning": false,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 3,
      "marketName": "1st half",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109495,
      "marketGroup": "1X2",
      "marketPeriod": "1st half",
      "choices": [
        {
          "initialFractionalValue": "4/1",
          "fractionalValue": "15/4",
          "sourceId": 1927685343,
          "name": "1",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "15/8",
          "fractionalValue": "15/8",
          "sourceId": 1927685344,
          "name": "X",
          "winning": false,
          "change": 0
        },
        {
          "initialFractionalValue": "10/11",
          "fractionalValue": "10/11",
          "sourceId": 1927685345,
          "name": "2",
          "winning": false,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 4,
      "marketName": "Draw no bet",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109496,
      "marketGroup": "Draw no bet",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "3/1",
          "fractionalValue": "3/1",
          "sourceId": 1927685335,
          "name": "1",
          "winning": false,
          "change": 0
        },
        {
          "initialFractionalValue": "2/9",
          "fractionalValue": "2/9",
          "sourceId": 1927685334,
          "name": "2",
          "winning": false,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 5,
      "marketName": "Both teams to score",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109497,
      "marketGroup": "Both teams to score",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "4/9",
          "fractionalValue": "2/5",
          "sourceId": 1927687962,
          "name": "Yes",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "13/8",
          "fractionalValue": "7/4",
          "sourceId": 1927687963,
          "name": "No",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "0.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109508,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "1/80",
          "fractionalValue": "1/200",
          "sourceId": 1927687349,
          "name": "Over",
          "winning": true,
          "change": 0
        },
        {
          "initialFractionalValue": "22/1",
          "fractionalValue": "33/1",
          "sourceId": 1927687350,
          "name": "Under",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "1.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109507,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "1/10",
          "fractionalValue": "1/12",
          "sourceId": 1927687341,
          "name": "Over",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "6/1",
          "fractionalValue": "7/1",
          "sourceId": 1927687352,
          "name": "Under",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "2.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109500,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "1/3",
          "fractionalValue": "2/7",
          "sourceId": 1874382193,
          "name": "Over",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "12/5",
          "fractionalValue": "11/4",
          "sourceId": 1874382201,
          "name": "Under",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "3.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109506,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "4/5",
          "fractionalValue": "8/11",
          "sourceId": 1927687347,
          "name": "Over",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "1/1",
          "fractionalValue": "11/10",
          "sourceId": 1927687342,
          "name": "Under",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "4.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109505,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "2/1",
          "fractionalValue": "13/8",
          "sourceId": 1927687354,
          "name": "Over",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "2/5",
          "fractionalValue": "1/2",
          "sourceId": 1927687343,
          "name": "Under",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "5.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109504,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "4/1",
          "fractionalValue": "7/2",
          "sourceId": 1927687334,
          "name": "Over",
          "winning": true,
          "change": -1
        },
        {
          "initialFractionalValue": "1/6",
          "fractionalValue": "1/5",
          "sourceId": 1927687339,
          "name": "Under",
          "winning": false,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "6.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109503,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "8/1",
          "fractionalValue": "7/1",
          "sourceId": 1927687355,
          "name": "Over",
          "winning": false,
          "change": -1
        },
        {
          "initialFractionalValue": "1/14",
          "fractionalValue": "1/12",
          "sourceId": 1927687356,
          "name": "Under",
          "winning": true,
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "7.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109502,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "16/1",
          "fractionalValue": "14/1",
          "sourceId": 1927687357,
          "name": "Over",
          "winning": false,
          "change": -1
        },
        {
          "initialFractionalValue": "1/40",
          "fractionalValue": "1/33",
          "sourceId": 1927687358,
          "name": "Under",
          "winning": true,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "8.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109501,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "28/1",
          "fractionalValue": "25/1",
          "sourceId": 1927687344,
          "name": "Over",
          "winning": false,
          "change": -1
        },
        {
          "initialFractionalValue": "1/150",
          "fractionalValue": "1/100",
          "sourceId": 1927687348,
          "name": "Under",
          "winning": true,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 9,
      "marketName": "Match goals",
      "choiceGroup": "9.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 143372719,
      "marketGroup": "Match goals",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "50/1",
          "fractionalValue": "50/1",
          "sourceId": 2029212058,
          "name": "Over",
          "winning": false,
          "change": 0
        },
        {
          "initialFractionalValue": "1/500",
          "fractionalValue": "1/500",
          "sourceId": 2029212061,
          "name": "Under",
          "winning": true,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 17,
      "marketName": "Asian handicap",
      "isLive": false,
      "fid": 183114318,
      "suspended": false,
      "id": 136109499,
      "marketGroup": "Asian Handicap",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "33/40",
          "fractionalValue": "4/5",
          "sourceId": 1874382210,
          "name": "(1.25) Club Brugge KV",
          "change": -1
        },
        {
          "initialFractionalValue": "41/40",
          "fractionalValue": "21/20",
          "sourceId": 1874382216,
          "name": "(-1.25) Barcelona",
          "change": 1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 20,
      "marketName": "Cards in match",
      "choiceGroup": "3.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 141061158,
      "marketGroup": "Total Cards",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "8/13",
          "fractionalValue": "8/11",
          "sourceId": 2023386562,
          "name": "Over",
          "change": 1
        },
        {
          "initialFractionalValue": "6/5",
          "fractionalValue": "1/1",
          "sourceId": 2023386561,
          "name": "Under",
          "change": -1
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 2,
      "marketId": 21,
      "marketName": "Corners 2-Way",
      "choiceGroup": "9.5",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 139874637,
      "marketGroup": "Corners 2-Way",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "8/11",
          "fractionalValue": "8/11",
          "sourceId": 2013736079,
          "name": "Over",
          "winning": false,
          "change": 0
        },
        {
          "initialFractionalValue": "1/1",
          "fractionalValue": "1/1",
          "sourceId": 2013736078,
          "name": "Under",
          "winning": true,
          "change": 0
        }
      ]
    },
    {
      "sourceId": 183114317,
      "structureType": 1,
      "marketId": 6,
      "marketName": "First team to score",
      "isLive": false,
      "fid": 183114317,
      "suspended": false,
      "id": 136109498,
      "marketGroup": "First team to score",
      "marketPeriod": "Full-time",
      "choices": [
        {
          "initialFractionalValue": "6/4",
          "fractionalValue": "6/4",
          "sourceId": 1927685342,
          "name": "Club Brugge KV",
          "winning": true,
          "change": 0
        },
        {
          "initialFractionalValue": "28/1",
          "fractionalValue": "33/1",
          "sourceId": 1927685337,
          "name": "No goal",
          "winning": false,
          "change": 1
        },
        {
          "initialFractionalValue": "1/2",
          "fractionalValue": "1/2",
          "sourceId": 1927685339,
          "name": "Barcelona",
          "winning": false,
          "change": 0
        }
      ]
    }
  ],
  "eventId": 14566745
}

Get players by team ID
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/team/44/players');
Example response:
{
  "players": [
    {
      "name": "Florian Wirtz",
      "firstName": "",
      "lastName": "",
      "slug": "florian-wirtz",
      "shortName": "F. Wirtz",
      "team": {
        "id": 44,
        "name": "Liverpool",
        "slug": "liverpool",
        "shortName": "Liverpool",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "tournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          },
          "uniqueTournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "primaryColorHex": "#3c1c5a",
            "secondaryColorHex": "#f80158",
            "userCount": 1250229,
            "id": 17,
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            }
          }
        },
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        }
      },
      "position": "F",
      "positionsDetailed": [
        "AM"
      ],
      "jerseyNumber": "7",
      "height": 175,
      "dateOfBirth": "2003-05-03T00:00:00+00:00",
      "preferredFoot": "Right",
      "userCount": 144163,
      "gender": "M",
      "sofascoreId": "FWirtz",
      "id": 1019322,
      "country": {
        "alpha2": "UK",
        "alpha3": "UK",
        "name": "England",
        "slug": "England"
      },
      "shirtNumber": 7,
      "dateOfBirthTimestamp": 1051920000,
      "contractUntilTimestamp": 1909008000,
      "proposedMarketValue": 124000000,
      "proposedMarketValueRaw": {
        "value": 124000000,
        "currency": "EUR"
      }
    }
  ],
  "foreignPlayers": [
    {
      "name": "Florian Wirtz",
      "firstName": "",
      "lastName": "",
      "slug": "florian-wirtz",
      "shortName": "F. Wirtz",
      "team": {
        "id": 44,
        "name": "Liverpool",
        "slug": "liverpool",
        "shortName": "Liverpool",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "tournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          },
          "uniqueTournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "primaryColorHex": "#3c1c5a",
            "secondaryColorHex": "#f80158",
            "userCount": 1250229,
            "id": 17,
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            }
          }
        },
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        }
      },
      "position": "F",
      "positionsDetailed": [
        "AM"
      ],
      "jerseyNumber": "7",
      "height": 175,
      "dateOfBirth": "2003-05-03T00:00:00+00:00",
      "preferredFoot": "Right",
      "userCount": 144163,
      "gender": "M",
      "sofascoreId": "FWirtz",
      "id": 1019322,
      "country": {
        "alpha2": "UK",
        "alpha3": "UK",
        "name": "England",
        "slug": "England"
      },
      "shirtNumber": 7,
      "dateOfBirthTimestamp": 1051920000,
      "contractUntilTimestamp": 1909008000,
      "proposedMarketValue": 124000000,
      "proposedMarketValueRaw": {
        "value": 124000000,
        "currency": "EUR"
      }
    }
  ],
  "nationalPlayers": [
    {
      "name": "Florian Wirtz",
      "firstName": "",
      "lastName": "",
      "slug": "florian-wirtz",
      "shortName": "F. Wirtz",
      "team": {
        "id": 44,
        "name": "Liverpool",
        "slug": "liverpool",
        "shortName": "Liverpool",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "tournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          },
          "uniqueTournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "primaryColorHex": "#3c1c5a",
            "secondaryColorHex": "#f80158",
            "userCount": 1250229,
            "id": 17,
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            }
          }
        },
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        }
      },
      "position": "F",
      "positionsDetailed": [
        "AM"
      ],
      "jerseyNumber": "7",
      "height": 175,
      "dateOfBirth": "2003-05-03T00:00:00+00:00",
      "preferredFoot": "Right",
      "userCount": 144163,
      "gender": "M",
      "sofascoreId": "FWirtz",
      "id": 1019322,
      "country": {
        "alpha2": "UK",
        "alpha3": "UK",
        "name": "England",
        "slug": "England"
      },
      "shirtNumber": 7,
      "dateOfBirthTimestamp": 1051920000,
      "contractUntilTimestamp": 1909008000,
      "proposedMarketValue": 124000000,
      "proposedMarketValueRaw": {
        "value": 124000000,
        "currency": "EUR"
      }
    }
  ],
  "playerPreviousTeam": [
    {
      "name": "Florian Wirtz",
      "firstName": "",
      "lastName": "",
      "slug": "florian-wirtz",
      "shortName": "F. Wirtz",
      "team": {
        "id": 44,
        "name": "Liverpool",
        "slug": "liverpool",
        "shortName": "Liverpool",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "tournament": {
          "name": "Premier League",
          "slug": "premier-league",
          "category": {
            "name": "England",
            "slug": "england",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1,
            "flag": "england",
            "country": {
              "alpha2": "UK",
              "alpha3": "UK",
              "name": "England",
              "slug": "England"
            }
          },
          "uniqueTournament": {
            "name": "Premier League",
            "slug": "premier-league",
            "primaryColorHex": "#3c1c5a",
            "secondaryColorHex": "#f80158",
            "userCount": 1250229,
            "id": 17,
            "category": {
              "name": "England",
              "slug": "england",
              "sport": {
                "name": "Football",
                "slug": "football",
                "id": 1
              },
              "id": 1,
              "flag": "england",
              "country": {
                "alpha2": "UK",
                "alpha3": "UK",
                "name": "England",
                "slug": "England"
              }
            }
          }
        },
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        }
      },
      "position": "F",
      "positionsDetailed": [
        "AM"
      ],
      "jerseyNumber": "7",
      "height": 175,
      "dateOfBirth": "2003-05-03T00:00:00+00:00",
      "preferredFoot": "Right",
      "userCount": 144163,
      "gender": "M",
      "sofascoreId": "FWirtz",
      "id": 1019322,
      "country": {
        "alpha2": "UK",
        "alpha3": "UK",
        "name": "England",
        "slug": "England"
      },
      "shirtNumber": 7,
      "dateOfBirthTimestamp": 1051920000,
      "contractUntilTimestamp": 1909008000,
      "proposedMarketValue": 124000000,
      "proposedMarketValueRaw": {
        "value": 124000000,
        "currency": "EUR"
      }
    }
  ]
}

Get player attribute overviews
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/player/1402912/attribute-overviews');
{
  "playerAttributeOverviews": [
    {
      "attacking": 88,
      "technical": 98,
      "tactical": 62,
      "defending": 35,
      "creativity": 88,
      "position": "F",
      "yearShift": 0,
      "id": 128710
    },
    {
      "attacking": 85,
      "technical": 85,
      "tactical": 66,
      "defending": 40,
      "creativity": 82,
      "position": "F",
      "yearShift": 1,
      "id": 171527
    }
  ],
  "averageAttributeOverviews": [
    {
      "attacking": 52,
      "technical": 55,
      "tactical": 40,
      "defending": 42,
      "creativity": 51,
      "position": "M",
      "yearShift": 0,
      "id": 19811
    }
  ]
}

Get player recent events (paginated)
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/player/1402912/events/last/%7Bpage%7D');
Example:
{
  "events": [
    {
      "tournament": {
        "name": "Copa del Rey",
        "slug": "copa-del-rey",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "Copa del Rey",
          "slug": "copa-del-rey",
          "primaryColorHex": "#221C35",
          "secondaryColorHex": "#fe0235",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 160528,
          "hasPerformanceGraphFeature": false,
          "id": 329,
          "country": {},
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس ملك إسبانيا",
              "hi": "कोपा डेल रे",
              "bn": "কোপা দেল রে"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 693,
        "isGroup": false,
        "isLive": false,
        "id": 150,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس إسبانيا",
            "hi": "कोपा डेल रे",
            "bn": "কোপা দেল রে"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "Copa del Rey 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {
          "editorCoverageLevel": 1
        },
        "id": 66885
      },
      "roundInfo": {
        "round": 5,
        "name": "Round of 16",
        "slug": "round-of-16",
        "cupRoundType": 8
      },
      "customId": "qgbsrgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Real Betis",
        "slug": "real-betis",
        "shortName": "Real Betis",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 550316,
        "nameCode": "BET",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2816,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#006633",
          "text": "#006633"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ريال بيتيس",
            "ru": "Реал Бетис"
          },
          "shortNameTranslation": {
            "ar": "ريال بيتيس",
            "hi": "बेटिस",
            "bn": "বেটিস"
          }
        }
      },
      "homeScore": {
        "current": 5,
        "display": 5,
        "period1": 2,
        "period2": 3,
        "normaltime": 5
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 4,
        "injuryTime2": 0,
        "currentPeriodStartTimestamp": 1736975393
      },
      "changes": {
        "changes": [
          "time.injuryTime2",
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1736978110
      },
      "hasGlobalHighlights": false,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13315898,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "barcelona-real-betis",
      "startTimestamp": 1736971200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 20
      },
      "customId": "rgbsjhb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 3,
      "homeTeam": {
        "name": "Getafe",
        "slug": "getafe",
        "shortName": "Getafe",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 187611,
        "nameCode": "GET",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2859,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#00369e",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "خيتافي",
            "ru": "Хетафе",
            "hi": "गेटाफे",
            "bn": "গেটাফে"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1737234325
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1737237522
      },
      "hasGlobalHighlights": false,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437838,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "getafe-barcelona",
      "startTimestamp": 1737230400,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Champions League",
        "slug": "uefa-champions-league",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 714,
        "isGroup": false,
        "id": 138314,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 7
      },
      "customId": "rgbsgkb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Benfica",
        "slug": "benfica",
        "shortName": "Benfica",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 833073,
        "nameCode": "SLB",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 3006,
        "country": {
          "alpha2": "PT",
          "alpha3": "PRT",
          "name": "Portugal",
          "slug": "portugal"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بنفيكا",
            "ru": "Бенфика",
            "hi": "बेनफिका",
            "bn": "বেনফিকা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 3,
        "period2": 1,
        "normaltime": 4
      },
      "awayScore": {
        "current": 5,
        "display": 5,
        "period1": 1,
        "period2": 4,
        "normaltime": 5
      },
      "coverage": -1,
      "time": {
        "injuryTime1": 4,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1737493549
      },
      "changes": {
        "changes": [
          "cardsCode",
          "status.code",
          "status.description",
          "status.type",
          "awayScore.period2",
          "awayScore.normaltime"
        ],
        "changeTimestamp": 1737496744
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12764100,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "benfica-barcelona",
      "startTimestamp": 1737489600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 21
      },
      "customId": "rgbsDgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Valencia",
        "slug": "valencia",
        "shortName": "Valencia",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 293109,
        "nameCode": "VAL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2828,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "فالنسيا",
            "ru": "Валенсия",
            "hi": "वेलेंसिया",
            "bn": "ভ্যালেন্সিয়া"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 7,
        "display": 7,
        "period1": 5,
        "period2": 2,
        "normaltime": 7
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 5,
        "injuryTime2": 2,
        "currentPeriodStartTimestamp": 1737925638
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "time.injuryTime2"
        ],
        "changeTimestamp": 1737928463
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437633,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "valencia-barcelona",
      "startTimestamp": 1737921600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Champions League",
        "slug": "uefa-champions-league",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 714,
        "isGroup": false,
        "id": 138314,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 8
      },
      "customId": "Ldbsrgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 3,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Atalanta",
        "slug": "atalanta",
        "shortName": "Atalanta",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 666951,
        "nameCode": "ATA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2686,
        "country": {
          "alpha2": "IT",
          "alpha3": "ITA",
          "name": "Italy",
          "slug": "italy"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#0000cc",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "أتالانتا",
            "ru": "Аталанта",
            "hi": "अटलांटा",
            "bn": "আটলান্টা"
          },
          "shortNameTranslation": {
            "ar": "أتالانتا"
          }
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "coverage": -1,
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1738184726
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1738188082
      },
      "hasGlobalHighlights": false,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12764006,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "barcelona-atalanta",
      "startTimestamp": 1738180800,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 22
      },
      "customId": "rgbsKhb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Deportivo Alavés",
        "slug": "deportivo-alaves",
        "shortName": "Alavés",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 131752,
        "nameCode": "ALA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2885,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#0232a0",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ديبورتيفو ألافيس",
            "ru": "Алавес"
          },
          "shortNameTranslation": {
            "ar": "ألافيس",
            "hi": "अलावेस",
            "bn": "আলাভেস"
          }
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "injuryTime1": 6,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1738505277
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1738508225
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437743,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "deportivo-alaves-barcelona",
      "startTimestamp": 1738501200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "Copa del Rey",
        "slug": "copa-del-rey",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "Copa del Rey",
          "slug": "copa-del-rey",
          "primaryColorHex": "#221C35",
          "secondaryColorHex": "#fe0235",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 160528,
          "hasPerformanceGraphFeature": false,
          "id": 329,
          "country": {},
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس ملك إسبانيا",
              "hi": "कोपा डेल रे",
              "bn": "কোপা দেল রে"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 693,
        "isGroup": false,
        "isLive": false,
        "id": 150,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس إسبانيا",
            "hi": "कोपा डेल रे",
            "bn": "কোপা দেল রে"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "Copa del Rey 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {
          "editorCoverageLevel": 1
        },
        "id": 66885
      },
      "roundInfo": {
        "round": 27,
        "name": "Quarterfinals",
        "slug": "quarterfinals",
        "cupRoundType": 4
      },
      "customId": "rgbsDgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Valencia",
        "slug": "valencia",
        "shortName": "Valencia",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 293109,
        "nameCode": "VAL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2828,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "فالنسيا",
            "ru": "Валенсия",
            "hi": "वेलेंसिया",
            "bn": "ভ্যালেন্সিয়া"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 5,
        "display": 5,
        "period1": 4,
        "period2": 1,
        "normaltime": 5
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 0,
        "currentPeriodStartTimestamp": 1738877644
      },
      "changes": {
        "changes": [
          "time.injuryTime2",
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1738880365
      },
      "hasGlobalHighlights": false,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13363913,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "valencia-barcelona",
      "startTimestamp": 1738873800,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 23
      },
      "customId": "rgbsIgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Sevilla",
        "slug": "sevilla",
        "shortName": "Sevilla",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 405761,
        "nameCode": "SEV",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2833,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#cc1020",
          "text": "#cc1020"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "إشبيلية",
            "ru": "Cевилья",
            "hi": "सेविला",
            "bn": "সেভিলা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 4,
        "display": 4,
        "period1": 1,
        "period2": 3,
        "normaltime": 4
      },
      "time": {
        "injuryTime1": 4,
        "injuryTime2": 6,
        "currentPeriodStartTimestamp": 1739135350
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1739138418
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437781,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "sevilla-barcelona",
      "startTimestamp": 1739131200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 24
      },
      "customId": "rgbstgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Rayo Vallecano",
        "slug": "rayo-vallecano",
        "shortName": "Rayo Vallecano",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 189597,
        "nameCode": "RAY",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2818,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "رايو فاليكانو",
            "ru": "Райо Вальекано",
            "hi": "रेयो वैलेकैनो",
            "bn": "রায়ো ভ্যালেকানো"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1739826448
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1739829528
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437806,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "rayo-vallecano-barcelona",
      "startTimestamp": 1739822400,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 25
      },
      "customId": "rgbsCGc",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Las Palmas",
        "slug": "las-palmas",
        "shortName": "Las Palmas",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 113590,
        "nameCode": "LPA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 6577,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#e8f541",
          "secondary": "#f3f845",
          "text": "#f3f845"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "لاس بالماس",
            "ru": "Лас-Пальмас",
            "hi": "लास पालमास",
            "bn": "লাস পালমাস"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "time": {
        "injuryTime1": 0,
        "injuryTime2": 8,
        "currentPeriodStartTimestamp": 1740258364
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1740261608
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437859,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "las-palmas-barcelona",
      "startTimestamp": 1740254400,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "Copa del Rey",
        "slug": "copa-del-rey",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "Copa del Rey",
          "slug": "copa-del-rey",
          "primaryColorHex": "#221C35",
          "secondaryColorHex": "#fe0235",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 160528,
          "hasPerformanceGraphFeature": false,
          "id": 329,
          "country": {},
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس ملك إسبانيا",
              "hi": "कोपा डेल रे",
              "bn": "কোপা দেল রে"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 693,
        "isGroup": false,
        "isLive": false,
        "id": 150,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس إسبانيا",
            "hi": "कोपा डेल रे",
            "bn": "কোপা দেল রে"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "Copa del Rey 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {
          "editorCoverageLevel": 1
        },
        "id": 66885
      },
      "roundInfo": {
        "round": 28,
        "name": "Semifinals",
        "slug": "semifinals",
        "cupRoundType": 2
      },
      "customId": "rgbsLgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 3,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Atlético Madrid",
        "slug": "atletico-madrid",
        "shortName": "Atl. Madrid",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1969549,
        "nameCode": "ATM",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2836,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#c40000",
          "text": "#c40000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "أتلتيكو مدريد",
            "ru": "Атлетико Мадрид",
            "hi": "एटलेटिको मैड्रिड"
          },
          "shortNameTranslation": {
            "ar": "أتل. مدريد",
            "bn": "এটিএল. মাদ্রিদ"
          }
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 3,
        "period2": 1,
        "normaltime": 4
      },
      "awayScore": {
        "current": 4,
        "display": 4,
        "period1": 2,
        "period2": 2,
        "normaltime": 4
      },
      "time": {
        "injuryTime1": 5,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1740519498
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "awayScore.period2",
          "awayScore.normaltime"
        ],
        "changeTimestamp": 1740522559
      },
      "hasGlobalHighlights": false,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13466608,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "atletico-madrid-barcelona",
      "startTimestamp": 1740515400,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 26
      },
      "customId": "rgbszgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Real Sociedad",
        "slug": "real-sociedad",
        "shortName": "Real Sociedad",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 404225,
        "nameCode": "RSO",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2824,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#0077c7",
          "text": "#0077c7"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ريال سوسيداد",
            "ru": "Реал Сосьедад",
            "hi": "रियल सोसियदाद",
            "bn": "রিয়াল সোসিয়েদাদ"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 2,
        "period2": 2,
        "normaltime": 4
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 2,
        "currentPeriodStartTimestamp": 1740932359
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1740935185
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437864,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "real-sociedad-barcelona",
      "startTimestamp": 1740928500,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Champions League, Knockout Phase",
        "slug": "uefa-champions-league-knockout-phase",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 703,
        "isGroup": false,
        "id": 145109,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا، مرحلة خروج المغلوب"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 5,
        "name": "Round of 16",
        "slug": "round-of-16",
        "cupRoundType": 8
      },
      "customId": "rgbsgkb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Benfica",
        "slug": "benfica",
        "shortName": "Benfica",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 833073,
        "nameCode": "SLB",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 3006,
        "country": {
          "alpha2": "PT",
          "alpha3": "PRT",
          "name": "Portugal",
          "slug": "portugal"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بنفيكا",
            "ru": "Бенфика",
            "hi": "बेनफिका",
            "bn": "বেনফিকা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "coverage": -1,
      "time": {
        "injuryTime1": 5,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1741208978
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1741212020
      },
      "hasGlobalHighlights": false,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13511933,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "benfica-barcelona",
      "startTimestamp": 1741204800,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Champions League, Knockout Phase",
        "slug": "uefa-champions-league-knockout-phase",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 703,
        "isGroup": false,
        "id": 145109,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا، مرحلة خروج المغلوب"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 5,
        "name": "Round of 16",
        "slug": "round-of-16",
        "cupRoundType": 8
      },
      "customId": "rgbsgkb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "aggregatedWinnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Benfica",
        "slug": "benfica",
        "shortName": "Benfica",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 833073,
        "nameCode": "SLB",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 3006,
        "country": {
          "alpha2": "PT",
          "alpha3": "PRT",
          "name": "Portugal",
          "slug": "portugal"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بنفيكا",
            "ru": "Бенфика",
            "hi": "बेनफिका",
            "bn": "বেনফিকা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 3,
        "period2": 0,
        "normaltime": 3,
        "aggregated": 4
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "aggregated": 1
      },
      "coverage": -1,
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 2,
        "currentPeriodStartTimestamp": 1741719074
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1741721913
      },
      "hasGlobalHighlights": false,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13511934,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "benfica-barcelona",
      "previousLegEventId": 13511933,
      "startTimestamp": 1741715100,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 28
      },
      "customId": "rgbsLgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Atlético Madrid",
        "slug": "atletico-madrid",
        "shortName": "Atl. Madrid",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1969549,
        "nameCode": "ATM",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2836,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#c40000",
          "text": "#c40000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "أتلتيكو مدريد",
            "ru": "Атлетико Мадрид",
            "hi": "एटलेटिको मैड्रिड"
          },
          "shortNameTranslation": {
            "ar": "أتل. مدريد",
            "bn": "এটিএল. মাদ্রিদ"
          }
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "awayScore": {
        "current": 4,
        "display": 4,
        "period1": 0,
        "period2": 4,
        "normaltime": 4
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 6,
        "currentPeriodStartTimestamp": 1742159316
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "awayScore.period2",
          "awayScore.normaltime"
        ],
        "changeTimestamp": 1742162530
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437550,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "atletico-madrid-barcelona",
      "startTimestamp": 1742155200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Nations League, Finals",
        "slug": "uefa-nations-league-finals",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Nations League",
          "slug": "uefa-nations-league",
          "primaryColorHex": "#3a4179",
          "secondaryColorHex": "#e5a422",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 277518,
          "hasPerformanceGraphFeature": false,
          "id": 10783,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أمم أوروبا",
              "hi": "यूईएफए नेशंस लीग",
              "bn": "উয়েফা নেশনস লিগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 766,
        "isGroup": false,
        "isLive": false,
        "id": 70578,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري الأمم الأوروبية - النهائيات",
            "hi": "यूईएफए नेशंस लीग, फाइनल",
            "bn": "উয়েফা নেশনস লীগ, ফাইনাল"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Nations League 24/25",
        "year": "24/25",
        "editor": false,
        "id": 58337
      },
      "roundInfo": {
        "round": 27,
        "name": "Quarterfinals",
        "slug": "quarterfinals",
        "cupRoundType": 4
      },
      "customId": "YTbsfUb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 3,
      "homeTeam": {
        "name": "Netherlands",
        "slug": "netherlands",
        "shortName": "Netherlands",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 483281,
        "nameCode": "NED",
        "ranking": 7,
        "disabled": false,
        "national": true,
        "type": 0,
        "id": 4705,
        "country": {
          "alpha2": "NL",
          "alpha3": "NLD",
          "name": "Netherlands",
          "slug": "netherlands"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ff6600",
          "secondary": "#281fe0",
          "text": "#281fe0"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "هولندا",
            "ru": "Голландия (Нидерланды)",
            "hi": "नीदरलैंड्स",
            "bn": "নেদারল্যান্ডস"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Spain",
        "slug": "spain",
        "shortName": "Spain",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1527442,
        "nameCode": "ESP",
        "ranking": 1,
        "disabled": false,
        "national": true,
        "type": 0,
        "id": 4698,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "إسبانيا",
            "ru": "Испания",
            "hi": "स्पेन",
            "bn": "স্পেন"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 1,
        "period2": 1,
        "normaltime": 2
      },
      "coverage": -1,
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1742503801
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type",
          "awayScore.period2",
          "awayScore.normaltime"
        ],
        "changeTimestamp": 1742506834
      },
      "hasGlobalHighlights": false,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13157479,
      "homeRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "netherlands-spain",
      "startTimestamp": 1742499900,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Nations League, Finals",
        "slug": "uefa-nations-league-finals",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Nations League",
          "slug": "uefa-nations-league",
          "primaryColorHex": "#3a4179",
          "secondaryColorHex": "#e5a422",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 277518,
          "hasPerformanceGraphFeature": false,
          "id": 10783,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أمم أوروبا",
              "hi": "यूईएफए नेशंस लीग",
              "bn": "উয়েফা নেশনস লিগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 766,
        "isGroup": false,
        "isLive": false,
        "id": 70578,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري الأمم الأوروبية - النهائيات",
            "hi": "यूईएफए नेशंस लीग, फाइनल",
            "bn": "উয়েফা নেশনস লীগ, ফাইনাল"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Nations League 24/25",
        "year": "24/25",
        "editor": false,
        "id": 58337
      },
      "roundInfo": {
        "round": 27,
        "name": "Quarterfinals",
        "slug": "quarterfinals",
        "cupRoundType": 4
      },
      "customId": "YTbsfUb",
      "status": {
        "code": 120,
        "description": "AP",
        "type": "finished"
      },
      "winnerCode": 3,
      "aggregatedWinnerCode": 1,
      "homeTeam": {
        "name": "Spain",
        "slug": "spain",
        "shortName": "Spain",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1527442,
        "nameCode": "ESP",
        "ranking": 1,
        "disabled": false,
        "national": true,
        "type": 0,
        "id": 4698,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "إسبانيا",
            "ru": "Испания",
            "hi": "स्पेन",
            "bn": "স্পেন"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Netherlands",
        "slug": "netherlands",
        "shortName": "Netherlands",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 483281,
        "nameCode": "NED",
        "ranking": 7,
        "disabled": false,
        "national": true,
        "type": 0,
        "id": 4705,
        "country": {
          "alpha2": "NL",
          "alpha3": "NLD",
          "name": "Netherlands",
          "slug": "netherlands"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ff6600",
          "secondary": "#281fe0",
          "text": "#281fe0"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "هولندا",
            "ru": "Голландия (Нидерланды)",
            "hi": "नीदरलैंड्स",
            "bn": "নেদারল্যান্ডস"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 8,
        "display": 3,
        "period1": 1,
        "period2": 1,
        "normaltime": 2,
        "extra1": 1,
        "extra2": 0,
        "overtime": 1,
        "penalties": 5,
        "aggregated": 5
      },
      "awayScore": {
        "current": 7,
        "display": 3,
        "period1": 0,
        "period2": 2,
        "normaltime": 2,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1,
        "penalties": 4,
        "aggregated": 5
      },
      "coverage": -1,
      "time": {
        "injuryTime1": 1,
        "injuryTime2": 3,
        "injuryTime3": 1,
        "injuryTime4": 1,
        "currentPeriodStartTimestamp": 1742767201
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description"
        ],
        "changeTimestamp": 1742769064
      },
      "hasGlobalHighlights": false,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13157480,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "netherlands-spain",
      "previousLegEventId": 13157479,
      "startTimestamp": 1742759100,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 27
      },
      "customId": "rgbsvgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Osasuna",
        "slug": "osasuna",
        "shortName": "Osasuna",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 183384,
        "nameCode": "OSA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2820,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#14213d",
          "text": "#14213d"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "أوساسونا",
            "ru": "Осасуна",
            "hi": "ओसासुना",
            "bn": "ওসাসুনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 2,
        "period2": 1,
        "normaltime": 3
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "injuryTime1": 5,
        "injuryTime2": 3,
        "currentPeriodStartTimestamp": 1743109636
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1743112525
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13637082,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "osasuna-barcelona",
      "startTimestamp": 1743105600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 29
      },
      "customId": "rgbsoKj",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Girona FC",
        "slug": "girona-fc",
        "shortName": "Girona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 385280,
        "nameCode": "GIR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 24264,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#ff0000",
          "text": "#ff0000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "جيرونا إف سي",
            "ru": "Жирона",
            "hi": "जिरोना"
          },
          "shortNameTranslation": {
            "ar": "جيرونا",
            "hi": "गिरोना",
            "bn": "জিরোনা"
          }
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 1,
        "period2": 3,
        "normaltime": 4
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1743348246
      },
      "changes": {
        "changes": [
          "time.injuryTime2",
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1743351273
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437570,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "girona-fc-barcelona",
      "startTimestamp": 1743344100,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "Copa del Rey",
        "slug": "copa-del-rey",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "Copa del Rey",
          "slug": "copa-del-rey",
          "primaryColorHex": "#221C35",
          "secondaryColorHex": "#fe0235",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 160528,
          "hasPerformanceGraphFeature": false,
          "id": 329,
          "country": {},
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس ملك إسبانيا",
              "hi": "कोपा डेल रे",
              "bn": "কোপা দেল রে"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 693,
        "isGroup": false,
        "isLive": false,
        "id": 150,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس إسبانيا",
            "hi": "कोपा डेल रे",
            "bn": "কোপা দেল রে"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "Copa del Rey 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {
          "editorCoverageLevel": 1
        },
        "id": 66885
      },
      "roundInfo": {
        "round": 28,
        "name": "Semifinals",
        "slug": "semifinals",
        "cupRoundType": 2
      },
      "customId": "rgbsLgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "aggregatedWinnerCode": 2,
      "homeTeam": {
        "name": "Atlético Madrid",
        "slug": "atletico-madrid",
        "shortName": "Atl. Madrid",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1969549,
        "nameCode": "ATM",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2836,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#c40000",
          "text": "#c40000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "أتلتيكو مدريد",
            "ru": "Атлетико Мадрид",
            "hi": "एटलेटिको मैड्रिड"
          },
          "shortNameTranslation": {
            "ar": "أتل. مدريد",
            "bn": "এটিএল. মাদ্রিদ"
          }
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0,
        "aggregated": 4
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1,
        "aggregated": 5
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1743626333
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1743629289
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13466669,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "atletico-madrid-barcelona",
      "previousLegEventId": 13466608,
      "startTimestamp": 1743622200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 30
      },
      "customId": "qgbsrgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 3,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Real Betis",
        "slug": "real-betis",
        "shortName": "Real Betis",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 550316,
        "nameCode": "BET",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2816,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#006633",
          "text": "#006633"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ريال بيتيس",
            "ru": "Реал Бетис"
          },
          "shortNameTranslation": {
            "ar": "ريال بيتيس",
            "hi": "बेटिस",
            "bn": "বেটিস"
          }
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1743883529
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1743886495
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437575,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "barcelona-real-betis",
      "startTimestamp": 1743879600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Champions League, Knockout Phase",
        "slug": "uefa-champions-league-knockout-phase",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 703,
        "isGroup": false,
        "id": 145109,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا، مرحلة خروج المغلوب"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 27,
        "name": "Quarterfinals",
        "slug": "quarterfinals",
        "cupRoundType": 4
      },
      "customId": "ydbsrgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Borussia Dortmund",
        "slug": "borussia-dortmund",
        "shortName": "Dortmund",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1373834,
        "nameCode": "BVB",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2673,
        "country": {
          "alpha2": "DE",
          "alpha3": "DEU",
          "name": "Germany",
          "slug": "germany"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffe600",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بوروسيا دورتموند",
            "ru": "Боруссия Дортмунд",
            "hi": "बोरुस्सिया  डॉर्टमुंड"
          },
          "shortNameTranslation": {
            "ar": "دورتموند",
            "hi": "डॉर्टमुंड",
            "bn": "ডর্টমুন্ড"
          }
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 1,
        "period2": 3,
        "normaltime": 4
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "injuryTime1": 1,
        "injuryTime2": 3,
        "currentPeriodStartTimestamp": 1744228977
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1744231880
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13513404,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "barcelona-borussia-dortmund",
      "startTimestamp": 1744225200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 31
      },
      "customId": "rgbsVgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Leganés",
        "slug": "leganes",
        "shortName": "Leganés",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 90160,
        "nameCode": "LEG",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2845,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#3300ff",
          "text": "#3300ff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ليغانيس",
            "ru": "Леганес",
            "hi": "लेगानेस",
            "bn": "লেগানেস"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "time": {
        "injuryTime1": 3,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1744488265
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1744491215
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437635,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "leganes-barcelona",
      "startTimestamp": 1744484400,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "UEFA Champions League, Knockout Phase",
        "slug": "uefa-champions-league-knockout-phase",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 703,
        "isGroup": false,
        "id": 145109,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا، مرحلة خروج المغلوب"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 27,
        "name": "Quarterfinals",
        "slug": "quarterfinals",
        "cupRoundType": 4
      },
      "customId": "ydbsrgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "aggregatedWinnerCode": 2,
      "homeTeam": {
        "name": "Borussia Dortmund",
        "slug": "borussia-dortmund",
        "shortName": "Dortmund",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1373834,
        "nameCode": "BVB",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2673,
        "country": {
          "alpha2": "DE",
          "alpha3": "DEU",
          "name": "Germany",
          "slug": "germany"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffe600",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "بوروسيا دورتموند",
            "ru": "Боруссия Дортмунд",
            "hi": "बोरुस्सिया  डॉर्टमुंड"
          },
          "shortNameTranslation": {
            "ar": "دورتموند",
            "hi": "डॉर्टमुंड",
            "bn": "ডর্টমুন্ড"
          }
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 2,
        "normaltime": 3,
        "aggregated": 3
      },
      "awayScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1,
        "aggregated": 5
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1744747531
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1744750483
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13513405,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "barcelona-borussia-dortmund",
      "previousLegEventId": 13513404,
      "startTimestamp": 1744743600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 32
      },
      "customId": "rgbswgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Celta Vigo",
        "slug": "celta-vigo",
        "shortName": "Celta",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 222134,
        "nameCode": "CEL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2821,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#6cace4",
          "secondary": "#ffffff",
          "text": "#ffffff"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "سيلتا فيغو",
            "ru": "Сельта",
            "bn": "সেলটা ভিগো"
          },
          "shortNameTranslation": {
            "ar": "سيلتا",
            "hi": "सेल्टा"
          }
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 1,
        "period2": 3,
        "normaltime": 4
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 2,
        "normaltime": 3
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 8,
        "currentPeriodStartTimestamp": 1745076085
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1745079525
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437521,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "celta-vigo-barcelona",
      "startTimestamp": 1745072100,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": true,
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 33
      },
      "customId": "rgbsBgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Mallorca",
        "slug": "mallorca",
        "shortName": "Mallorca",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 188234,
        "nameCode": "MLL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2826,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#cc0000",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "مايوركا",
            "ru": "Мальорка",
            "hi": "मल्लोर्का",
            "bn": "ম্যালোর্কা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 0,
        "period2": 1,
        "normaltime": 1
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "normaltime": 0
      },
      "time": {
        "injuryTime1": 0,
        "injuryTime2": 4,
        "currentPeriodStartTimestamp": 1745354058
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1745357017
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437529,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "mallorca-barcelona",
      "startTimestamp": 1745350200,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": false,
      "tournament": {
        "name": "Copa del Rey",
        "slug": "copa-del-rey",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "Copa del Rey",
          "slug": "copa-del-rey",
          "primaryColorHex": "#221C35",
          "secondaryColorHex": "#fe0235",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 160528,
          "hasPerformanceGraphFeature": false,
          "id": 329,
          "country": {},
          "hasEventPlayerStatistics": false,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "كأس ملك إسبانيا",
              "hi": "कोपा डेल रे",
              "bn": "কোপা দেল রে"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 693,
        "isGroup": false,
        "isLive": false,
        "id": 150,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "كأس إسبانيا",
            "hi": "कोपा डेल रे",
            "bn": "কোপা দেল রে"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "Copa del Rey 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {
          "editorCoverageLevel": 1
        },
        "id": 66885
      },
      "roundInfo": {
        "round": 29,
        "name": "Final",
        "slug": "final",
        "cupRoundType": 1
      },
      "customId": "rgbsEgb",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 1,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Real Madrid",
        "slug": "real-madrid",
        "shortName": "Real Madrid",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 6207748,
        "nameCode": "RMA",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2829,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#004996",
          "text": "#004996"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ريال مدريد",
            "ru": "Реал Мадрид",
            "hi": "रियल मैड्रिड",
            "bn": "রিয়াল মাদ্রিদ"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 1,
        "period2": 1,
        "normaltime": 2,
        "extra1": 0,
        "extra2": 1,
        "overtime": 1
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0
      },
      "time": {
        "injuryTime1": 5,
        "injuryTime2": 6,
        "injuryTime3": 0,
        "injuryTime4": 2,
        "currentPeriodStartTimestamp": 1745706444
      },
      "changes": {
        "changes": [
          "cardsCode"
        ],
        "changeTimestamp": 1746107593
      },
      "hasGlobalHighlights": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13708595,
      "awayRedCards": 1,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "real-madrid-barcelona",
      "startTimestamp": 1745697600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": false,
      "tournament": {
        "name": "UEFA Champions League, Knockout Phase",
        "slug": "uefa-champions-league-knockout-phase",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 703,
        "isGroup": false,
        "id": 145109,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا، مرحلة خروج المغلوب"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 28,
        "name": "Semifinals",
        "slug": "semifinals",
        "cupRoundType": 2
      },
      "customId": "Xdbsrgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 3,
      "homeTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Inter",
        "slug": "inter",
        "shortName": "Inter",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1784207,
        "nameCode": "INT",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2697,
        "country": {
          "alpha2": "IT",
          "alpha3": "ITA",
          "name": "Italy",
          "slug": "italy"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#1a57cc",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "انتر",
            "ru": "Интер",
            "hi": "इंटर",
            "bn": "ইন্টার"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 3,
        "display": 3,
        "period1": 2,
        "period2": 1,
        "normaltime": 3
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 2,
        "period2": 1,
        "normaltime": 3
      },
      "time": {
        "injuryTime1": 2,
        "injuryTime2": 3,
        "currentPeriodStartTimestamp": 1746043483
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1746046370
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13513414,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "wqf3-wqf4",
      "startTimestamp": 1746039600,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": true,
      "tournament": {
        "name": "LaLiga",
        "slug": "laliga",
        "category": {
          "name": "Spain",
          "slug": "spain",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 32,
          "country": {
            "alpha2": "ES",
            "alpha3": "ESP",
            "name": "Spain",
            "slug": "spain"
          },
          "flag": "spain",
          "alpha2": "ES",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "إسبانيا",
              "hi": "स्पेन",
              "bn": "স্পেন"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "LaLiga",
          "slug": "laliga",
          "primaryColorHex": "#2f4a89",
          "secondaryColorHex": "#f4a32e",
          "category": {
            "name": "Spain",
            "slug": "spain",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 32,
            "country": {
              "alpha2": "ES",
              "alpha3": "ESP",
              "name": "Spain",
              "slug": "spain"
            },
            "flag": "spain",
            "alpha2": "ES",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "إسبانيا",
                "hi": "स्पेन",
                "bn": "স্পেন"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 828314,
          "hasPerformanceGraphFeature": true,
          "id": 8,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "الدوري الإسباني",
              "hi": "ला लिगा",
              "bn": "লা লীগা"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 697,
        "isGroup": false,
        "isLive": false,
        "id": 36,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "الدوري الإسباني",
            "hi": "ला लीगा",
            "bn": "লা লীগা"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "LaLiga 24/25",
        "year": "24/25",
        "editor": false,
        "id": 61643
      },
      "roundInfo": {
        "round": 34
      },
      "customId": "rgbsGgb",
      "status": {
        "code": 100,
        "description": "Ended",
        "type": "finished"
      },
      "winnerCode": 2,
      "homeTeam": {
        "name": "Real Valladolid",
        "slug": "real-valladolid",
        "shortName": "Real Valladolid",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 98501,
        "nameCode": "VLL",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2831,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#ffffff",
          "secondary": "#663399",
          "text": "#663399"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "ريال فايادوليد",
            "ru": "Реал Вальядолид",
            "hi": "रियल वलाडोलिड",
            "bn": "রিয়েল ভ্যালাডোলিড"
          },
          "shortNameTranslation": {
            "ar": "ريال فايادوليد"
          }
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 1,
        "display": 1,
        "period1": 1,
        "period2": 0,
        "normaltime": 1
      },
      "awayScore": {
        "current": 2,
        "display": 2,
        "period1": 0,
        "period2": 2,
        "normaltime": 2
      },
      "time": {
        "injuryTime1": 4,
        "injuryTime2": 5,
        "currentPeriodStartTimestamp": 1746302764
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1746305814
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 12437534,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "real-valladolid-barcelona",
      "startTimestamp": 1746298800,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    },
    {
      "correctAiInsight": true,
      "tournament": {
        "name": "UEFA Champions League, Knockout Phase",
        "slug": "uefa-champions-league-knockout-phase",
        "category": {
          "name": "Europe",
          "slug": "europe",
          "sport": {
            "name": "Football",
            "slug": "football",
            "id": 1
          },
          "id": 1465,
          "country": {},
          "flag": "europe",
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "أوروبا",
              "hi": "यूरोप",
              "bn": "ইউরোপ"
            },
            "shortNameTranslation": {}
          }
        },
        "uniqueTournament": {
          "name": "UEFA Champions League",
          "slug": "uefa-champions-league",
          "primaryColorHex": "#062b5c",
          "secondaryColorHex": "#086aab",
          "category": {
            "name": "Europe",
            "slug": "europe",
            "sport": {
              "name": "Football",
              "slug": "football",
              "id": 1
            },
            "id": 1465,
            "country": {},
            "flag": "europe",
            "fieldTranslations": {
              "nameTranslation": {
                "ar": "أوروبا",
                "hi": "यूरोप",
                "bn": "ইউরোপ"
              },
              "shortNameTranslation": {}
            }
          },
          "userCount": 1173495,
          "hasPerformanceGraphFeature": false,
          "id": 7,
          "country": {},
          "hasEventPlayerStatistics": true,
          "displayInverseHomeAwayTeams": false,
          "fieldTranslations": {
            "nameTranslation": {
              "ar": "دوري أبطال أوروبا",
              "hi": "यूईएफए चैंपियंस लीग",
              "bn": "উয়েফা চ্যাম্পিয়ন্স লীগ"
            },
            "shortNameTranslation": {}
          }
        },
        "priority": 703,
        "isGroup": false,
        "id": 145109,
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "دوري أبطال أوروبا، مرحلة خروج المغلوب"
          },
          "shortNameTranslation": {}
        }
      },
      "season": {
        "name": "UEFA Champions League 24/25",
        "year": "24/25",
        "editor": false,
        "seasonCoverageInfo": {},
        "id": 61644
      },
      "roundInfo": {
        "round": 28,
        "name": "Semifinals",
        "slug": "semifinals",
        "cupRoundType": 2
      },
      "customId": "Xdbsrgb",
      "status": {
        "code": 110,
        "description": "AET",
        "type": "finished"
      },
      "winnerCode": 1,
      "aggregatedWinnerCode": 1,
      "homeTeam": {
        "name": "Inter",
        "slug": "inter",
        "shortName": "Inter",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 1784207,
        "nameCode": "INT",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2697,
        "country": {
          "alpha2": "IT",
          "alpha3": "ITA",
          "name": "Italy",
          "slug": "italy"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#1a57cc",
          "secondary": "#000000",
          "text": "#000000"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "انتر",
            "ru": "Интер",
            "hi": "इंटर",
            "bn": "ইন্টার"
          },
          "shortNameTranslation": {}
        }
      },
      "awayTeam": {
        "name": "Barcelona",
        "slug": "barcelona",
        "shortName": "Barcelona",
        "gender": "M",
        "sport": {
          "name": "Football",
          "slug": "football",
          "id": 1
        },
        "userCount": 5797088,
        "nameCode": "BAR",
        "disabled": false,
        "national": false,
        "type": 0,
        "id": 2817,
        "country": {
          "alpha2": "ES",
          "alpha3": "ESP",
          "name": "Spain",
          "slug": "spain"
        },
        "subTeams": [],
        "teamColors": {
          "primary": "#154284",
          "secondary": "#9d1009",
          "text": "#9d1009"
        },
        "fieldTranslations": {
          "nameTranslation": {
            "ar": "برشلونة",
            "ru": "Барселона",
            "hi": "बार्सिलोना",
            "bn": "বার্সেলোনা"
          },
          "shortNameTranslation": {}
        }
      },
      "homeScore": {
        "current": 4,
        "display": 4,
        "period1": 2,
        "period2": 1,
        "normaltime": 3,
        "extra1": 1,
        "extra2": 0,
        "overtime": 1,
        "aggregated": 7
      },
      "awayScore": {
        "current": 3,
        "display": 3,
        "period1": 0,
        "period2": 3,
        "normaltime": 3,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "aggregated": 6
      },
      "time": {
        "injuryTime1": 1,
        "injuryTime2": 5,
        "injuryTime3": 3,
        "injuryTime4": 2,
        "currentPeriodStartTimestamp": 1746566511
      },
      "changes": {
        "changes": [
          "status.code",
          "status.description",
          "status.type"
        ],
        "changeTimestamp": 1746567557
      },
      "hasGlobalHighlights": false,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 1,
      "crowdsourcingDataDisplayEnabled": false,
      "id": 13513416,
      "varInProgress": {
        "homeTeam": false,
        "awayTeam": false
      },
      "slug": "wqf3-wqf4",
      "previousLegEventId": 13513414,
      "startTimestamp": 1746558000,
      "finalResultOnly": false,
      "feedLocked": true,
      "isEditor": false
    }
  ],
  "hasNextPage": true,
  "playedForTeamMap": {
    "12437521": 2817,
    "12437529": 2817,
    "12437534": 2817,
    "12437550": 2817,
    "12437570": 2817,
    "12437575": 2817,
    "12437633": 2817,
    "12437635": 2817,
    "12437743": 2817,
    "12437781": 2817,
    "12437806": 2817,
    "12437838": 2817,
    "12437859": 2817,
    "12437864": 2817,
    "12764006": 2817,
    "12764100": 2817,
    "13157479": 4698,
    "13157480": 4698,
    "13315898": 2817,
    "13318476": 2817,
    "13363913": 2817,
    "13466608": 2817,
    "13466669": 2817,
    "13511933": 2817,
    "13511934": 2817,
    "13513404": 2817,
    "13513405": 2817,
    "13513414": 2817,
    "13513416": 2817,
    "13637082": 2817,
    "13708595": 2817
  },
  "statisticsMap": {
    "12437521": {
      "rating": 7.3
    },
    "12437529": {
      "rating": 7.9
    },
    "12437534": {
      "rating": 7.1
    },
    "12437550": {
      "rating": 8
    },
    "12437570": {
      "rating": 8.7
    },
    "12437575": {
      "rating": 7.7
    },
    "12437633": {
      "rating": 7.8
    },
    "12437635": {
      "rating": 6.8
    },
    "12437743": {
      "rating": 7.9
    },
    "12437781": {
      "rating": 7.5
    },
    "12437806": {
      "rating": 6.4
    },
    "12437838": {
      "rating": 7.3
    },
    "12437859": {
      "rating": 8.1
    },
    "12437864": {
      "rating": 9
    },
    "12764006": {
      "rating": 8.2
    },
    "12764100": {
      "rating": 7.7
    },
    "13157479": {
      "rating": 6.7
    },
    "13157480": {
      "rating": 6.9
    },
    "13315898": {
      "rating": 8.6
    },
    "13318476": {
      "rating": 8.1
    },
    "13363913": {
      "rating": 8.1
    },
    "13466608": {
      "rating": 7.3
    },
    "13466669": {
      "rating": 8
    },
    "13511933": {
      "rating": 7
    },
    "13511934": {
      "rating": 8.4
    },
    "13513404": {
      "rating": 8.4
    },
    "13513405": {
      "rating": 6.2
    },
    "13513414": {
      "rating": 8.4
    },
    "13513416": {
      "rating": 8.7
    },
    "13637082": {
      "rating": 8.1
    },
    "13708595": {
      "rating": 8.1
    }
  },
  "incidentsMap": {
    "12437521": {
      "assists": 1
    },
    "12437550": {
      "goals": 1,
      "yellowCards": 1
    },
    "12437633": {
      "assists": 1
    },
    "12437743": {
      "yellowCards": 1
    },
    "12437859": {
      "assists": 1
    },
    "12764006": {
      "goals": 1
    },
    "13157480": {
      "goals": 1
    },
    "13315898": {
      "goals": 1,
      "assists": 1
    },
    "13318476": {
      "goals": 1
    },
    "13363913": {
      "goals": 1
    },
    "13466608": {
      "assists": 1
    },
    "13466669": {
      "assists": 1
    },
    "13511934": {
      "goals": 1,
      "assists": 1
    },
    "13513404": {
      "goals": 1
    },
    "13513414": {
      "goals": 1
    },
    "13708595": {
      "assists": 2
    }
  },
  "onBenchMap": {}
}

Get player details
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/player/1402912');
{
  "player": {
    "name": "",
    "firstName": "",
    "lastName": "",
    "slug": "",
    "shortName": "",
    "team": {
      "name": "",
      "slug": "",
      "shortName": "",
      "gender": "",
      "sport": {
        "id": 0,
        "slug": "",
        "name": ""
      },
      "tournament": {
        "name": "",
        "slug": "",
        "category": "",
        "uniqueTournament": "",
        "priority": "",
        "roundPrefix": "",
        "id": "",
        "isLive": ""
      },
      "primaryUniqueTournament": {
        "name": "",
        "slug": "",
        "primaryColorHex": "",
        "secondaryColorHex": "",
        "category": "",
        "userCount": "",
        "tennisPoints": "",
        "id": "",
        "country": "",
        "displayInverseHomeAwayTeams": "",
        "hasDownDistance": ""
      },
      "userCount": 0,
      "nameCode": "",
      "ranking": 0,
      "disabled": true,
      "national": true,
      "parentTeam": "",
      "type": 0,
      "id": 0,
      "country": {
        "alpha2": "",
        "name": ""
      },
      "teamColors": {
        "primary": "",
        "secondary": "",
        "text": ""
      },
      "wdlRecord": {
        "wins": 0,
        "draws": 0,
        "losses": 0
      }
    },
    "position": "",
    "jerseyNumber": "",
    "height": 0,
    "preferredFoot": "",
    "marketValue": 0,
    "retired": true,
    "userCount": 0,
    "deceased": true,
    "gender": "",
    "id": 0,
    "country": {
      "alpha2": "",
      "name": ""
    },
    "shirtNumber": 0,
    "dateOfBirthTimestamp": 0,
    "dateOfDeathTimestamp": 0,
    "contractUntilTimestamp": 0,
    "cricketPlayerInfo": "BaLH",
    "managerId": 0,
    "proposedMarketValue": 0,
    "proposedMarketValueRaw": {
      "value": 0,
      "currency": ""
    }
  }
}

Get player last events in a unique tournament
xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/player/1402912/unique-tournament/7/events/last/%7Bpage%7D');
Example:
{
  "events": [
    {
      "tournament": {
        "name": "",
        "slug": "",
        "category": {
          "name": "",
          "slug": "",
          "sport": "",
          "id": "",
          "flag": "",
          "alpha2": ""
        },
        "uniqueTournament": {
          "name": "",
          "slug": "",
          "primaryColorHex": "",
          "secondaryColorHex": "",
          "category": {
            "name": "",
            "slug": "",
            "sport": "",
            "id": "",
            "flag": "",
            "alpha2": ""
          },
          "userCount": 0,
          "groundType": "",
          "tennisPoints": 0,
          "crowdsourcingEnabled": true,
          "hasPerformanceGraphFeature": true,
          "id": 0,
          "country": {
            "alpha2": "",
            "name": ""
          },
          "hasEventPlayerStatistics": true,
          "hasBoxScore": true,
          "displayInverseHomeAwayTeams": true,
          "hasDownDistance": true
        },
        "priority": 0,
        "roundPrefix": "",
        "id": 0,
        "isLive": true
      },
      "roundInfo": {
        "round": 0,
        "name": "",
        "slug": "",
        "cupRoundType": 0
      },
      "customId": "",
      "status": {
        "code": 0,
        "description": "",
        "type": "notstarted"
      },
      "winnerCode": 0,
      "aggregatedWinnerCode": 0,
      "homeTeam": {
        "name": "",
        "slug": "",
        "shortName": "",
        "gender": "",
        "sport": {
          "id": 0,
          "slug": "",
          "name": ""
        },
        "userCount": 0,
        "playerTeamInfo": {
          "nickname": "",
          "id": 0
        },
        "nameCode": "",
        "ranking": 0,
        "disabled": true,
        "national": true,
        "parentTeam": "",
        "type": 0,
        "id": 0,
        "country": {
          "alpha2": "",
          "name": ""
        },
        "subTeams": [],
        "teamColors": {
          "primary": "",
          "secondary": "",
          "text": ""
        },
        "wdlRecord": {
          "wins": 0,
          "draws": 0,
          "losses": 0
        }
      },
      "awayTeam": {
        "name": "",
        "slug": "",
        "shortName": "",
        "gender": "",
        "sport": {
          "id": 0,
          "slug": "",
          "name": ""
        },
        "userCount": 0,
        "playerTeamInfo": {
          "nickname": "",
          "id": 0
        },
        "nameCode": "",
        "ranking": 0,
        "disabled": true,
        "national": true,
        "parentTeam": "",
        "type": 0,
        "id": 0,
        "country": {
          "alpha2": "",
          "name": ""
        },
        "subTeams": [],
        "teamColors": {
          "primary": "",
          "secondary": "",
          "text": ""
        },
        "wdlRecord": {
          "wins": 0,
          "draws": 0,
          "losses": 0
        }
      },
      "homeScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "period3": 0,
        "period4": 0,
        "period5": 0,
        "period6": 0,
        "period7": 0,
        "period1TieBreak": 0,
        "period2TieBreak": 0,
        "period3TieBreak": 0,
        "period4TieBreak": 0,
        "period5TieBreak": 0,
        "point": "",
        "normaltime": 0,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 0,
        "aggregated": 0,
        "series": 0,
        "innings": {
          "inning1": "",
          "inning2": "",
          "inning3": "",
          "inning4": "",
          "inning5": "",
          "inning6": "",
          "inning7": "",
          "inning8": "",
          "inning9": "",
          "inning10": ""
        },
        "inningsBaseball": {
          "run": 0,
          "hits": 0,
          "errors": 0,
          "score": 0,
          "wickets": 0,
          "overs": 0,
          "runRate": 0,
          "targetRunRate": 0,
          "inningDeclare": 0,
          "powerplay1": 0,
          "battingPowerplay": 0,
          "thirdPowerplay": 0
        }
      },
      "awayScore": {
        "current": 0,
        "display": 0,
        "period1": 0,
        "period2": 0,
        "period3": 0,
        "period4": 0,
        "period5": 0,
        "period6": 0,
        "period7": 0,
        "period1TieBreak": 0,
        "period2TieBreak": 0,
        "period3TieBreak": 0,
        "period4TieBreak": 0,
        "period5TieBreak": 0,
        "point": "",
        "normaltime": 0,
        "extra1": 0,
        "extra2": 0,
        "overtime": 0,
        "penalties": 0,
        "aggregated": 0,
        "series": 0,
        "innings": {
          "inning1": "",
          "inning2": "",
          "inning3": "",
          "inning4": "",
          "inning5": "",
          "inning6": "",
          "inning7": "",
          "inning8": "",
          "inning9": "",
          "inning10": ""
        },
        "inningsBaseball": {
          "run": 0,
          "hits": 0,
          "errors": 0,
          "score": 0,
          "wickets": 0,
          "overs": 0,
          "runRate": 0,
          "targetRunRate": 0,
          "inningDeclare": 0,
          "powerplay1": 0,
          "battingPowerplay": 0,
          "thirdPowerplay": 0
        }
      },
      "coverage": 0,
      "time": {
        "current": 0,
        "period1": 0,
        "period2": 0,
        "period3": 0,
        "period4": 0,
        "period5": 0,
        "overtime": 0,
        "penalties": 0,
        "played": 0,
        "periodLength": 0,
        "overtimeLength": 0,
        "totalPeriodCount": 0,
        "injuryTime1": 0,
        "injuryTime2": 0,
        "injuryTime3": 0,
        "injuryTime4": 0,
        "initial": 0,
        "max": 0,
        "extra": 0,
        "currentPeriodStartTimestamp": 0
      },
      "changes": {
        "changes": [],
        "changeTimestamp": 0
      },
      "hasGlobalHighlights": true,
      "hasXg": true,
      "hasEventPlayerStatistics": true,
      "hasEventPlayerHeatMap": true,
      "detailId": 0,
      "crowdsourcingDataDisplayEnabled": true,
      "id": 0,
      "parentEventId": 0,
      "previousLegEventId": 0,
      "startTimestamp": 0,
      "endTimestamp": 0,
      "slug": "",
      "periods": [],
      "lastPeriod": "",
      "finalResultOnly": true,
      "groundType": "",
      "isAwarded": true,
      "deletedAtTimestamp": 0
    }
  ],
  "hasNextPage": true,
  "playedForTeamMap": {},
  "statisticsMap": {},
  "incidentsMap": {},
  "onBenchMap": {}
}

Hiermit bekommst du die Daten eines Spielers eines Events

xhr.open('GET', 'https://sofascore-sport-api.p.rapidapi.com/api/event/14566662/player/839956/statistics');
Example:
{
  "player": {
    "name": "Erling Haaland",
    "slug": "erling-haaland",
    "shortName": "E. Haaland",
    "position": "F",
    "jerseyNumber": "9",
    "height": 194,
    "userCount": 772698,
    "gender": "M",
    "sofascoreId": "EHaaland",
    "id": 839956,
    "marketValueCurrency": "EUR",
    "dateOfBirthTimestamp": 964137600,
    "proposedMarketValueRaw": {
      "value": 196000000,
      "currency": "EUR"
    },
    "fieldTranslations": {
      "nameTranslation": {
        "ar": "إيرلينغ هالاند",
        "hi": "एर्लिंग हालैंड",
        "bn": "এরলিং হালান্ড"
      },
      "shortNameTranslation": {
        "ar": "إ. هالاند",
        "hi": "ई. हालैंड",
        "bn": "ই. হালান্ড"
      }
    }
  },
  "team": {
    "name": "Manchester City",
    "slug": "manchester-city",
    "shortName": "Man City",
    "gender": "M",
    "sport": {
      "name": "Football",
      "slug": "football",
      "id": 1
    },
    "userCount": 3403152,
    "nameCode": "MCI",
    "disabled": false,
    "national": false,
    "type": 0,
    "id": 17,
    "teamColors": {
      "primary": "#66ccff",
      "secondary": "#ffffff",
      "text": "#ffffff"
    },
    "fieldTranslations": {
      "nameTranslation": {
        "ar": "مانشستر سيتي",
        "ru": "Манчестер Сити",
        "hi": "मेनचेस्टर सिटी ऍफ़सी"
      },
      "shortNameTranslation": {
        "ar": "مان سيتي",
        "hi": "मैन सिटी",
        "bn": "ম্যান সিটি"
      }
    }
  },
  "statistics": {
    "totalPass": 16,
    "accuratePass": 13,
    "goalAssist": 0,
    "accurateOwnHalfPasses": 5,
    "totalOwnHalfPasses": 5,
    "accurateOppositionHalfPasses": 8,
    "totalOppositionHalfPasses": 11,
    "aerialWon": 1,
    "duelLost": 1,
    "duelWon": 3,
    "totalContest": 1,
    "wonContest": 1,
    "bigChanceCreated": 1,
    "shotOffTarget": 1,
    "onTargetScoringAttempt": 3,
    "goals": 1,
    "totalClearance": 1,
    "wasFouled": 1,
    "fouls": 1,
    "minutesPlayed": 86,
    "touches": 25,
    "rating": 7.9,
    "possessionLostCtrl": 3,
    "expectedGoals": 0.7949,
    "expectedGoalsOnTarget": 0.4132,
    "expectedAssists": 0.162847,
    "topSpeed": 31.788,
    "kilometersCovered": 9.25939,
    "numberOfSprints": 18,
    "keyPass": 1,
    "ratingVersions": {
      "original": 7.9,
      "alternative": 8.1
    },
    "totalShots": 4,
    "shotValueNormalized": 0.48,
    "passValueNormalized": 0.15,
    "dribbleValueNormalized": 0.33,
    "defensiveValueNormalized": -0.01,
    "metersCoveredWalkingKm": 3.11,
    "metersCoveredJoggingKm": 3.98,
    "metersCoveredRunningKm": 1.11,
    "metersCoveredHighSpeedRunningKm": 0.64,
    "metersCoveredSprintingKm": 0.41,
    "statisticsType": {
      "sportSlug": "football",
      "statisticsType": "player"
    }
  },
  "position": "F"
}
