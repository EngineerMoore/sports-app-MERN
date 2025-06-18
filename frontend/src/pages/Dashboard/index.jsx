import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../services/api';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import './dashboard.css'

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);
  const [successAlert, setSuccessAlert] = useState('');
  const [deletionAlert, setDeletionAlert] = useState('');
  const user_id = localStorage.getItem('user');

  let navigate = useNavigate()

  useEffect(() => {
    getEvents();
  }, [])

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query)
  }

  const myEventsHandler = async () => {
    setRSelected('myEvents');
    const response = await fetch(`${api}/user/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        user_id
      }
    });

    const userEvents = await response.json();
    setEvents(userEvents);
    
  }

  const getEvents = async(filter) => {

    const url = filter ? `${api}/dashboard/${filter}` : `${api}/dashboard`;
    const response = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        user_id
      }
    });
    const allEvents = await response.json();

    setEvents(allEvents)

  }

  const deleteEventHandler = async (event) => {

    try {
      const deleteEvent = await fetch(`${api}/event/${event.id}`, {
        method: 'DELETE'
      })
      
      filterHandler(null);
      setSuccessAlert('Event successfully deleted');
      setTimeout(() => {setSuccessAlert('');}, 4000);
    } catch (error) {
      setDeletionAlert('An error occurred. Unable to delete event.');
      setTimeout(() => {setDeletionAlert('')}, 2000)
    }
  }

  return (
    <>
      <div className='filter-panel'>
        <ButtonGroup>
          <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</Button>
          <Button color="primary" onClick={myEventsHandler} active={rSelected === 'myEvents'}>My Events</Button>
          <Button color="primary" onClick={() => filterHandler('running')} active={rSelected === 'running'}>Running</Button>
          <Button color="primary" onClick={() => filterHandler('cycling')} active={rSelected === 'cylcing'}>Cycling</Button>
          <Button color="primary" onClick={() => filterHandler('swimming')} active={rSelected === 'swimming'}>Swimming</Button>
        </ButtonGroup>
        <Button color="primary" onClick={() => navigate('/events')}>Create Event</Button>
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
            <Button color='primary'>Subscribe</Button>
          </li>
        )}
      </ul>
    </>
  )
}

export default Dashboard