import Alert from 'react-bootstrap/Alert';

const UserNotFound = () => {
  return (
    <Alert variant="success">
      <Alert.Heading>Hi, nice to see you here!</Alert.Heading>
      <p>
        You are reading this message because you've entered an incorrect username.
        <br />
        This is just a prototype and is not currently connected to our main database where all users are registered.
      </p>
      <hr />
      <p>
        Please use one of the following usernames to experience the prototype:
        <br />
        adebney<br />
        iclassico<br />
        ivieira<br />
        kchang<br />
        rertl<br />
        skesmodel<br />
      </p>
      <p className='mb-0'>
        If you'd like to have your own username added to this prototype, talk to Ken.
      </p>
    </Alert>
  );
}

export default UserNotFound;