import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, FormGroup, Input, Button } from 'reactstrap';


const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('false');

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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


    try {
      if (userId) {
         localStorage.setItem('user', userId)
         navigate('/dashboard')
      } else {
        const { message } = data
        setError(true)
        setErrorMessage(message)
        setTimeout( () => {
          setError(false)
          setErrorMessage('')
        }, 2000)

      }
    } catch (error) {

    }


  }

  return (
    <Container>
        <h2>Login:</h2>
        <p>Please <strong>Login</strong> into your account</p>
        <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="email" name="email" id="email" placeholder="Your email" onChange={evt => setEmail(evt.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input type="password" name="password" id="password" placeholder="Your password" onChange={evt => setPassword(evt.target.value)} />
            </FormGroup>
            <Button>
              Submit
            </Button>
        </Form>
    </Container>
  )
}
export default Login