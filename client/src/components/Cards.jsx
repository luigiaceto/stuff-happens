import { Row, Card, Col, Button } from 'react-bootstrap';
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

export function GuessHand({ handCards, setSelectedPosition }) {
  const [selectedSlot, setSelectedSlot] = useState(null); // null o numero tra 0 e handCards.length

  const handleSlotClick = (index) => {
    setSelectedSlot(index);         // evidenzia lo slot
    setSelectedPosition(index);     // chiama la funzione di inserimento
  };

  return (
    <Row className="justify-content-center align-items-center g-2">
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
  );
}

function InsertSlot({ index, selected, onClick }) {
  return (
    <Button
      variant={selected ? 'primary' : 'outline-secondary'}
      size="sm"
      onClick={onClick}
      style={{
        height: '70px',
        width: '30px',
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