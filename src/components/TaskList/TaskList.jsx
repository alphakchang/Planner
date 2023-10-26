import React, { Component } from 'react';

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

    componentDidMount() {
        this.fetchTotalTaskCount();
        this.fetchAllTasks();
    }

    fetchTotalTaskCount = () => {
        fetch(`${this.state.proxy}/taskCount/${this.state.username}`)
            .then(response => response.json())
            .then(count => {
                this.setState({ totalTaskCount: count })
            })
    }

    fetchAllTasks = () => {
        fetch(`${this.state.proxy}/allTasks/${this.state.username}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ allTasks: data })
            })
    }
    
    render() {

        const { totalTaskCount, allTasks } = this.state;
        const task = allTasks[0];

        return (
            <div>
                {/*  Task summary  */}
                <div className="row g-3 d-flex align-content-center">
                    <div className="col-sm-3 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                        <span className="fs-5 fw-bold">My tasks count</span>
                    </div>
                    <div className="col-sm-9 d-flex align-content-center">
                        <span className="display-5" id="taskCount">{totalTaskCount}</span>
                    </div>
                </div>

                {/*  Linguist info  */}
                <div className="row g-3 d-flex align-content-center my-1">
                    <div className="col-8 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Task Name</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Deadline</span></div>
                    <div className="col-2 p-1 border border-2 rounded bg-dark-subtle"><span className="input-group-text">Budget</span></div>
                </div>
                {allTasks.map((task, index) => (
                <div className="row g-3 d-flex align-content-center my-1" key={index}>
                    <div className="col-8">{task ? task.task_name : 'Loading...'}</div>
                    <div className="col-2">{task ? task.deadline : 'Loading...'}</div>
                    <div className="col-2">{task ? task.required_hours : 'Loading...'}</div>
                </div>
                ))}
            </div>
        );
    }
}

export default TaskList;