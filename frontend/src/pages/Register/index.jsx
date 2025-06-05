import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';

const Register = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName] = useState('')

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('result', email, password, firstName, lastName)
    const response = await fetch(`http://localhost:8000/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName
      })
    })

    const data = await response.json();
    // Tip: I referenced my login controller to know what data I'll receive
    const userId = data._id || false;

    console.log(data)
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
      <h2>Register</h2>
      <p>Please <strong>Register</strong> for a new account</p>
      <Form onSubmit={ handleSubmit }>
        <Form.Group className="mb-3" controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)}/>
        </Form.Group>
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
export default Register