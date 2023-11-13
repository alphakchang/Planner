import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

/**
 * This component allows the user to perform actions on a task
 * 
 * The actions available are dependent on the status of the task
 * 
 * If the task is unassigned, the user can claim the task
 * If the task is assigned to the user, the user can mark the task as done or unclaim the task
 * 
 * 
 */

class ActionButton extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            task_id: props.task_id,
            username: props.username,
            isAssignedToMe: false,
            isLoading: true
        }
    }

    componentDidMount() {
        const { task_id } = this.state;
        this.checkIsAssignedToMe(task_id).then(isAssigned => {
            this.setState({ isAssignedToMe: isAssigned, isLoading: false });
        });
    }

    checkIsAssignedToMe = async (task_id) => {
        try {
            const response = await fetch(`${this.state.proxy}/task/${task_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const task = await response.json();
            return task.status === 'Assigned' && task.username === this.state.username;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    markDone = async (task_id) => {
        try {
            const response = await fetch(`${this.state.proxy}/markDone`, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ task_id })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const task = await response.json();
            if (task.status === 'Done') {
                this.props.onActionComplete();
            }
            return task.status === 'Done';
        } catch (error) {
            console.error(`There has been a problem when trying to mark task ${task_id} as Done`, error);
        }
    }

    assignTo = async (task_id, username) => {
        try {
            const response = await fetch(`${this.state.proxy}/assign`, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ task_id, username })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const task = await response.json();
            if (task.username === username) {
                await this.props.onActionComplete();
                await this.props.onActionComplete2();
                this.setState({isAssignedToMe: true})
            }
            return task.username === username;
        } catch (error) {
            console.error(`There has been a problem when trying to assign the task to ${username}`, error);
        }
    }

    unclaim = async (task_id) => {
        try {
            const response = await fetch(`${this.state.proxy}/unclaim`, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ task_id })
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const task = await response.json();
            if (task.status === 'Unassigned') {
                await this.props.onActionComplete();
                await this.props.onActionComplete2();
                this.setState({isAssignedToMe: false})
            }
            return task.status === 'Unassigned';
        } catch (error) {
            console.error(`There has been a problem when trying to unclaim task ${task_id}`, error);
        }
    }

    render() {

        const { isAssignedToMe, isLoading, task_id, username } = this.state;

        // Handle loading state appropriately
        if (isLoading) {
            return <div>Loading...</div>;
        }

        return(
            <Dropdown 
                as={ButtonGroup}
                size="sm"
            >
                {!isAssignedToMe ? (
                    <>
                        <Button variant="secondary" onClick={() => this.assignTo(task_id, username)}>Claim this task</Button>
                    </>
                ) : (
                    <>
                        <Button variant="success" onClick={() => this.markDone(task_id)}>Mark as Done</Button>
                        <Dropdown.Toggle split variant="success" id="dropdown-split" />
                        <Dropdown.Menu>
                            {/* <Dropdown.Divider /> */}
                            <Dropdown.Item onClick={() => this.unclaim(task_id)}>Unclaim this task</Dropdown.Item>
                        </Dropdown.Menu>
                    </>
                )}
                
            </Dropdown>
        );
    }
}

export default ActionButton;