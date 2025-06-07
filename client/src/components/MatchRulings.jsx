import { useNavigate } from 'react-router';
import { Container, Button } from 'react-bootstrap';
import API from '../API.mjs';

function MatchStart({loggedIn}) {
  const navigate = useNavigate();

  const handleBegin = async () => {
    const matchInfo = await API.startMatch(loggedIn ? 'No' : 'Yes');
    const { match_id, starting_situations, table_situation } = matchInfo;
    navigate(`/match/${match_id}/play`, {
      state: {
        matchId: match_id,
        startingSituations: starting_situations.sort((a, b) => a.misfortune_index - b.misfortune_index),
        tableSituation: table_situation
      }
    });
  }

  return (
    <Container>
      <h1 className='mt-3 text-center'>Regolamento</h1>  
      <ul>
        <li>Inizierai con 3 carte in mano ed una sul campo</li>
        <li>Lo scopo del gioco è di arrivare a 6 carte in mano, inserendone una alla volta dal tavolo seguendo l'ordine 
            crescente dell'indice di sfortuna (che dovrai immaginare per le carte del tavolo)</li> 
        <li>Ogni round avrai 30 secondi per 
            indovinare la posizione, tra le carte della tua mano</li>
        <li>Per eseguire la scelta avrai a disposizione un selettore. Potrai selezionare una posizione da 1 ad n+1, dove n sono le carte
            che avrai in mano ad ogni round</li>
        <li>Se non selezioni nulla
            perdi il round automaticamente, altrimenti se indovini guadagni la carta</li>
        <li>Se perdi 3 carte in totale la partita è persa complessivamente</li>
        {!loggedIn && <li>Ricordati di *eseguire il login* per avere accesso completo all'app, altrimenti potrai solo provare il gioco 
          tramite partite demo di un solo round :)</li>}
      </ul>
      <p className='mt-4'> Esempio: se vuoi rendere la carta sul tavolo la 1a (da sinistra) tra le carte nella tua mano seleziona 1, se 
        vuoi metterla come 2a nella tua mano seleziona 2 ... se vuoi metterla come ultima allora seleziona l'ultima posizione 
        disponibile</p>
      <h3 className='text-center'>Buon divertimento e buona (s)fortuna !</h3>
      <Container className="text-center">
        <Button variant="success" size="lg" className="w-25 py-3 mb-3 mt-5 mx-auto" onClick={handleBegin}>
          Inizia
        </Button>
      </Container>

    </Container>
  )
}

export default MatchStart;