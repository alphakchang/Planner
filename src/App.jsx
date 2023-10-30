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

class App extends Component {

  constructor() {
    super();
    this.state = {
      proxy: 'http://localhost:3001',
      username: 'adebney'
    }
  }

  render() {

    const { proxy, username } = this.state;

    return (
      <div>

        <section id='myWorkload'>
          <div className="container-lg">
            <Navigation />
            <LinguistInfo proxy={proxy} username={username}/>
            <LinguistWorkload proxy={proxy} username={username}/>
          </div>
        </section>

        <section id='myTasks'>
          <div className="container-lg">
            <TaskList proxy={proxy} username={username}/>
          </div>
        </section>

        <section id='teamWorkload'>
          <div className="container-lg">
            <TeamWorkload proxy={proxy} username={username}/>
          </div>
        </section>

        <section>
          <Footer />
        </section>
      </div>
    );
  }
}

export default App;
