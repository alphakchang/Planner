import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import LinguistInfo from './components/LinguistInfo/LinguistInfo';
import LinguistWorkload from './components/LinguistWorkload/LinguistWorkload';
import TaskList from './components/TaskList/TaskList';
import TeamWorkload from './components/TeamWorkload/TeamWorkload';
import UsernameInput from './components/UsernameInput/UsernameInput';
import logo from './components/Navigation/alpha_logo.png';
import UserNotFound from './components/Alerts/UserNotFound/UserNotFound';

/**
 * This component is the main component of the application
 * 
 * It starts with a UsernameInput component that allows the user to enter a username
 * If the user enters an invalid username, it will display a UserNotFound component
 * 
 * Once the user enters a valid username, it will display the main components of the application
 * which contains the following components:
 * 
 * Navigation
 * LinguistInfo
 * LinguistWorkload
 * TaskList
 * TeamWorkload
 * Footer
 * 
 * The proxy is the only state that needs to be decided by the developer, which is the URL of the backend server
 * All the other states are controlled by the components themselves
 * 
 */

// The initial state of the application, only the proxy needs to be decided by the developer
const initialState = {
  proxy: 'http://localhost:5001',
  username: '',
  userReady: false,
  userNotFound: false
};

class App extends Component {

  constructor() {
    super();
    this.state = initialState;
    this.taskListRef = React.createRef();
    this.linguistWorkloadRef = React.createRef();
    this.teamWorkloadRef = React.createRef();
  }

  // This is the method that is called when the user enters a username
  onUserChange = (event) => {
    this.setState({username: event.target.value});
  }

  // When the user submits a username, it will check if the username is valid
  // if invalid, it will display a UserNotFound component
  // if valid, it will trigger the onUserConfirm() method
  onUserSubmit = async () => {
    try {
      const response = await fetch(`${this.state.proxy}/name/${this.state.username}`)
      if (!response.ok) {
        this.setState({userNotFound: true})
      } else {
        this.onUserConfirm();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // This method is called when the user submits a valid username
  onUserConfirm = () => {
    this.setState({userReady: true});
  }

  // This method is called when the user closes the OffCanvasWindow component
  // OffCanvasWindow component is a child of TeamWorkload component, so this method is passed to TeamWorkload first, then to OffCanvasWindow
  runRefreshTaskList = () => {
    if (this.taskListRef.current) {
      this.taskListRef.current.refreshTaskList(); // Run the refreshTaskList method in TaskList
    }
  }

  // This method is called when the user claims or unclaims a task
  // This method calls the triggerRerender method in LinguistWorkload and TeamWorkload
  // So that the workload bar charts will be refreshed
  runTriggerRerender = () => {
    if (this.linguistWorkloadRef.current) {
      this.linguistWorkloadRef.current.triggerRerender(); // Call the triggerRerender method in LinguistWorkload
    }
    if (this.teamWorkloadRef.current) {
      this.teamWorkloadRef.current.triggerRerender(); // Call the triggerRerender method in TeamWorkload
    }
  }

  render() {
    const { proxy, username } = this.state;
  
    return (
      <div>
        <Navigation />
        {this.state.userReady ? (
          <>
            <section id='myWorkload'>
              <div className="container-lg">
                <LinguistInfo proxy={proxy} username={username}/>
                <LinguistWorkload proxy={proxy} username={username} ref={this.linguistWorkloadRef}/>
              </div>
            </section>
  
            <section id='myTasks'>
              <div className="container-lg">
                <TaskList proxy={proxy} username={username} onTriggerRerender={this.runTriggerRerender} ref={this.taskListRef}/>
              </div>
            </section>
  
            <section id='teamWorkload'>
              <div className="container-lg">
                <TeamWorkload proxy={proxy} username={username} onRefreshTaskList={this.runRefreshTaskList} onTriggerRerender={this.runTriggerRerender} ref={this.teamWorkloadRef}/>
              </div>
            </section>
  
            <section>
              <Footer />
            </section>
          </>
        ) : (
          <section>
            <div className='container-lg'>
              <div className='row d-flex justify-content-center'>
                <div className="col-4 text-center">
                  <div className="my-2">
                    <UsernameInput proxy={proxy} onUserChange={this.onUserChange} onUserSubmit={this.onUserSubmit}/>
                  </div>
                  <div className="my-5">
                      <img src={logo} alt='logo' />
                  </div>
                </div>
              </div>
              {this.state.userNotFound ? (
                <div className="row d-flex justify-content-center">
                  <div className="col-8">
                    <div>
                      <UserNotFound />
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div> 
          </section>
        )}
      </div>
    );
  }
}

export default App;
