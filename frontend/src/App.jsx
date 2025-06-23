import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Container } from 'reactstrap'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import EventsPage from './pages/EventsPage'
import MyRegistrations from './pages/MyRegistrations'
import TopNav from './components/TopNav'
import { ContextWrapper } from './user-context'
import './App.css'

function App() {
  return (
    <>
      <ContextWrapper>
        <Container>
          <h1>Sport's App</h1>
          <div className='content'>
            <TopNav />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/myregistrations' element={<MyRegistrations />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/events' element={<EventsPage />} />
            </Routes>
          </div>
        </Container>
      </ContextWrapper>
    </>
  )
}

export default App
