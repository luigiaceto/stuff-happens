import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Col, Card, Badge, Accordion, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function UserProfile({user}) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // recupero match history dell'user
    const match_list = [
      {
        match_id: 1234,
        match_result: "Win",
        card_collected: 4,
        date: "2025-05-23",
        match_situations: [
          {
            id: 1,
            name: "sgrodo nello stau" ,
            misfortune_index: 34.6,
            img_path: "/img/sit1.jpg",
            round: 2,
            result: "Won"
          },
          {
            id: 2,
            name: "sgrodo nello stau 2",
            misfortune_index: 12.3,
            img_path: "/img/sit2.jpg",
            round: 1,
            result: "Lost"
          }
        ]
      },
      {
        match_id: 5678,
        match_result: "Lost",
        card_collected: 2,
        date: "2025-05-24",
        match_situations: [
          {
            id: 3,
            name: "sgrodo nello stau 3",
            misfortune_index: 45.1,
            img_path: "/img/sit3.jpg",
            round: 1,
            result: "Lost"
          }
        ]
      }
    ]
    setMatches(match_list);
  }, []);

  return (
    <Container>
      <Card className="mb-4 text-center">
        <Card.Body>
          <Card.Title className="fs-2">{user.name}</Card.Title>
        </Card.Body>
      </Card>
      <Col md={12}>
        <MatchList matches={matches}/>
      </Col>
    </Container>
  );
}

function MatchList({matches}) {
  return (
    <Accordion>
      {matches.map((match) => (
        <Match key={match.match_id} match={match}/>
      ))}
    </Accordion>
  );
}

function Match({match}) {
  return (
    <Accordion.Item eventKey={match.match_id}>
      <Accordion.Header>
        <Col>
          <span className="me-4">{match.date}</span>
          <span>Cards collected: {match.card_collected}</span>
        </Col>
        <Col className="text-end me-4">
          <Badge bg={match.match_result === 'Win' ? 'success' : 'danger'}>
            {match.match_result}
          </Badge>
        </Col> 
      </Accordion.Header>
      <Accordion.Body>
        {match.match_situations
        .sort((a, b) => a.round - b.round)
        .map((situation) => (
          <Card key={situation.id} className="mb-3">
            <Card.Body className="d-flex flex-row justify-content-between align-items-center">
              <Card.Title>{situation.name}</Card.Title>
              <Card.Text>
                Round: {situation.round === 0 ? 'Mano iniziale' : situation.round}
                <Badge className='ms-4' bg={situation.result === 'Won' ? 'success' : 'danger'}>
                  {situation.result}
                </Badge>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default UserProfile;