import { useNavigate, useLocation } from 'react-router';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import API from '../API.mjs';
import AnimatedContent from './reactbits_components/AnimatedContent.jsx';

function MatchStart({loggedIn}) {
  const navigate = useNavigate();
  const location = useLocation();
	const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

	// nel caso ci siano stati errori durante la partita 
	// si viene reindirizzati nella schermata di inizio 
	// partita con un messaggio di errore
  useEffect(() => {
    const {msg, type} = location.state ? location.state : {};
		if (msg && type) {
			setMessage({msg, type});
		}
  }, []);

  const handleBegin = async () => {
    setMessage('');
    setLoading(true);
    const matchInfo = await API.startMatch(loggedIn ? 'No' : 'Yes');
    setLoading(false);
    if (matchInfo.error) {
      setMessage({msg: 'Ops, il server ha riscontrato un errore. Riprova', type: 'danger'});
      return;
    }
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
      {message && 
        <Alert className="w-50 text-center mx-auto" variant={message.type}>
          {message.msg}
        </Alert>}
      <Container className='glass-card'>
        <h1 className='mt-3 text-center'>Regolamento</h1>  
        <ul>
          <li>Inizierai con 3 carte in mano di cui conoscerai l'indice di sfortuna</li>
          <li>Ogni round ti verrà proposta una nuova carta sul tavolo nascondendo l'indice di sfortuna</li>
          <li>Avrai 30 secondi per indovinarne la posizione, tra le carte della tua mano</li>
          <li>Per eseguire la scelta avrai a disposizione un selettore. Potrai selezionare una posizione da 1 ad n+1, dove n sono le carte
              che avrai in mano ad ogni round</li>
          <li>Se non selezioni nulla perdi il round automaticamente, altrimenti se indovini guadagni la carta</li>
          <li>Lo scopo del gioco è di arrivare a 6 carte in mano</li>
          <li>Alla 3a carta non indovinata perdi la partita</li>
          {!loggedIn && <li>Ricordati di *eseguire il login* per avere accesso completo all'app, altrimenti potrai solo provare il gioco 
            tramite partite demo di un solo round :)</li>}
        </ul>
        <p className='mt-4'> Esempio: se vuoi mettere la carta del tavolo come 1a (da sinistra) tra le carte nella tua mano seleziona 1, se 
          vuoi metterla come 2a nella tua mano seleziona 2 ... se vuoi metterla come ultima allora seleziona l'ultima posizione 
          disponibile</p>
      </Container>
      <h3 className='text-center mt-5'>Buon divertimento e buona (s)fortuna !</h3>
      <Container className="text-center">
        {!loading && 
          <AnimatedContent
            distance={150} 
            direction="vertical"
            reverse={false}
            duration={1}
            ease="power3.out"
            threshold={0.2}
            delay={0.1}
          >
            <Button variant="success" size="lg" className="w-25 py-3 mb-3 mt-4 mx-auto basic-shadow" onClick={handleBegin}>
              Inizia
            </Button>
          </AnimatedContent>}
        {loading && 
          <Spinner animation="border" variant="success"/>}
      </Container>

    </Container>
  )
}

export default MatchStart;