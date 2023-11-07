import React, { Component } from 'react';
import './LinguistWorkload.css';
import WorkloadBarChart from '../WorkloadBarChart/WorkloadBarChart';
import CarouselComponent from '../CarouselComponent/CarouselComponent';

class LinguistWorkload extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username,
            triggerRender: false
        }
        this.barChartRef = React.createRef();
        this.carouselRef = React.createRef();
    }

    triggerRerender = () => {
        console.log('LinguistWorkload rerendered!');
        this.setState(prevState => ({
            triggerRender: !prevState.triggerRender
        }));
        this.handleRefreshWorkload();
    };

    handleRefreshWorkload = () => {
        if (this.barChartRef.current) {
            this.barChartRef.current.refreshWorkload();
            console.log('BarChart rerendered!');
        }
        if (this.carouselRef.current) {
            this.carouselRef.current.carouselRerender();
            console.log('Carousel rerendered!');
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
    
                                <WorkloadBarChart proxy={proxy} username={username} daysRequired={1} daysAdvanced={0} ref={this.barChartRef}/>
                                
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
    
                                <CarouselComponent proxy={proxy} username={username} ref={this.carouselRef}/>
    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LinguistWorkload;