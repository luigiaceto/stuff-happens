import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from "react-router";

function HomeMenu({user}) {
  return (
      <Container className="text-center">
        <Card className="border-0 bg-transparent mb-5">
          <Card.Body>
            <h1 className="display-4 mb-4">Welcome to Guess Who: Animal!</h1>
            <p className="lead mb-5">
              Guess the secret animal and create new ones!
            </p>
            <Row className="justify-content-center">
              <Col md={6} lg={4}>
                <Button variant="success" size="lg" className="w-100 py-3 mb-3" as={Link} to={`/user/${user.user_id}/match`}>
                  Inizia a giocare
                </Button>
                {/* <Button variant="outline-secondary" size="lg" className="w-100 py-3">
                  Login
                </Button> */}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
  );
}

export default HomeMenu;