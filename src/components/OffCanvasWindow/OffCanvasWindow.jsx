import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './OffCanvasWindow.css';

const OffCanvasWindow = ({ canvasName, content, onClosing }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    if (onClosing) {
      onClosing(); // re-renders the TaskList upon closing
    }
    setShow(false);
  }

  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {canvasName}
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{canvasName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {content}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvasWindow;