import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const UserNameInput = ({ onUserChange, onUserConfirm }) => {
  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          Username
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onChange={onUserChange}
        />
        <Button variant="outline-secondary" id="button" onClick={onUserConfirm}>
          Confirm
        </Button>
      </InputGroup>
    </>
  );
}

export default UserNameInput;