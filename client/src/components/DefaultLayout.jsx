import { Container, Row, Alert } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";

function DefaultLayout({user, loggedIn, handleLogout, message, setMessage}) {
  
  return(
    <div className="default-layout">
      <NavHeader user={user} loggedIn={loggedIn} handleLogout={handleLogout}/>
      <Container fluid className="mt-3">
        {message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row>}
        <Outlet />
      </Container>
      <footer className="text-center text-muted mt-5">
        <p> AW-2025-Stuff-Happens | Aceto Luigi </p>
      </footer>
    </div>
  );
}

export default DefaultLayout;