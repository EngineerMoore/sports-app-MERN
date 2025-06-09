import { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import figure from 'react-bootstrap/Figure';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import cameraIcon from '../../assets/camera.png'
import './event.css'


const EventsPage = () => {
  const user_id = localStorage.getItem('user');
  const [title, setTitle ] = useState('');
  const [description, setDescription ] = useState('');
  const [price, setPrice] = useState('');  
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState('');
  const [date, setDate] = useState('');

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  const submitHandler = () => {
    return ''
  }
  return (
    <Container>
      <h1>Create Your Event</h1>
      <Form onSubmit={ submitHandler }>
        <Form.Group className={`thumbnail-container ${thumbnail ? 'has-thumbnail' : ''}`} controlId="thumbnail">
          <Form.Label id="preview-thumbnail" style={{backgroundImage: `url(${preview})`}}></Form.Label>
          <Form.Label>Upload Image: </Form.Label>
          <Form.Control type="file"  onChange={(e) => setThumbnail(e.target.files[0])}/>
          <figure.Image
            width={50}
            alt='upload icon image'
            src={cameraIcon}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="sport">
          <Form.Label>Sport: </Form.Label>
          <Form.Control type="text" value={sport} placeholder={'Sport name'} onChange={(e) => setSport(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title: </Form.Label>
          <Form.Control type="text" value={title} placeholder={'Event Title'} onChange={(e) => setTitle(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description: </Form.Label>
          <Form.Control type="text" value={description} placeholder={'Event Description'} onChange={(e) => setDescription(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price: </Form.Label>
          <Form.Control type="text" value={price} placeholder={'Event Price'} onChange={(e) => setPrice(e.target.value)}/>
        </Form.Group>
        <Button>
          Create Event
        </Button>
      </Form>
    </Container>
  )
}

export default EventsPage