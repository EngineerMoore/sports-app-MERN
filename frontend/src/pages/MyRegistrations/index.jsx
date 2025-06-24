import { useEffect, useState } from "react";
import api from '../../services/api'
import dayjs from 'dayjs'
import { Button, ButtonGroup } from 'reactstrap';
import './style.css'


export default function MyRegistrations() {
  const [myEvents, setMyEvents] = useState([]);
  const user = localStorage.getItem('user');

  useEffect(() => {
    getMyEvents()
  },[])
  const getMyEvents = async () => {
    try {
      const response = await fetch(`${api}/registration`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      })

      const registrations = await response.json();
      setMyEvents(registrations);
    } catch (error) {
      console.error(error);
    }
  }

  const isApproved = (approved) => approved === true ? "Approved" : 'Rejected';

  const acceptEventHandler = async (eventId) => {
    try {
      await fetch(`${api}/registration/${eventId}/approvals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          user
        }
      })

      getMyEvents();

    } catch (error) {
      console.error(error);
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

      getMyEvents();

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ul className="events">
      {myEvents.map(event => (
          <li key={event._id}>
            <div><strong>{event.eventTitle}</strong></div>
            <div className="events-details">
              <span>Event Date: {dayjs(event.eventDate).format('MM/DD/YYYY')}</span>
              <span>Event Price: ${parseFloat(event.eventPrice)}</span>
              <span>User Email: {event.userEmail}</span>
              <span>Status: 
                <span className={event.approved !== undefined ? isApproved(event.approved) : 'Pending'}>{event.approved !== undefined ? isApproved(event.approved) : 'Pending'}</span></span>
            </div>
            <ButtonGroup>
              <Button disabled={event.approved === true || event.approved ==false} color='secondary' onClick={() => {acceptEventHandler(event._id)}}>Accept</Button>
              <Button disabled={event.approved === true || event.approved ==false} color='danger' onClick={() => {rejectEventHandler(event._id)}}>Reject</Button>
            </ButtonGroup>            
          </li>
        ))}
    </ul>
  )
}