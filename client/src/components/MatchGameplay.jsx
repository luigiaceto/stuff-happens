import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ProgressBar, Container, Row, Alert, Badge, Button, Spinner } from 'react-bootstrap';
import { GuessHand, Hand, SituationCard } from './Cards.jsx';
import API from '../API.mjs';

function MatchGameplay() {
  const [matchId, setMatchId] = useState('');
  const [handCards, setHandCards] = useState([]);
  const [tableCard, setTableCard] = useState('');
  const [message, setMessage] = useState('');
  const [lostCards, setLostCards] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // carica i dati iniziali della partita nello stato
  useEffect(() => {
    const { matchId, startingSituations, tableSituation } = location.state;
    setMatchId(matchId);
    setHandCards(startingSituations);
    setTableCard(tableSituation);
  }, []);

  // gestisce la richiesta di una nuova carta da guessare
  const handleNextCard = async () => {
    setMessage('');
    setLoading(true);
    const nextSituation = await API.getNextSituation(matchId);
    setLoading(false);
    if (nextSituation.error) {
      navigate('/match/new', {
        state: {
          msg: 'Ops, il server ha riscontrato un errore. Riprova',
          type: 'danger'
        }
      });
    }
    setTableCard(nextSituation);
  }

  // gestisce il guess di una carta, viene chiamata allo scadere del 
  // timer o al click del pulsante
  const handleGuess = async (position) => {
    setLoading(true);
    const guessResult = await API.guessPosition(matchId, tableCard.id, position, handCards);
    setLoading(false);

    // non inserendo return dopo questi navigate allora
    // il navigate di fine partita sovrascrive quelli prima
    // che si attiva anche nel caso di errore del server
    if (guessResult.error) {
      navigate('/match/new', {
        state: {
          msg: 'Ops, il server ha riscontrato un errore. Riprova',
          type: 'danger'
        }
      });
      return;
    } else if (guessResult.cheatError) {
      console.log(guessResult);
      navigate('/match/new', {
        state: {
          msg: 'Ops, sembra tu stia cercando di imbrogliare o rompere il gioco. Riprova :)',
          type: 'danger'
        }
      });
      return;
    }

    let guess_message = {type: 'success', msg: 'Hai indovinato la posizione!'};
    // utilizzo una variabile aggiuntiva poichè nell'ultima guess il navigate parte
    // prima che il setHandCards venga eseguito. Dunque lo stato non verrebbe aggiornato
    // e l'ultima carta indovinata (in caso di vittoria) non verrebbe mostrata nella 
    // schermata finale (è un problema solo di frontend poichè nel DB la carta è stata già
    // aggiunta alla partita)
    let updatedHandCards = [...handCards];
    if (guessResult.guess_result === 'correct') {
      updatedHandCards = [...handCards, guessResult.complete_situation];
      updatedHandCards.sort((a, b) => a.misfortune_index - b.misfortune_index);
      setHandCards(updatedHandCards);
    } else {
      guess_message = {type: 'danger', msg: 'Hai sbagliato la posizione!'};
      setLostCards(prev => prev + 1);
    }
    
    if (guessResult.match_state !== 'in_progress') {
      let end_message = {type: 'success', msg: 'Partita vinta!'};
      if (guessResult.match_state === 'lost') {
        end_message = {type: 'danger', msg: 'Partita persa!'};
      }
      // per l'ultimo round non serve mostrare il risultato della guess:
      // - se la partita è vinta, allora l'ultima carta è stata indovinata
      // - se la partita è persa, allora l'ultima carta non è stata indovinata
      navigate(`/match/${matchId}/end`, {
        state: {
          collected_situations: updatedHandCards,
          end_message: end_message
        }
      });
    }

    setMessage(guess_message);
  }

  // si montano i componenti basandosi sia su loading che su message:
  // - loading poichè l'utente deve sapere quando il server sta ancora rispondendo
  // - message poichè non voglio mostrare certi componenti quando viene notificata
  //   sullo schermo la correttezza o meno della guess
  return (
    <Container fluid>
      <h2 className='ms-5'>
        Carte perse <Badge bg="secondary">{lostCards}</Badge>
      </h2>
      {message && 
        <Row>
          <Alert className="w-50 text-center mx-auto" variant={message.type}>{message.msg}</Alert>
        </Row>}
      {!message && !loading &&
        <Container className="w-25 mx-auto mt-2 glass-card py-3">
          <SituationCard situation={tableCard}/>
          <CountdownTimer handleGuess={handleGuess}/>
        </Container>}
      <Container fluid>
        {message && <Hand className="mt-4" situations={handCards}/>}
        {!message && <GuessHand handCards={handCards} handleGuess={handleGuess}/>}
      </Container>
      {message && !loading &&
        <div className="text-center mt-5">
          <Button variant="success" size="lg" className="w-25 py-3 mb-3 basic-shadow" onClick={handleNextCard}>
            Prossima carta
          </Button>
        </div>}
      {loading &&
        <div className="text-center mt-5">
          <Spinner animation="border" variant="success"/>
        </div>}
    </Container>
  );
}

const CountdownTimer = ({ handleGuess }) => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const intervalId = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 500);

    return () => clearInterval(intervalId);
  }, [running]);

  useEffect(() => {
    if (elapsed >= 60 && running) {
      setRunning(false);
      handleGuess(-1);
    }
  }, [elapsed, running]);

  const percentage = 100 - (elapsed / 60) * 100;

  return (
    <ProgressBar 
      now={percentage} 
      label={`${Math.ceil((30 - elapsed * 0.5))}s`} 
      animated 
      variant="success"
      className="mt-3"
    />
  );
};

export default MatchGameplay;