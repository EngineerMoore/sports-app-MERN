import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Container, Input } from 'reactstrap';
import Button from 'react-bootstrap/Button';

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
        <h2>Register:</h2>
        <p>Please <strong>Register</strong> for a new account</p>
        <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="text" name="firstName" id="firstName" placeholder="Your first name" onChange={evt => setFirstName(evt.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="text" name="lastName" id="lastName" placeholder="Your last name" onChange={evt => setLastName(evt.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="email" name="email" id="email" placeholder="Your email" onChange={evt => setEmail(evt.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="password" name="password" id="password" placeholder="Your password" onChange={evt => setPassword(evt.target.value)} />
            </FormGroup>
            <Button>Submit</Button>
        </Form>
    </Container>
  )
}
export default Register