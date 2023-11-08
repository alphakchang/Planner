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

const initialState = {
  proxy: 'http://localhost:3001',
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

  handleRefreshTaskList = () => {
    if (this.taskListRef.current) {
      this.taskListRef.current.refreshTaskList(); // Call the refreshTaskList method in TaskList
    }
  }

  handleTriggerRerender = () => {
    if (this.linguistWorkloadRef.current) {
      this.linguistWorkloadRef.current.triggerRerender(); // Call the triggerRerender method in LinguistWorkload
    }
    if (this.teamWorkloadRef.current) {
      this.teamWorkloadRef.current.triggerRerender(); // Call the triggerRerender method in LinguistWorkload
    }
  }

  onUserChange = (event) => {
    this.setState({username: event.target.value}, () => {
      console.log(this.state.username)
    });
  }

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

  onUserConfirm = () => {
    this.setState({userReady: true});
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
                <TaskList proxy={proxy} username={username} ref={this.taskListRef} onTriggerRerender={this.handleTriggerRerender}/>
              </div>
            </section>
  
            <section id='teamWorkload'>
              <div className="container-lg">
                <TeamWorkload proxy={proxy} username={username} onRefreshTaskList={this.handleRefreshTaskList} onTriggerRerender={this.handleTriggerRerender} ref={this.teamWorkloadRef}/>
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
