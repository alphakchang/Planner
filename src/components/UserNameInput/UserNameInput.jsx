import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

/**
 * This component simply allows the user to enter a username, then submit that username to App.jsx
 * 
 * Receives two functions from App.jsx as props:
 * onUserChange
 * onUserSubmit
 */

const UsernameInput = ({ onUserChange, onUserSubmit }) => {

  // monitor if 'Enter' key was pressed, run onUserConfirm() when it is pressed
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onUserSubmit();
    }
  };
  
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
          onKeyPress={handleKeyPress} // apparently deprecated, but still can be used, if there's a better method, please update
        />
        <Button variant="outline-secondary" id="button" onClick={onUserSubmit}>
          Confirm
        </Button>
      </InputGroup>
    </>
  );
}

export default UsernameInput;