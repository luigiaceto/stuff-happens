# Flusso partita
*Giocatore loggato*
- manda al server richiesta di creazione match e riceve le 3 carte
- si salva le carte nello stato
- schiacchia un tasto e manda richiesta per prossima carta che gli manda il server
- riceve la carta, cerca di indovinare la posizione e manda richiesta al server
- riceve risposta se la carta è corretta o meno e se la salva nello stato
- ...
- all' n-esima guess il client capisce dalla risposta del server se ha vinto o meno e manda richiesta la server di chiudere la partita

*Giocatore anonimo*
- manda al server richiesta di creazione match e riceve le 3 carte
- si salva le carte nello stato
- schiacchia un tasto e manda richiesta per prossima carta che gli manda il server
- riceve la carta, cerca di indovinare la posizione e manda richiesta al server
- riceve risposta se la carta è corretta o meno e capisce se ha vinto o perso
- manda richiesta al server per pulire le info nel DB che riguardano la partita demo appena conclusa

`Inizio partia` POST del client sul server. Il client riceve 3 carte ognuna come (id, nome, misfortune_index, immagine).

`n-esimo round` POST client clicca su *Prossima carta* e il server gli manda una carta casuale (id, nome, immagine) e ha 30s per collocare la carta appena vista tra due (o altrimenti all'inizio o fine) carte in mano. Allo scadere del timer viene viene inviata la richiesta al server che controlla se il posizionamento è corretto. In caso di successo viene inviata al client (id, nome, misfortune_index, immagine). Per generare la carta casuale si può includere nel body della richiesta la lista di carte viste fin'ora dal client da sottrarre a tutte le carte nel DB e poi prenderne una casuale da restituire al client. Inoltre c'è un campo opzionale che dice se la carta è stata posizionata bene o male.
Per la scelta della posizione si può pensare che date n carte ho (n-1)+2 posizioni possibili dunque possso fare un semplice selettore che mi fa selezionale dalla posizione 1 a n+1. Nel server quindi posso ciclare sulla lista di carte e vedere in quella posizione è effettivamente ordinata bene.

`fine match` avviene nella stessa POST dell'n-simo round quando il client ha indovinato la 6a carta oppure quando è la 3a carta che sbaglia. Nella risposta viene passato un campo opzionale che indica l'esito del match concluso. In caso di partita terminata quindi il server salva tutte le info di questa come entry "serializzando" le carte in una stringa da salvare nella tabella match.