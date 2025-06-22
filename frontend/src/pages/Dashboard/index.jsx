import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../services/api';
import { Alert, Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import socketio from 'socket.io-client';
import './dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);
  const [successAlert, setSuccessAlert] = useState('');
  const [deletionAlert, setDeletionAlert] = useState('');
  const [messageHandler, setMessageHandler] = useState('');
  const [eventRequests, setEventRequests] = useState([]);
  const[dropdownOpen, setDropdownOpen] = useState(false);
  const[eventRequestSuccessAlert, setEventRequestSuccessAlert] = useState('');

  const user = localStorage.getItem('user');
  const user_id = localStorage.getItem('user_id');

  let navigate = useNavigate()

  const toggle = () => setDropdownOpen(!dropdownOpen)

  useEffect(() => {
    getEvents();
  }, [])

  const socket = useMemo(() => {
    return socketio('http://localhost:8000', { query: { user: user_id } })
  }, [user_id]);

  useEffect(() => {
    socket.on('registration_request', data => (setEventRequests([...eventRequests, data])))
  }, [eventRequests, socket])
  
  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query)
  }

  const myEventsHandler = async () => {
    try {
      setRSelected('myEvents');
      const response = await fetch(`${api}/user/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          user
        }  
      });

      const userEventsObject = await response.json();
      setEvents(userEventsObject.events);
    } catch (error) {
      navigate('/login');
    }

    
  }

  const getEvents = async(filter) => {
    try {
      const url = filter ? `${api}/dashboard/${filter}` : `${api}/dashboard`;
      const response = await fetch(`${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      });
      const allEventsObject = await response.json();

      setEvents(allEventsObject.events);
    } catch (error) {
      navigate('/login');
    }


  }

  const deleteEventHandler = async (event) => {
    try {
      const deleteEvent = await fetch(`${api}/event/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      })
      
      filterHandler(null);
      setSuccessAlert('Event successfully deleted');
      setTimeout(() => {setSuccessAlert('');}, 4000);
    } catch (error) {
      setDeletionAlert('An error occurred. Unable to delete event.');
      setTimeout(() => {setDeletionAlert('')}, 2000)
    }
  }



  const registrationRequestHandler = async (event) => {
    try {
      fetch(`${api}/registration/${event.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  const acceptEventHandler = async (eventId) => {
    try {
      const response = await fetch(`${api}/registration/${eventId}/approvals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      })

      setEventRequestSuccessAlert('Registration Request Accepted')
      setTimeout(() => {
        setEventRequestSuccessAlert('')
      },2500)

    } catch (error) {
      console.error(error)
    }
  }

    const rejectEventHandler = async (eventId) => {
    try {
      const response = await fetch(`${api}/registration/${eventId}/rejections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      })

      setEventRequestSuccessAlert('Registration Request Rejected')
      setTimeout(() => {
        setEventRequestSuccessAlert('')
      },2500)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {eventRequestSuccessAlert ? <div><Alert color="success">{eventRequestSuccessAlert}</Alert></div> : ''}
      <ul className='notifications'>
      {eventRequests.map( request => {
        return (
          <li key={request._id}>
            <div>
              <strong>{request.user.email}</strong> Is requesting to register to your Event: 
              <strong>{request.event.title}</strong>
            </div>
              <ButtonGroup>
                <Button color='secondary' onClick={() => {acceptEventHandler(request._id)}}>Accept</Button>
                <Button color='danger' onClick={() => {rejectEventHandler(request._id)}}>Reject</Button>
              </ButtonGroup>
          </li>
        )
      })}
      </ul>
      <div className='filter-panel'>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="primary" caret>
            Filter
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</DropdownItem>
            <DropdownItem onClick={myEventsHandler} active={rSelected === 'myEvents'}>My Events</DropdownItem>
            <DropdownItem onClick={() => filterHandler('running')} active={rSelected === 'running'}>Running</DropdownItem>
            <DropdownItem onClick={() => filterHandler('cycling')} active={rSelected === 'cylcing'}>Cycling</DropdownItem>
            <DropdownItem onClick={() => filterHandler('swimming')} active={rSelected === 'swimming'}>Swimming</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {successAlert ? <Alert color='success'>{successAlert}</Alert> : ''}
      <ul className='events-list'>
        {events.map(event =>
          <li key={event.id}>
            {/* 'thumnaiil' due to typo when creating the virtual url in the schema */}
            <header style={{ backgroundImage: `url(${event.thumnail_url})`}} >
              {event.user === user_id ?
                <div>
                  <Button
                    color="danger"
                    onClick={() => deleteEventHandler(event)}
                  >
                    Delete
                  </Button>
                </div> :
                ''
              }
            </header>
            <strong>{event.title}</strong>
            <span>Event Date: {`${dayjs(event.date).format('MM/DD/YYYY')}`}</span>
            <span> Event Price: ${parseFloat(event.price).toFixed(2)}</span>
            <span>Event Description: {event.description}</span>
            <Button color='primary' onClick={() => registrationRequestHandler(event)}>Registration Request</Button>
          </li>
        )}
      </ul>
    </>
  )
}

export default Dashboard