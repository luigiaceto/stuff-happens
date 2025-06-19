import { Row, Card, Col, Button, Container } from 'react-bootstrap';
import { useState, Fragment } from 'react';

export function Hand({situations}) {
  return (
    <Container fluid className="mt-3">
      <Row className="justify-content-center align-items-center">
        {situations.map((situation) => (
          <Fragment key={situation.id}>
            <Col xs="auto">
              <SituationCard situation={situation} />
            </Col>
          </Fragment>
        ))}
      </Row>
    </Container>
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
        <Card.Title className="fs-6">{situation.name}</Card.Title>
        {situation.misfortune_index && <Card.Text>{situation.misfortune_index}</Card.Text>}
      </Card.Body>
    </Card>
  )
}

export function GuessHand({ handCards, handleGuess }) {
  const [selectedSlot, setSelectedSlot] = useState(-1); // -1 o numero tra 0 e handCards.length

  const handleSlotClick = (index) => {
    setSelectedSlot(index); // seleziona lo slot da evidenziare
  };

  const handleConfirm = () => {
    handleGuess(selectedSlot);
  }

  return (
    <Container fluid className='mt-4'>
      <Row className="justify-content-center align-items-center">
        {/* creo un'array di n+1 elementi da mappare in slot+carta*/}
        {Array.from({ length: handCards.length + 1 }).map((_, index) => (
          // Fragment non rompe il layout come farebbe Container che invece
          // in questo caso mi metterebbe gli elementi in righe diverse (motivo: 
          // gli elementi anche se sono in Col non sono figli diretti di Row)
          <Fragment key={index}>
            <Col xs="auto">
              <InsertSlot
                index={index + 1} // serve al componente IndexSlot per visualizzare il numero dello slot
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
        <Button variant="primary mt-3 me-2" onClick={handleConfirm}>
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
      title={`Inserisci nella posizione ${index}`}
    >
      {index}
    </Button>
  );
}