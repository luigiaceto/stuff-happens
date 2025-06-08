[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della sfortuna"
## Student: s343869 ACETO LUIGI 

## React Client Application Routes

- Route `/`: home dell'app (landing page)
- Route `/user/:userId/profile`: profilo dell'utente loggato, mostra la cronologia delle partite giocate dall'utente con id nel DB pari a userId
- Route `/match/new`: pagina con regole del gioco, permette di iniziare effettivamente una partita (demo o non demo)
- Route `/match/:matchId/play`: pagina in cui viene giocata la partita con id nel DB pari a matchId
- Route `/match/:matchId/end`: pagina su cui si viene rediretti dopo la fine della partita con id nel DB pari a matchId
- Route `/login`: pagina per eseguire il login di un utente
- Route `*`: pagina che rappresenta una route a cui non è associata nessuna pagina. Quando si inserisce nell'URL una route non uguale a quelle appena elencate si viene rediretti a '*'

## API Server

### __Inizia una partita__
URL: `/api/matches/new`

HTTP Method: POST

Description: inserisce un nuovo match nel DB. Usa la sessione per ottenere l'user nel caso il giocator sia loggato.

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

### __Indovina la posizione della carta sul tavolo__
URL: `/api/matches/:matchId/guess`

HTTP Method: POST

Description: fai una guess per la posizione della carta. La posizione inizia da 0 e arriva ad N (numero di carte in mano). Se non è stata selezionata nessuna posizione, mandare -1.

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

Note: se la guess è sbagliata, il campo "complete_situation" non viene mandato.

### __Ottieni una nuova situazione da indovinare__
URL: `/api/matches/:matchId/situation` (protected by user authentication)

HTTP Method: GET

Description: ottieni una nuova carta dal mazzo da indovinare.

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

### __Ottieni la cronologia di match giocati da un utente__ 
URL: `/api/users/:userId/matches` (protected by user authentication)

HTTP Method: GET

Description: per un utente, ottieni i match giocati con le relative informazioni sulle situazioni che sono comparse.

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

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- Luigi - luigi@gmail.com, pass: ciao25
- Stu - stu@gmail.com, pass: stustu
