import { useState } from 'react';
import { useLocation } from 'react-router';
import { ProgressBar, Container, Row, Alert, Badge, Button, Card, Form } from 'react-bootstrap';

function MatchGameplay({user}) {
  const [matchId, setMatchId] = useState('');
  const [handCards, setHandCards] = useState('');
  const [tableCard, setTableCard] = useState('');
  const [message, setMessage] = useState('');
  const [lostCards, setLostCards] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(-1);

  // carica i dati iniziali della partita nello stato
  useEffect(() => {
    const location = useLocation();
    const { matchId, startingSituations, tableSituation } = location.state;
    setMatchId(matchId);
    setHandCards(startingSituations);
    setTableCard(tableSituation);
  }, []);

  // gestisce la richiesta di una nuova carta da guessare
  const handleNextCard = () => {
    selectedPosition(-1);



    setMessage('');
  }

  // gestisce il guess di una carta, viene chiamata allo scadere del 
  // timer o al click del pulsante
  const handleGuess = (position) => {


  }

  return (
    <Container className="text-center">
      <h2>
        Carte perse <Badge bg="secondary">{lostCards}</Badge>
      </h2>
      {message && 
        <Row>
          <Alert variant={message.type}>{message.msg}</Alert>
        </Row>}
      {!message && <CountdownTimer onComplete={handleGuess}/>}
      {!message && <SituationCard situation={tableCard}/>}
      {message &&
        <Button variant="success" size="lg" className="w-100 py-3 mb-3" onClick={handleNextCard}>
          Prossima carta
        </Button>}
      {!message && 
        <GuessSelector 
          setMessage={setMessage} 
          handCards={handCards} 
          selectedPosition={selectedPosition} 
          setSelectedPosition={setSelectedPosition}
          handleSubmit={handleGuess}/>}
      <Hand situations={handCards}/>
    </Container>
  );
}

const CountdownTimer = ({ onComplete }) => {
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
          onComplete();      // chiama la callback
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
      striped 
      variant="info"
    />
  );
};

export function GuessSelector({handCards, selectedPosition, setSelectedPosition, handleSubmit}) {
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
          <Card.Title className="mb-4">Seleziona la posizione nella tua mano in cui mettere la carta sul tavolo</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Posizione</Form.Label>
              <Form.Select value={selectedPosition} onChange={handlePositionChange}>
                <option value={-1}>Nessuna</option>
                {generateOptions()}
              </Form.Select>
            </Form.Group>
          </Form>
            
          {selectedPosition && 
            <Button variant="primary mt-2 me-3" onClick={() => handleSubmit()}>
              Confirm guess
            </Button>}
        </Card.Body>
      </Card>
    </Container>
  );
}

function Hand({situations}) {
  return (
    <Row className="g-2">
      {situations.map(situation => (
        <SituationCard situation={situation}/>
      ))}
    </Row>
  );
}

function SituationCard({situation}) {
  return (
    <Card className="h-100" style={{ maxWidth: '120px', margin: '0 auto' }}>
      <div className="position-relative" style={{ paddingBottom: '100%' }}>
        <Card.Img
          variant="top"
          src={`http://localhost:3001${situation.img_path}`}
          className="position-absolute w-100 h-100"
          style={{ objectFit: 'cover', top: 0, left: 0 }}
        />
      </div>
      <Card.Body className="p-2 text-center">
        <Card.Title>{situation.name}</Card.Title>
        {situation.misfortune_index && <Card.Text>{situation.misfortune_index}</Card.Text>}
      </Card.Body>
    </Card>
  )
}

export default MatchGameplay;