import React, { Component } from 'react';
import './TeamWorkload.css';
import WorkloadBarChart from '../WorkloadBarChart/WorkloadBarChart';
import OffCanvasWindow from '../OffCanvasWindow/OffCanvasWindow';
import TeamTaskList from '../TeamTaskList/TeamTaskList';


class TeamWorkload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            proxy: this.props.proxy,
            username: this.props.username,
            teamName: '',
            teamMembers: [],
            memberNames: [],
            teamObject: {},
            isLoading: true,
            triggerRender: false,
        }
        this.barChartRefs = {};
    }

    async componentDidMount() {
        await this.fetchTeam();
        await this.createRefs();
        this.setState({ isLoading: false });
    }

    createRefs = async () => {
        // Create a ref for each team member and store it in the barChartRefs object
        this.state.teamMembers.forEach(member => {
            this.barChartRefs[member] = React.createRef();
        });
        this.forceUpdate(); // Force an update to ensure the refs are set before rendering
    }

    triggerRerender = async () => {
        console.log('TeamWorkload rerendered!');
        this.setState(prevState => ({
            triggerRender: !prevState.triggerRender
        }), () => {
            // Refresh workload for all members using their refs
            Object.values(this.barChartRefs).forEach(ref => {
                if (ref.current) {
                    ref.current.refreshWorkload();
                }
            });
        });
    };


    fetchTeam = async () => {
        try {
            const response1 = await fetch(`${this.state.proxy}/team-name/${this.state.username}`);
            const teamName = await response1.json();
            await new Promise(resolve => this.setState({ teamName: teamName }, resolve));
            
            const response2 = await fetch(`${this.state.proxy}/team-members/${this.state.teamName}`);
            const members = await response2.json();
            await new Promise(resolve => this.setState({ teamMembers: members }, resolve));
    
            // Create an array of promises
            const namePromises = this.state.teamMembers.map(member =>
                fetch(`${this.state.proxy}/name/${member}`).then(response => response.json())
            );
    
            // Wait for all promises to resolve
            const nameList = await Promise.all(namePromises);
    
            // Update the state with the resolved values
            await new Promise(resolve => this.setState({ memberNames: nameList }, resolve));

            // put them all into an object to be used in render
            let object = {};
            for (let i = 0; i < this.state.teamMembers.length; i++) {
                object[this.state.teamMembers[i]] = this.state.memberNames[i];
            }

            await new Promise(resolve => this.setState({ teamObject: object }, resolve));
    
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    }
    

    render() {

        if (this.state.isLoading) {
            return <div>Loading...</div>
        }

        const { proxy, username, teamName, teamObject } = this.state;

        return(
            <div>
                <div className="row g-3 d-flex align-content-center justify-content-between">
                    <div className='col-4'>
                        <div className='row'>
                            <div className="col-6 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                                <span className="fs-5 fw-bold">Team</span>
                            </div>
                            <div className="col-6 d-flex align-content-center">
                                <span className="display-5" id="teamName">{teamName ? teamName : 'Loading...'}</span>
                            </div>
                        </div>
                    </div>
                    <div className='col-4 d-flex justify-content-end align-items-center'>
                        <OffCanvasWindow
                            canvasName={"List of all team tasks"}
                            content={<TeamTaskList proxy={proxy} username={username} team={teamName} onTriggerRerender={this.props.onTriggerRerender}/>}
                            onClosing={this.props.onRefreshTaskList} // reminder - this is the prop to re-render TaskList
                        />
                    </div>
                </div>

                <div className="row g-1 my-4">
                    <div className="p-1 border border-2 rounded bg-dark-subtle">
                        <span className="input-group-text">Team workload today</span>
                    </div>
                </div>
                <div className="teamWorkLoad">
                {Object.entries(teamObject).map(([username, fullname], index) => (
                    <React.Fragment key={index}>
                        <div>
                            <div className="row mt-4">
                                <div className='text-center'>
                                    <span className="border rounded p-2 bg-success-subtle">
                                        {fullname}
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="barContainer">
                                    <WorkloadBarChart proxy={proxy} username={username} daysRequired={1} daysAdvanced={0} ref={this.barChartRefs[username]}/>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
                </div>
            </div>
        );
    }
}

export default TeamWorkload;