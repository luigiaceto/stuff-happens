import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router";
import { LogoutButton } from './AuthComponents';

function NavHeader({user, loggedIn, handleLogout}) {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Navbar.Brand className='ms-3'>Guess Who: Animal!</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        {loggedIn && <Nav.Link as={Link} to={`/user/${user.user_id}/profile`}>User & stats</Nav.Link>}
        {loggedIn && <Nav.Link as={Link} to={`/user/${user.user_id}/catalog/new`}>Animal creation</Nav.Link>}
        {loggedIn ? 
          <LogoutButton logout={handleLogout} /> :
          <Link to='/login'className='btn btn-outline-light'>Login</Link>
        }
      </Nav>
    </Navbar>
  )
}

export default NavHeader;