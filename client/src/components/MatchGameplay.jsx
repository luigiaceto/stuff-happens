import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ProgressBar, Container, Row, Alert, Badge, Button, Card, Form, Col } from 'react-bootstrap';
import { Hand, SituationCard } from './Cards.jsx';

function MatchGameplay({user}) {
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
  const handleNextCard = () => {
    setMessage('');
    setSelectedPosition(-1);
    setTableCard({ id: 5, name: 'Situation 5', misfortune_index: 56, img_path: 'a' });
    
  }

  // gestisce il guess di una carta, viene chiamata allo scadere del 
  // timer o al click del pulsante
  const handleGuess = () => {
    
    if (true) {
      setHandCards(prevHand => {
        const complete_card = { id: 4, name: 'Situation 4', misfortune_index: 12, img_path: 'a' };
        const newHand = [...prevHand, complete_card];
        newHand.sort((a, b) => a.misfortune_index - b.misfortune_index);
        return newHand;
      });
      setMessage({type: 'success', msg: `Guess corretta`});
    } else if (true) {
      setLostCards(prev => prev + 1);
      setMessage({type: 'danger', msg: `Guess sbagliata`});
    } else if (true) {
      navigate(`/match/${matchId}/end`, {
        state: {
          collected_situations: handCards,
          match_result: {type: 'success', msg: 'Match won'}}
      });
    } else if (true) {
      navigate(`/match/${matchId}/end`, {
        state: {
          collected_situations: handCards,
          match_result: {type: 'danger', msg: 'Match lost'}
        }
      });
    }    
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
        <Button variant="success" size="lg" className="w-100 py-3 mb-3" onClick={handleNextCard}>
          Prossima carta
        </Button>}
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

  // Effetto che gestisce il timer ogni 500ms
  useEffect(() => {
    if (!running) return;

    const intervalId = setInterval(() => {
      setElapsed(prev => {
        if (prev >= 59) {
          clearInterval(intervalId);
          setRunning(false); // ferma il timer
          handleGuess();      // chiama la callback
          return 60;
        }
        return prev + 1;
      });
    }, 500);

    // Pulisce l’intervallo se running cambia o il componente si smonta
    return () => clearInterval(intervalId);
  }, [running]);

  // Fa partire il timer al mount
  useEffect(() => {
    setElapsed(0);
    setRunning(true);
  }, []); // solo al mount

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