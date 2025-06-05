import { Container, Row, Alert, Col } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";

function DefaultLayout({user, loggedIn, handleLogout, message, setMessage}) {
  
  return(
    <div className="default-layout d-flex flex-column min-vh-100">
      <NavHeader 
        user={user} 
        loggedIn={loggedIn} 
        handleLogout={handleLogout} 
      />
      <Container fluid className="flex-grow-1 py-3">
        {message && (
          <Row className="mb-3">
            <Col>
              <Alert 
                variant={message.type} 
                onClose={() => setMessage('')} 
                dismissible
              >
                {message.msg}
              </Alert>
            </Col>
          </Row>
        )}
        <Outlet />
      </Container>
      <footer className="text-center py-3 mt-auto">
        <Container>
          <Row>
            <Col>
              <p className="mb-0">
                AW-2025-Stuff-Happens | Aceto Luigi
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default DefaultLayout;