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

Description: insert a new match into the DB. Uses the session to retrieve the user in case the player is logged-in.

Request body:
```
{
  "demo": "Yes"/"No"
}
```

Response: `201 Created` (success), `503 Service Unavailable` (generic error), `422 Unprocessable Entity` (validation error).

Response body: 
```
{
  "match_id": 1234,
  "starting_situations": [
    {
      "id": 1
      "name": "Dimentichi il caricabatterie del telefono in hotel",
      "misfortune_index": 34.6,
      "img_path": "/img/sit1.jpg"
    },
    ...
  ],
  "table_situation": {
    "id": 2,
    "name": "Il wifi dell'hotel è lentissimo",
    "img_path": "/img/sit2.jpg"
  }
}
```

### __Get a new situation for a match__
URL: `/api/matches/:matchId/situation` (user must be logged-in)

HTTP Method: GET

Description: get a new card from the deck that the player will guess the position of.

Request body: None

Response: `200 Ok` (success), `404 Not found` (wrong match_id), `500 Internal Server Error` (generic error).

Response body:
```
{
  "id": 1
  "name": "Dimentichi il caricabatterie del telefono in hotel",
  "img_path": "/img/sit1.jpg"
}
```

### __Guess card position__
URL: `/api/matches/:matchId/guess`

HTTP Method: POST

Description: make a guess for the card position. The position starts from 0 and goes up to N (actual cards in hand), e.g. if I wanna guess a card between the first and second card in my hand I should send 1. If I wanna gues the card as the first in hand I should send 0, and if I wanna guess the last card then I'll send N. In case no position in chosen, send -1.

Request body:
```
{
  "match_id": 1234,
  "guessed_situation_id": 1,
  "guessed_position": 2,
  "match_situations": [
    {
      "id": 1
      "name": "Dimentichi il caricabatterie del telefono in hotel",
      "misfortune_index": 34.6,
      "img_path": "/img/sit1.jpg"
    },
    ...
  ]
}
```

Response: `201 Created` (success), `404 Not Found` (wrong match id), or `503 Service Unavailable` (generic error),`422 Unprocessable Entity` (validation error).

Response body:
```
{
  "match_state": "in_progress"/"won"/"lost"
  "guess_result": "correct"/"wrong",
  "complete_situation": {
    "id": 1
    "name": "Dimentichi il caricabatterie del telefono in hotel",
    "misfortune_index": 34.6,
    "img_path": "/img/sit1.jpg"
  }
}
```

Note: if the guess isn't correct, then the "complete_situation" field will be empty.

### __Get the match history for a user__
URL: `/api/users/:userId/matches` (user must be logged-in)

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
        "name": "Dimentichi il caricabatterie del telefono in hotel",
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

| `situation` |
|-------------|
| id (int) |
| name (string) |
| misfortune_index (real) |
| img_path (string) |

| `match` |
|---------|
| id (int) |
| user_id (int) |
| result (string) |
| round (int) |
| date (string) |
| terminated (string) |

| `situation_in_match` |
|----------------------|
| situation_id (int) |
| match_id (int) |
| round (int) |
| result (string) |
| timestamp (string) |

| `user` |
|--------|
| id (int) |
| name (string) |
| email (string) |
| password (string) |
| salt (string) |

## Main React Components

Idea: pagina di new match in cui ho la funzione per fare fetch dal server delle carte iniziali sul click di inizio che poi passa con navigate queste carte alla pagina per giocare che le recupera con useLocation e le mette nello stato (volendo con useEffect ma non serve). A fine match viene mostrata la roba e posso poi con un tasto tornare alla pagina di rulings per iniziare una nuova partita.

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- Luigi - luigi@gmail.com, pass: ciaociao
- Stu - stu@gmail.com, pass: stustu
