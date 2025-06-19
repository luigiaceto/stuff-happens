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
    const matchInfo = await API.startMatch();
    setLoading(false);
    if (matchInfo.error) {
      setMessage({msg: 'Ops, il server ha riscontrato un errore. Riprova', type: 'danger'});
      return;
    }
    const { match_id, starting_situations, table_situation } = matchInfo;
    const demo = loggedIn === true ? false : true;
    navigate(`/match/${match_id}/play`, {
      state: {
        matchId: match_id,
        startingSituations: starting_situations.sort((a, b) => a.misfortune_index - b.misfortune_index),
        tableSituation: table_situation,
        demo: demo
      }
    });
  }

  return (
    <Container className='mt-3'>
      {message && 
        <Alert className="w-50 text-center mx-auto" variant={message.type}>
          {message.msg}
        </Alert>}
      <Container className='glass-card'>
        <h2 className='mt-3 text-center'>📖Regolamento</h2>  
        <ul>
          <li>Inizierai con 3 carte in mano di cui conoscerai l'indice di sfortuna</li>
          <li>Ogni round ti verrà proposta una nuova carta sul tavolo (nascondendo il suo indice di sfortuna)</li>
          <li>Avrai 30 secondi per posizionare la carta nella tua mano in ordine di indice di sfortuna</li>
          <li>Se non selezioni nulla perdi il round automaticamente, altrimenti se indovini guadagni la carta</li>
          <li>Lo scopo del gioco è arrivare ad avere 6 carte in mano</li>
          <li>Alla 3a carta non indovinata perdi la partita</li>
          {!loggedIn && <li>Ricordati di <strong>eseguire il login</strong> per avere accesso completo all'app, altrimenti potrai solo provare il gioco 
            tramite partite demo di un unico round 😖</li>}
        </ul>
      </Container>
      <h3 className='text-center mt-5'>Buon divertimento e buona (s)fortuna !</h3>
      <Container className="text-center">
        {!loading && 
          <AnimatedContent
            distance={150} 
            direction="vertical"
            duration={1}
            ease="power3.out"
          >
            <Button variant="success" size="lg" className="py-3 mb-3 mt-4 mx-auto basic-shadow" style={{ width: "200px" }} onClick={handleBegin}>
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