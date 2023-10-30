import React, { Component } from 'react';
import './TeamWorkload.css';
import WorkloadBarChart from '../WorkloadBarChart/WorkloadBarChart';

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
            isLoading: true
        }
    }

    async componentDidMount() {
        await this.fetchTeam();
        this.setState({ isLoading: false });
    }


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

        const { proxy, teamName, teamObject } = this.state;

        return(
            <div>
                <div className="row g-3 d-flex align-content-center">
                    <div className="col-sm-1 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                        <span className="fs-5 fw-bold">Team</span>
                    </div>
                    <div className="col-sm-5 d-flex align-content-center">
                        <span className="display-5" id="teamName">{teamName ? teamName : 'Loading...'}</span>
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
                            <div className="row">
                                <div className='text-center'>
                                    {fullname}
                                </div>
                            </div>
                            <div className="row">
                                <div className="barContainer">
                                    <WorkloadBarChart proxy={proxy} username={username} daysRequired={1} daysAdvanced={0}/>
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