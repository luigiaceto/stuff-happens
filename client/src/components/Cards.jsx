import { Row, Card, Col, Button, Container } from 'react-bootstrap';
import { useState, Fragment } from 'react';

export function Hand({situations}) {
  return (
    <Row className="g-1">
      {situations.map(situation => (
        <SituationCard key={situation.id} situation={situation}/>
      ))}
    </Row>
  );
}

export function SituationCard({situation}) {
  return (
    <Card className="h-100" style={{ width: '200px', height: '70px', margin: '0 auto' }}>
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

export function GuessHand({ handCards, handleGuess }) {
  const [selectedSlot, setSelectedSlot] = useState(-1); // null o numero tra 0 e handCards.length

  const handleSlotClick = (index) => {
    setSelectedSlot(index);         // evidenzia lo slot
    setSelectedPosition(index);     // chiama la funzione di inserimento
  };

  const handleConfirm = () => {
    handleGuess(selectedSlot);
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        {Array.from({ length: handCards.length + 1 }).map((_, index) => (
          <Fragment key={index}>
            <Col xs="auto">
              <InsertSlot
                index={index + 1}
                selected={selectedSlot === index}
                onClick={() => handleSlotClick(index)}
              />
            </Col>
            {index < handCards.length && (
              <Col xs="auto">
                <SituationCard situation={handCards[index]} />
              </Col>
            )}
          </Fragment>
        ))}
      </Row>
      <Container className="text-center">
        <Button variant="primary mt-2 me-3" onClick={handleConfirm}>
          Conferma
        </Button>
      </Container>
    </Container>
  );
}

function InsertSlot({ index, selected, onClick }) {
  return (
    <Button
      variant={selected ? 'primary' : 'outline-secondary'}
      onClick={onClick}
      style={{
        height: '70px',
        width: '40px',
        padding: 0,
        borderStyle: 'dashed',
        fontWeight: selected ? 'bold' : 'normal',
      }}
      title={`Inserisci alla posizione ${index}`}
    >
      {index}
    </Button>
  );
}