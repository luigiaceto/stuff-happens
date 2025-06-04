import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Card, Badge, Image, Button, Accordion } from 'react-bootstrap';
import { Link } from "react-router";
import { useEffect, useState } from 'react';
import API from '../../API.mjs';

function UserProfile({user}) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // recupero match history dell'user
    const getMatches = async () => {
      const matches = await API.getMatchHistory(user.user_id);
      setMatches(matches.match_list);
    }
    getMatches();
  }, []);

  return (
    <Container>
      <Card className="mb-4 text-center">
        <Card.Body>
          <Card.Title className="fs-2">{user.name}</Card.Title>
        </Card.Body>
      </Card>
      <Col md={6}>
        <MatchList matches={matches}/>
      </Col>
    </Container>
  );
}

function MatchList({matches}) {
  return (
    <Accordion>
      {matches.map((match) => (
        <Match match={match}/>
      ))}
    </Accordion>
  );
}

function Match({match}) {
  return (
    <Accordion.Item eventKey={item.id} key={item.id}>
      <Accordion.Header>
        {match.date} 
        <Col xs={5} className="text-end d-flex align-items-center justify-content-end">
          <Badge bg={match.match_result === 'Won' ? 'success' : 'danger'}>
            {match.match_result}
          </Badge>
        </Col> 
        {match.card_collected}
      </Accordion.Header>
      <Accordion.Body>
        {match.match_situations.map((situation) => (
          <Card key={situation.id} className="mb-3">
            <Card.Body className="d-flex flex-row justify-content-between align-items-center">
              <Card.Title>{situation.name}</Card.Title>
              <Card.Text>
                {situation.round === 0 ? 'Mano iniziale' : situation.round}
                <Badge bg={situation.result === 'Won' ? 'success' : 'danger'}>
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