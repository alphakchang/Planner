import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ActionButton from '../ActionButton/ActionButton';

const formatDeadline = (datetime) => {
    // Parse the datetime string from the database
    var date = new Date(datetime);

    // Extract components using local time
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    var year = date.getFullYear();
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');

    // Construct formatted string
    return `${day}-${month}-${year} - - ${hours}:${minutes}`
}

class TeamTaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username,
            team: props.team,
            teamTotalTaskCount: 0,
            teamAllTasks: []
        }
    }

    componentDidMount() {
        this.fetchTeamTotalTaskCount();
        this.fetchTeamAllTasks();
    }

    fetchTeamTotalTaskCount = () => {
        fetch(`${this.state.proxy}/teamTaskCount/${this.state.team}`)
            .then(response => response.json())
            .then(count => {
                this.setState({ teamTotalTaskCount: count })
            })
    }

    fetchTeamAllTasks = () => {
        fetch(`${this.state.proxy}/teamAllTasks/${this.state.team}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ teamAllTasks: data })
            })
    }

    refreshTaskList = async () => {
        this.fetchTeamTotalTaskCount();
        this.fetchTeamAllTasks();
    }

    // Prototype feature: Add a task

    randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    addWorkingDays = (startDate, daysToAdd) => {
        var currentDate = new Date(startDate.getTime());
        while (daysToAdd > 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            // If current day is Saturday or Sunday, skip it
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                daysToAdd--;
            }
        }
        return currentDate;
    }

    getRandomWorkingDate = () => {
        const today = new Date();
        const randomWorkingDays = Math.floor(Math.random() * 12) + 1; // 1 to 10 working days
        const randomDate = this.addWorkingDays(today, randomWorkingDays);
        const day = String(randomDate.getDate()).padStart(2, '0');
        const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
        const year = randomDate.getFullYear();
        const hours = String(randomDate.getHours()).padStart(2, '0');
        const minutes = String(randomDate.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    addTask = async () => {
        const newTask = {
            username: '',
            centre: this.state.team,
            task_name: this.randomItem(['drink coffee', 'make coffee', 'select beans', 'milk frothing', 'clean up', 'random chat', 'choose coffee type', 'wash mug']),
            locale: this.randomItem(['FR', 'DE', 'ES', 'IT', 'JA', 'KO', 'ZH']),
            required_hours: (Math.random() * (8 - 1) + 1).toFixed(2),
            deadline: this.getRandomWorkingDate(),
            status: 'Unassigned',
            job_number: 54321,
            task_number: 13579
        }
        try {
            const response = await fetch(`${this.state.proxy}/addTask`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const addedTask = await response.json();
            if (addedTask) {
                this.refreshTaskList();
            }
        } catch (error) {
            console.error('There has been a problem when trying to add a task', error);
        }
    }

    render() {

        const { proxy, username, teamTotalTaskCount, teamAllTasks } = this.state;

        return (
            <div>
                {/*  Task summary  */}
                <div className="row g-3 d-flex align-content-center">
                    <div className="col-sm-3 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                        <span className="fs-5 fw-bold">Team tasks count</span>
                    </div>
                    <div className="col-sm-7 d-flex align-content-center">
                        <span className="display-5" id="taskCount">{teamTotalTaskCount}</span>
                    </div>
                    <div className="col-sm-2 d-flex align-content-center">
                        <Button variant="outline-info" onClick={this.addTask}>Prototype Feature: Add a task</Button>
                    </div>
                </div>

                {/*  Linguist info  */}
                <div className="row g-3 d-flex align-content-center my-1">
                    <div className="col-5 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Task Name</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Deadline</span></div>
                    <div className="col-1 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Budget</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Assignee</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Action</span></div>
                </div>
                {teamAllTasks.map((task) => (
                    <div className="row g-3 d-flex align-content-center my-1" key={task.task_id}>
                        <div className="col-5">{task ? task.task_name : 'Loading...'}</div>
                        <div className="col-2">{task ? formatDeadline(task.deadline) : 'Loading...'}</div>
                        <div className="col-1">{task ? task.required_hours : 'Loading...'}</div>
                        <div className="col-2">{task ? task.username : 'Loading...'}</div>
                        <div className="col-2">{task ? <ActionButton
                            proxy={proxy}
                            username={username}
                            task_id={task.task_id}
                            onActionComplete={this.refreshTaskList} // own method
                            onActionComplete2={this.props.onTriggerRerender} // props from App
                        />
                            : 'Loading...'}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default TeamTaskList;