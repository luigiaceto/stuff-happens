import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router";
import { LogoutButton } from './AuthComponents';

function NavHeader({user, loggedIn, handleLogout}) {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Navbar.Brand className='ms-3'>Stuff Happens</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        {loggedIn && <Nav.Link as={Link} to={`/user/${user.id}/profile`}>Profilo utente</Nav.Link>}
      </Nav>
      {loggedIn ? 
        <LogoutButton logout={handleLogout} /> :
        <Link to='/login'className='btn btn-outline-light me-3'>Login</Link>}
    </Navbar>
  )
}

export default NavHeader;