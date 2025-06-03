- nella route per iniziare la partita è sbagliato passare l'user_id nel body? E' sbagliato mandare body vuoto nel caso di utente non loggato?
->

- va bene gestire la validazione del timer con timestamp nel DB? Introducono ritardo che complica la validazione? Occorre mettere tipo 1 o mezzo secondo in più per evitare problemi?
->

- va bene che il client manda al server la lista di situazioni in mano quando deve guessare l'ordine? Oppure, visto che il server volendo potrebbe fare il retrieve della lista dal DB allora è una cosa ridondante? Lo faccio per far evitare al server di fare query aggiuntive che rallentino o comunque di cercare info che potrebbero essere mandate semplicemente dal client.
->

- E' brutta poichè asimmetrica la scelta di una nuova carta da mandare che invece sfrutta il DB (NOT IN) e il client non deve mandare le carte che ha già visto. Lo faccio così non costringo il client a salvarsi anche le carte che perde.
->

- E' ridondante che il server risponda alla guess corretta con tutto l'oggetto situations e non con solo l'index di sfortuna? Così può direttamente aggiungerlo allo stato che racchiude le carte nella sua mano senza andare ad aggiungere il campo index all'oggetto già esistente e POI andare ad aggiungerlo allo stato.
-> 

- il client potrebbe cheattare cambiando le carte e gli indici quindi dobbiamo fare attenzione a mandarle al server per guessare l'ordine?
->

- il server si può fidare del numero di round che gli manda il client?
->

- va bene o è ridontante salvare nella entry del match il round a cui ci troviamo?
->

- va bene se non mostriamo a che round ci troviamo nel client? ma magari mostriamo solo quante guess sbagliate abbiamo fatto (il client se le può segnare)
->

- va bene che il server quando risponde a una guess possa anche concludere la partita e quindi mandare un campo "opzionale" che dica se la partita è stata vinta/persa? In quel caso va bene che la partita si concluda subito mostrando le carte vinte senza mostrare la notifica della guess scorretta/corretta? Invece per la partita demo viene vista solo la prima risposta e basta.
->

- poi su questa route potrei richiedere un campo anon_user che mi consente di pulire il DB nel caso di partite demo? O non è richiesta la pulizia?
->

- va bene che le carte iniziali siano associate al round 0?
->

- il match può finire cosi': il server all'n-esima guess
 -- se è sbagliata vede se si è perso il round e nel caso manda la sconfitta
 -- se è giusta vede se si è vinto il round e nel caso manda la vittoria
