[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della sfortuna"
## Student: s343860 ACETO LUIGI 

## React Client Application Routes

- `/`: home dell'app (landing page)
- `/user/:userId/profile`: profilo dell'utente loggato, mostra la cronologia delle partite giocate dall'utente con id nel DB pari a userId
- `/match/new`: pagina con regole del gioco, permette di iniziare effettivamente una partita (demo o non demo)
- `/match/:matchId/play`: pagina in cui viene giocata la partita con id nel DB pari a matchId
- `/match/:matchId/end`: pagina su cui si viene rediretti dopo la fine della partita con id nel DB pari a matchId
- `/login`: pagina per eseguire il login di un utente riempendo dei campi
- `*`: pagina che rappresenta una route a cui non è associata nessuna pagina. Quando si inserisce nell'URL una route non uguale a una di quelle appena elencate si viene rediretti a '*'

## API Server

### __Inizia una partita__
URL: `/api/matches/new`

HTTP Method: POST

Description: inserisce un nuovo match nel DB. Usa la sessione per ottenere l'user nel caso il giocatore sia loggato.

Request body: Nessuno

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

Request body: Nessuno

Response: `200 Ok` (success), `404 Not found` (wrong match_id), `500 Internal Server Error` (generic error), `401 Not Authorized`.

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

Request body: Nessuno

Response: `200 Ok` (success), `500 Internal Server Error`, `401 Not Authorized`.

Response body:
```
[
  {
    "match_id": 1234,
    "match_result": "Vittoria"/"Sconfitta",
    "card_collected": 4,
    "date": "2025-05-23",
    "match_situations": [
      {
        "id": 1
        "name": "Dimentichi il caricabatterie del telefono in hotel",
        "round": 2,
        "result": "Vinta"/"Persa"
      },
      ...
    ]
  },
  ...
]
```

### __Login utente__
URL: `/api/sessions`

HTTP Method: POST

Description: permette ad un utente di effettuare il login. Si crea una sessione
che permette al server di reperire l'id utente senza mandarlo nel body delle 
richieste e il client potrà avere accesso alle routes protette da autenticazione.

Request body: 
```
{
  username: 'stu@gmail.com',
  password: 'stuuuuuu'
}
```

Response: `401 Unauthorized`, `201 Success`.


Response body:
```
{
  id: 1,
  email: 'stu@gmail.com',
  name: 'Stu',
  profile_pic: '/pp/stu.jpg'
}
```


### __Check sessione attiva__
URL: `/api/sessions/current`

HTTP Method: POST

Description: permette il controllo di sessione per vedere se l'utente
è loggato.

Request body: Nessuno

Response: `401 Unauthorized`, `201 Success`.

Response body:
```
{
  id: 1,
  email: 'stu@gmail.com',
  name: 'Stu',
  profile_pic: '/pp/stu.jpg'
}
```

### __Logout utente__
URL: `/api/sessions/current`

HTTP Method: DELETE

Description: permette ad un utente loggato di eseguire il logout

Request body: Nessuno

Response: `200 Ok` (success), `500 Internal Server Error`.

Response body: Nessuno

## Database Tables

| `situation` |
|-------------|
| **id** (int) |
| name (string) |
| misfortune_index (real) |
| img_path (string) |

| `match` |
|---------|
| **id** (int) |
| user_id (int) |
| result (string) |
| round (int) |
| date (string) |
| terminated (string) |

| `situation_in_match` |
|----------------------|
| **situation_id** (int) |
| **match_id** (int) |
| round (int) |
| result (string) |
| timestamp (string) |

| `user` |
|--------|
| **id** (int) |
| name (string) |
| email (string) |
| password (string) |
| salt (string) |
| profile_pic (string) |

Nota: la tabella situation_in_match rappresenta la relazione che lega ogni match alle carte presenti in esso.

## Main React Components

- `LoginForm` in *AuthComponents.jsx* -> form che permette all'utente di eseguire il login
- `Hand` in *Cards.jsx* -> renderizza un gruppo di carte (situazioni), usato per renderizzare la mano alla fine di ogni round
- `GuessHand` in *Cards.jsx* -> renderizza un gruppo di carte (situazioni) insieme a dei placeholder per selezionare la posizione in cui inserire la nuova carta, inoltre renderizza un bottone usato per confermare la scelta
- `CountDownTimer` in *MatchGameplay.jsx* -> renderizza un timer di 30s che forza il giocatore a fare una scelta in questo lasso di tempo. Se il giocatore non conferma la scelta entro 30s il round è automaticamente perso
- `DefaultLayout` in *DefaultLayout.jsx* -> renderizza il default layout dell'app che comprende la navbar, messaggio di benvenuto e il footer
- `HomeMenu` in *Home.jsx* -> renderizza la pagina home dell'app, contiene il tasto per spostarsi nella pagina di rulings, per iniziare a giocare, e qualche scritta 
- `MatchRulings` in *MatchRulings.jsx* -> renderizza la pagina per iniziare effettivamente una partita. Comprende il regolamento e il tasto per iniziare un match (demo o non)
- `MatchGameplay` in *MatchGameplay.jsx* -> renderizza la partita vera e propria che comprende timer, mano e carta sul tavolo nonchè messaggi che avvisano sul risultato della guess
- `MatchEnd` in *MatchEnd.jsx* -> renderizza la pagina di fine match con carte collezionate e messaggio di vittoria/sconfitta, nonchè tasto per giocare una nuova partita
- `NavHeader` in *NavHeader.jsx* -> renderizza il navigation header dell'app, comprende il tasto per andare in home, quello per andare sul profilo utente e quello per accedere alla pagina in cui effettuare il login (oppure se si è loggati diventa il tasto per fare logout)
- `NotFound` in *NotFound.jsx* -> renderizza la semplice pagina 404 quando si inserisce una route non esistente dell'applicazione come URL
- `UserProfile` in *UserInfo.jsx* -> renderizza la pagina del profilo utente, ci si può accedere solo se loggati e mostra il nome utente insieme ad una lista ad espansione delle partite giocate ordinate cronologicamente

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- Sebulba - sebulba@gmail.com, pass: ciao25
- Luigi - luigi@gmail.com, pass: stustu
