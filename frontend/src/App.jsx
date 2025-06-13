import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Container } from 'reactstrap'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import EventsPage from './pages/EventsPage'

function App() {
  return (
    <>
      <Container>
        <h1>Sport's App</h1>
        <div className='content'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/events' element={<EventsPage />} />
          </Routes>
        </div>
      </Container>
    </>
  )
}

export default App
