import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Card, Badge, Image, Button } from 'react-bootstrap';
import { Link } from "react-router";
import { useEffect, useState } from 'react';
import API from '../../API.mjs';

function UserProfile({user}) {
  const [matches, setMatches] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    // recupero match history dell'user
    const getMatches = async () => {
      const matches = await API.getMatchHistory(user.user_id);
      setMatches(matches.match_list);
      setMatchesPlayed(matches.match_list.length);
      setTotalScore(matches.total_score);
    }
    getMatches();
  }, []);

  useEffect(() => {
    // recupero custom animals dell'user
    const getAnimals = async () => {
      const animals = await API.getCustomAnimals(user.user_id);
      setAnimals(animals.animal_list);
    }
    getAnimals();
  }, []);

  return (
      <Container>
        <UserStats user={user} totalScore={totalScore} matchesPlayed={matchesPlayed}/>
        <Row>
          <Col md={6}>
            <MatchList matches={matches}/>
          </Col>
          <Col md={6}>
            <AnimalList animals={animals} setAnimals={setAnimals}/>
          </Col>
        </Row>
      </Container>
  );
}

function UserStats({user, totalScore, matchesPlayed}) {
    return (
        <Card className="mb-4 text-center">
          <Card.Body>
            <Card.Title className="fs-2">{user.name}</Card.Title>
            <Row className="mt-3">
              <Col>
                <Card.Text className="fs-4">Games played: {matchesPlayed}</Card.Text>
              </Col>
              <Col>
                <Card.Text className="fs-4">Total score: {totalScore}</Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
    );
}

function MatchList({matches}) {
    return (
        <>
        <h3 className="mb-3">Match history</h3>
            {matches.length>0 && matches.map(game => (
              <Card className="mb-2" key={game.match_id}>
                <Card.Body>
                  <Row>
                    <Col xs={7}>
                      <Card.Title>{game.date}</Card.Title>
                      <Card.Text>Punteggio: {game.score}</Card.Text>
                    </Col>
                    <Col xs={5} className="text-end d-flex align-items-center justify-content-end">
                      <Badge bg={game.win === "Yes" ? "success" : "danger"}>
                        {game.win === "Yes" ? "Win" : "Lose"}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
        </>
    );
}

function AnimalList({animals, setAnimals}) {

    const handleDelete = async (animal_id) => {
      await API.deleteAnimal(animal_id);
      setAnimals(animals => animals.filter(a => a.animal_id != animal_id));
    }

    return(
        <>
        <h3 className="mb-3">Custom animals</h3>
        {animals.length>0 && animals.map(animal => (
              <Card className="mb-2" key={animal.animal_id}>
                <Card.Body>
                  <Row>
                    <Col xs={7}>
                      <Card.Title>{animal.name}</Card.Title>
                      <Link className="btn btn-primary mx-1" to={`/user/${animal.user_id}/catalog/${animal.animal_id}/edit`} state={animal}>
                        <i className="bi bi-pencil-square" />
                      </Link>
                      <Button variant="danger" className="mx-1" onClick={() => handleDelete(animal.animal_id)}>
                        <i className="bi bi-trash" />
                      </Button>
                    </Col>
                    <Col xs={5} className="text-end d-flex align-items-center justify-content-end">
                      <div className="shadow-sm rounded" style={{ width: '54px', height: '54px', overflow: 'hidden' }}>
                        <Image 
                            src={`http://localhost:3001${animal.img_path}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>))}
        </>
    );
}

export default UserProfile;