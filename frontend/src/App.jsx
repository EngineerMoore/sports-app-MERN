import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Container from 'react-bootstrap/Container'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'

function App() {
  return (
    <>
      <Container>
        <h1>Sport's App</h1>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
