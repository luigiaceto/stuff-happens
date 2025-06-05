import { Row, Card } from 'react-bootstrap';

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