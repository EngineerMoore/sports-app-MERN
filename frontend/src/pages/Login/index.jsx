import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('')

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('result', email, password)
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json();
    // Tip: I referenced my login controller to know what data I'll receive
    const userId = data._id || false;

    if (userId) {
       localStorage.setItem('user', userId)
       navigate('/dashboard')
    } else {
      const { message } = data
      console.log(message)
    }

  }

  return (
    <Container>
      <h2>Login</h2>
      <p>Please <strong>Login</strong> to your account</p>
      <Form onSubmit={ handleSubmit }>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  )
}
export default Login