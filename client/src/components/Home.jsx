import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from "react-router";

function HomeMenu() {
  return (
    <Container className="text-center">
      <Card className="border-0 bg-transparent mb-5">
        <Card.Body>
          <h1 className="display-4 mb-4">Benvenuto in Stuff Happens!</h1>
          <p className="lead mb-5">
            Scopri fino a 50 situazioni in cui potresti trovarti durante una
            vacanza e prova a indovinare le più assurde e sfortunate.
          </p>
          <Row className="justify-content-center">
            <Col md={6} lg={4}>
              <Button variant="success" size="lg" className="w-100 py-3 mb-3" as={Link} to={`/match/new`}>
                Gioca una partita
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HomeMenu;