import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api from '../../services/api';
import { Button, ButtonGroup } from 'reactstrap';
import './dashboard.css'

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);
  const user_id = localStorage.getItem('user');

  useEffect(() => {
    getEvents();
  }, [])

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query)
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

  return (
    <>
      <div> Filter:
        <ButtonGroup>
          <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</Button>
          <Button color="primary" onClick={() => filterHandler('running')} active={rSelected === 'running'}>Running</Button>
          <Button color="primary" onClick={() => filterHandler('cylcing')} active={rSelected === 'cylcing'}>Cycling</Button>
          <Button color="primary" onClick={() => filterHandler('swimming')} active={rSelected === 'swimming'}>Swimming</Button>
        </ButtonGroup>
      </div>
      <ul className='events-list'>
        {events.map(event =>
          <li key={event.id}>
            {/* 'thumnaiil' due to typo when creating the virtual url in the schema */}
            <header style={{ backgroundImage: `url(${event.thumnail_url})`}} />
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