import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function MatchGameplay({user}) {
  const [matchId, setMatchId] = useState('');
  const [handCards, setHandCards] = useState('');
  const [tableCard, setTableCard] = useState('');
  const [message, setMessage] = useState('');
  const [lostCards, setLostCards] = useState(0);

  useEffect(() => {
    const location = useLocation();
    const { matchId, startingSituations, tableSituation } = location.state;
    setMatchId(matchId);
    setHandCards(startingSituations);
    setTableCard(tableSituation);
  }, []);



  return (

  );
}

export function GuessSelector({setMessage, handCards}) {
  const [selectedPosition, setSelectedPosition] = useState('');
    
  const handlePositionChange = (e) => {
    const newPosition = e.target.value;
    setSelectedPosition(newPosition);
    setMessage('');
  };

  const handleSubmit = () => {
    
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
                <option value="">Seleziona una posizione...</option>
                {matchAnimals.map((animal) => (
                  <option key={animal.animal_id} value={animal.animal_id}>{animal.name}</option>
                ))}
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
      {matchAnimals.map(situation => (
        <Card situation={situation}/>
      ))}
    </Row>
  );
}

function Card({situation}) {
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