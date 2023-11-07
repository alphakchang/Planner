import React, { Component } from 'react';
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
                this.setState({teamTotalTaskCount: count})
            })
    }

    fetchTeamAllTasks = () => {
        fetch(`${this.state.proxy}/teamAllTasks/${this.state.team}`)
            .then(response => response.json())
            .then(data => {
                this.setState({teamAllTasks: data})
            })
    }

    refreshTaskList = async () => {
        this.fetchTeamTotalTaskCount();
        this.fetchTeamAllTasks();
    }    

    render() {
        
        const { proxy, username, teamTotalTaskCount, teamAllTasks } = this.state;

        return(
            <div>
                {/*  Task summary  */}
                <div className="row g-3 d-flex align-content-center">
                    <div className="col-sm-3 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                        <span className="fs-5 fw-bold">Team tasks count</span>
                    </div>
                    <div className="col-sm-9 d-flex align-content-center">
                        <span className="display-5" id="taskCount">{teamTotalTaskCount}</span>
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