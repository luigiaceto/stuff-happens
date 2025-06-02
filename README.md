[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della sfortuna"
## Student: s343869 ACETO LUIGI 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

### __Starting a match__
URL: `/api/matches/new`

HTTP Method: POST

Description: insert a new match into the DB.

Request body:
```
{
  "user_id": 23
}
```

Response: `201 Created` (success), `503 Service Unavailable` (generic error), `422 Unprocessable Entity` (validation error).

Response body: 
```
{
  "match_id": 1234,
  "situations": [
    {
      "id": 1
      "name": "Trovo numeri complessi allo scritto di analisi I",
      "misfortune_index": 34.6,
      "img_path": "/img/trovo_numeri_complessi_allo_scritto_di_analisiI.jpg"
    },
    ...
  ]
}
```

### __Get a new card to guess for the round__
URL: `/api/matches/:matchId/situation`

HTTP Method: GET

Description: get a new card from the deck that the player will guess the position of.

Request body: None

Response: `200 Ok` (success), `404 Not found` (wrong match_id), `500 Internal Server Error` (generic error).

Response body:
```
{
  "id": 1
  "name": "Trovo numeri complessi allo scritto di analisi I",
  "img_path": "/img/trovo_numeri_complessi_allo_scritto_di_analisiI.jpg"
}
```

### __Guess card position__
URL: `/api/matches/:matchId/guess`

HTTP Method: POST

Description: make a guess for the card position. If the guess i correct the body contains its misfortune index, otherwise the response body will be empty. The position starts from 0 and goes up to N (actual cards in hand), e.g. if I wanna guess a card between the first and second card in my hand I should send 1. If I wanna gues the card as the first in hand I should send 0, and if I wanna guess the last card then I'll send N. In case no position in chosen, send -1.

Request body:
```
{
  "match_id": 1234,
  "guessed_position": 2,
  "match_situations": [
    {
      "id": 1
      "name": "Trovo numeri complessi allo scritto di analisi I",
      "misfortune_index": 34.6,
      "img_path": "/img/trovo_numeri_complessi_allo_scritto_di_analisiI.jpg"
    },
    ...
  ],
  "guessed_situation_id": 1,
  "round": 4
}
```

Response: `201 Created` (success), `404 Not Found` (wrong match id), or `503 Service Unavailable` (generic error),`422 Unprocessable Entity` (validation error).

Response body:
```
{
  "id": 1
  "name": "Trovo numeri complessi allo scritto di analisi I",
  "misfortune_index": 34.6,
  "img_path": "/img/trovo_numeri_complessi_allo_scritto_di_analisiI.jpg"
}
```

Note: if the guess isn't correct, then the response body will be empty.

### __End the match__
URL: `/api/matches/:matchId/end`

HTTP Method: PATCH

Description: conclude the match modifying the match entry in the DB. In case of anonimous user, send -1 in the "user_id" field.

Request body:
```
{
  "result": "Win"/"Lose",
  "user_id": 23
}
```

Response: `200 Ok` (success), `404 Not Found` (wrong match id), or `503 Service Unavailable` (generic error), `422 Unprocessable Entity` (validation error).

Response body: None

### __Get the match history for a user__
URL: `/api/users/:userId/matches`

HTTP Method: GET

Description: get the matches of a user with the informations about the situations involved in.

Request boy: None

Response: `200 Ok` (success), `500 Internal Server Error`.

Response body:
```
[
  {
    "match_id": 1234,
    "match_result": "Win"/"Lose",
    "card_collected": 4,
    "date": "2025-05-23",
    "match_situations": [
      {
        "id": 1
        "name": "trovo numeri complessi allo scritto di analisi I",
        "misfortune_index": 34.6,
        "img_path": "/img/trovo_numeri_complessi_allo_scritto_di_analisiI.jpg",
        "round": 2,
        "result": "Won"/"Lost"
      },
      ...
    ]
  },
  ...
]
```

## Database Tables

| `Situation` |
|-------------|
| id (int) |
| name (string) |
| misfortune_index (real) |
| img_path (string) |

| `Match` |
|---------|
| id (int) |
| user_id (int) |
| result (string) |
| date (string) |
| terminated (string) |

| `Situation_in_match` |
|----------------------|
| situation_id (int) |
| match_id (int) |
| round (string) |
| result (string) |

| `User` |
|--------|
| id (int) |
| name (string) |
| email (string) |
| password (string) |
| salt (string) |

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- Luigi - luigi@gmail.com, pass: ciaociao
- Stu - stu@gmail.com, pass: stustu
