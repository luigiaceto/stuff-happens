import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Col, Card, Badge, Accordion, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from '../API.mjs';
import GradientText from './reactbits_components/Gradienttext.jsx';

function UserProfile({user}) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch i match dell'utente al mount
  useEffect(() => {
    const getMatches = async () => {
      const matches = await API.getMatchHistory(user.id);
      setLoading(false);
      setMatches(matches);
    };
    setLoading(true);
    getMatches();
  }, []);

  return (
    <Container>
      <Card className="mb-4 text-center">
        <Card.Body>
          <Card.Title className="fs-1">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="custom-class"
            >
              {user.name}
            </GradientText>
          </Card.Title>
        </Card.Body>
      </Card>
      {!loading && 
        <Col md={12}>
          <MatchList matches={matches}/>
        </Col>}
      {loading &&
        <div className="text-center">
          <Spinner animation="border" variant="success"/>
        </div>}
    </Container>
  );
}

function MatchList({matches}) {
  return (
    <Accordion>
      {matches
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((match) => (
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
          <span>Carte collezionate: {match.card_collected}</span>
        </Col>
        <Col className="text-end me-4">
          <Badge bg={match.match_result === 'Vittoria' ? 'success' : 'danger'}>
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
                {situation.round === 0 ? 'Mano iniziale' : `Round: ${situation.round}`}
                {situation.round > 0 &&
                  <Badge className='ms-4' bg={situation.result === 'Vinta' ? 'success' : 'danger'}>
                    {situation.result}
                  </Badge>}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default UserProfile;