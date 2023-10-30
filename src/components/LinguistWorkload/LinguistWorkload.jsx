import React, { Component } from 'react';
import './LinguistWorkload.css';
import WorkloadBarChart from '../WorkloadBarChart/WorkloadBarChart';
import CarouselComponent from '../CarouselComponent/CarouselComponent';

class LinguistWorkload extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username
        }
    }
    
    render() {

        const { proxy, username } = this.state;

        return (
            <div>
                <div className="row my-4">
                    <div className="col-md-3">
                        <div className="row g-1">
                            <div className="p-1 border border-2 rounded bg-dark-subtle">
                                <span className="input-group-text">My workload today</span>
                            </div>
                        </div>
                        <div className="row g-1">
                            <div className="p-1 barContainer">
    
                                <WorkloadBarChart proxy={proxy} username={username} daysRequired={1} daysAdvanced={0}/>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row g-1">
                            <div className="p-1 border border-2 rounded bg-dark-subtle" id="workloadHeader">
                                <span className="input-group-text">My future workload at a glance</span>
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="p-1 barContainer">
    
                                <CarouselComponent proxy={proxy} username={username}/>
    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LinguistWorkload;