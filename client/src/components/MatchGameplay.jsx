import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ProgressBar, Container, Row, Alert, Badge, Button, Card, Form, Col } from 'react-bootstrap';
import { Hand, SituationCard } from './Cards.jsx';
import API from '../API.mjs';

function MatchGameplay() {
  const [matchId, setMatchId] = useState('');
  const [handCards, setHandCards] = useState([]);
  const [tableCard, setTableCard] = useState('');
  const [message, setMessage] = useState('');
  const [lostCards, setLostCards] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(-1);
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
    setSelectedPosition(-1);
    const nextSituation = await API.getNextSituation(matchId);
    setTableCard(nextSituation);
  }

  // gestisce il guess di una carta, viene chiamata allo scadere del 
  // timer o al click del pulsante
  const handleGuess = async () => {
    const guessResult = await API.guessPosition(matchId, tableCard.id, selectedPosition, handCards);

    let guess_message = {type: 'success', msg: 'Hai indovinato la posizione!'};
    if (guessResult.guess_result === 'correct') {
      setHandCards(prevHand => {
        const newHand = [...prevHand, guessResult.complete_situation];
        newHand.sort((a, b) => a.misfortune_index - b.misfortune_index);
        return newHand;
      });
    } else {
      guess_message = {type: 'danger', msg: 'Hai sbagliato la posizione!'};
      setLostCards(prev => prev + 1);
    }
    
    if (guessResult.match_state !== 'in_progress') {
      let end_message = {type: 'success', msg: 'Partita vinta!'};
      if (guessResult.match_state === 'lost') {
        end_message = {type: 'danger', msg: 'Partita persa!'};
      }
      navigate(`/match/${matchId}/end`, {
        state: {
          collected_situations: handCards,
          end_message: end_message
        }
      });
    }

    setMessage(guess_message);
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2 className='ms-2'>
            Carte perse <Badge bg="secondary">{lostCards}</Badge>
          </h2>
        </Col>
        <Col className='mt-4'>
          {!message && <CountdownTimer handleGuess={handleGuess}/>}
        </Col>
      </Row>
      {message && 
        <Row>
          <Alert variant={message.type}>{message.msg}</Alert>
        </Row>}
      {!message && 
        <Alert variant="info" className="w-25 mx-auto mt-4">
          <SituationCard situation={tableCard}/>
        </Alert>}
      {message &&
        <div className="text-center">
          <Button variant="success" size="lg" className="w-25 py-3 mb-3" onClick={handleNextCard}>
            Prossima carta
          </Button>
        </div>}
      <Container className='mt-5'>
        <Hand situations={handCards}/>
        {!message && 
          <GuessSelector 
            setMessage={setMessage} 
            handCards={handCards} 
            selectedPosition={selectedPosition} 
            setSelectedPosition={setSelectedPosition}
            handleGuess={handleGuess}/>
        }
      </Container>
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

  /*
  // Fa partire il timer al mount
  useEffect(() => {
    setElapsed(0);
    setRunning(true);
  }, []);
  */

  useEffect(() => {
    if (elapsed >= 60 && running) {
      setRunning(false);
      handleGuess();
    }
  }, [elapsed, running]);

  const percentage = 100 - (elapsed / 60) * 100;

  return (
    <ProgressBar 
      now={percentage} 
      label={`${Math.ceil((30 - elapsed * 0.5))}s`} 
      animated 
      variant="success"
    />
  );
};

export function GuessSelector({handCards, selectedPosition, setSelectedPosition, handleGuess}) {
  const generateOptions = () => {
    const options = [];
    for (let i = 1; i <= handCards.length+1; i++) {
      options.push(
        <option key={i} value={i-1}>{i}</option>
      );
    }
    return options;
  };

  const handlePositionChange = (e) => {
    const newPosition = e.target.value;
    setSelectedPosition(newPosition);
  };

  return (
    <Container>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="mb-4">Seleziona la posizione nella tua mano (da sinistra) in cui mettere la carta del tavolo</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Select value={selectedPosition} onChange={handlePositionChange}>
                <option value={-1}>Nessuna</option>
                {generateOptions()}
              </Form.Select>
            </Form.Group>
          </Form>
            
          {selectedPosition && 
            <Button variant="primary mt-2 me-3" onClick={() => handleGuess()}>
              Conferma
            </Button>}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MatchGameplay;