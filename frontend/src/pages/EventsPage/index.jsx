import { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Form, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import cameraIcon from '../../assets/camera.png'
import './event.css'


const EventsPage = () => {
  const [title, setTitle ] = useState('');
  const [description, setDescription ] = useState('');
  const [price, setPrice] = useState('');  
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState('');
  const [date, setDate] = useState('');
  const [uploadAlert, setUploadAlert] = useState('');
  const [successAlert, setSuccessAlert] = useState('');

  let navigate = useNavigate();

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  const submitHandler = async (e) => {
    e.preventDefault();  
    const user_id = localStorage.getItem('user');

    const eventData = new FormData();
    eventData.append('thumbnail', thumbnail)
    eventData.append('sport', sport)
    eventData.append('title', title)
    eventData.append('description', description)
    eventData.append('price', price)
    eventData.append('date', date)


    if (thumbnail) {
      try {
        const response = await fetch('http://localhost:8000/event', {
          method: 'POST',
          // 'content-type: application/json' not necessary when using form data
          headers: {
            user_id
          },
          // stringify not necessary with form data
          body: eventData
        })

        const data = response.json();
        setSuccessAlert('Event successfully created!');
        setTimeout(() => setSuccessAlert(''), 2000);
        setThumbnail(null);
        setSport('');
        setTitle('');
        setDescription('');
        setPrice('');
        setDate('');
      } catch (error) {
        console.error(error);
      }
    } else {
      setUploadAlert(`Upload Event Thumbnail`)
    }
  
  }
  return (
        <Container>
          {successAlert ? <Alert color="success">{successAlert}</Alert> : ''}
          <h2>Create your Event</h2>
          <Form onSubmit={submitHandler}>
            <FormGroup>
              <Label>Upload Image: </Label>
              <Label id='thumbnail' style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
                  <Input type="file" onChange={evt => {setThumbnail(evt.target.files[0]); setUploadAlert('')}} />
                  <img src={cameraIcon}
                    style={{ maxWidth: "50px" }}
                    alt="upload icon image"
                  />
              </Label>
            </FormGroup>
            {uploadAlert ? <Alert color="danger">{uploadAlert}</Alert> : ''}
            <FormGroup>
              <Label>Sport: </Label>
              <Input id="sport" type="text" value={sport} placeholder={'Sport Name'} onChange={(evt) => setSport(evt.target.value)} required/>
            </FormGroup>
            <FormGroup>
              <Label>Title: </Label>
              <Input id="title" type="text" value={title} placeholder={'Event Title'} onChange={(evt) => setTitle(evt.target.value)} required/>
            </FormGroup>
            <FormGroup>
              <Label>Event description: </Label>
              <Input id="description" type="text" value={description} placeholder={'Event Description'} onChange={(evt) => setDescription(evt.target.value)} required/>
            </FormGroup>
            <FormGroup>
              <Label>Event price: </Label>
              <Input id="price" type="text" value={price} placeholder={'Event Price $0.00'} onChange={(evt) => setPrice(evt.target.value)} required/>
            </FormGroup>
            <FormGroup>
              <Label>Event date: </Label>
              <Input id="date" type="date" value={date} onChange={(evt) => setDate(evt.target.value)} required/>
            </FormGroup>
            <FormGroup>
              <Button type="submit" className="submit-btn">
                Create Event
              </Button>
            </FormGroup>
            <FormGroup>
              <Button type="secondary-btn" className="secondary-btn" onClick={() => navigate('/')}>
                Dashboard
              </Button>
            </FormGroup>
          </Form>
        </Container>
  )
}

export default EventsPage