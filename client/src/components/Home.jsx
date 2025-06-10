import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from "react-router";
import SplitText from "./reactbits_components/SplitText.jsx";

function HomeMenu() {
  return (
    <Container className="text-center">
      <Card className="display-2 border-0 bg-transparent mb-5">
        <Card.Body>
          <SplitText
            text="Benvenuto in Stuff Happens!"
            className="text-2xl font-semibold text-center"
            delay={50}
            duration={0.3}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <p className="lead mb-5">
            Scopri fino a 50 situazioni in cui potresti trovarti durante una
            vacanza e prova a indovinare le più assurde e sfortunate.
          </p>
          <Row className="justify-content-center">
            <Col md={6} lg={4}>
              <Button variant="success" size="lg" className="w-100 py-3 mb-3 basic-shadow" as={Link} to={`/match/new`}>
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