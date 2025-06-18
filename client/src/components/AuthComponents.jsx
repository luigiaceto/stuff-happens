import { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router';
import AnimatedContent from './reactbits_components/AnimatedContent.jsx';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      props.login(credentials);
  };

  return (
    <AnimatedContent
      distance={150} 
      direction="vertical"
      reverse={false}
      duration={1}
      ease="power3.out"
      threshold={0.2}
      delay={0.1}
    >
      <Container className='d-flex justify-content-center align-items-start glass-card text-center w-25 mt-4'>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='username' className='mb-3 mt-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
              </Form.Group>
              <Form.Group controlId='password' className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
              </Form.Group>
              <Button type='submit' className='mb-4 me-3'>Login</Button>
              <Link className='btn btn-danger mb-4' to={'/'} >Cancel</Link>
            </Form>
          </Col>
        </Row>
      </Container>
    </AnimatedContent>
  )
};

function LogoutButton(props) {
  return(
    <Button className='me-3' variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };