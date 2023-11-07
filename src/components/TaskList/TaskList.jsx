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

class TaskList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username,
            totalTaskCount: 0,
            allTasks: [],
        }
    }

    componentDidMount = async () => {
        await this.fetchTotalTaskCount();
        await this.fetchAllTasks();
    }

    fetchTotalTaskCount = async () => {
        try {
            const response = await fetch(`${this.state.proxy}/taskCount/${this.state.username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const count = await response.json();
            await new Promise(resolve => this.setState({ totalTaskCount: count }, resolve));
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    fetchAllTasks = async () => {
        try {
            const response = await fetch(`${this.state.proxy}/allTasks/${this.state.username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            await new Promise(resolve => this.setState({ allTasks: data }, resolve));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    refreshTaskList = async () => {
        await this.fetchAllTasks();
        await this.fetchTotalTaskCount();
    }    
    
    render() {

        const { proxy, totalTaskCount, allTasks, username } = this.state;

        return (
            <div>
                {/*  Task summary  */}
                <div className="row g-3 d-flex align-content-center">
                    <div className="col-4">
                        <div className="row">
                            <div className="col-6 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                                <span className="fs-5 fw-bold">My tasks count</span>
                            </div>
                            <div className="col-6 d-flex align-content-center">
                                <span className="display-5" id="taskCount">{totalTaskCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Linguist info  */}
                <div className="row g-3 d-flex align-content-center my-1">
                    <div className="col-6 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Task Name</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Deadline</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Budget</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Action</span></div>
                </div>
                {allTasks.map((task) => (
                    <div className="row g-3 d-flex align-content-center my-1" key={task.task_id}>
                        <div className="col-6">{task ? task.task_name : 'Loading...'}</div>
                        <div className="col-2">{task ? formatDeadline(task.deadline) : 'Loading...'}</div>
                        <div className="col-2">{task ? task.required_hours : 'Loading...'}</div>
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

export default TaskList;