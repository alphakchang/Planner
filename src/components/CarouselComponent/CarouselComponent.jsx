import React from "react";
import { Carousel, Button } from 'react-bootstrap';
import WorkloadBarChart from "../WorkloadBarChart/WorkloadBarChart";
import './CarouselComponent.css';
 
class CarouselComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username,
            triggerRender: false,
            index: 0,  // Current index of carousel
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.barChartRef1 = React.createRef();
        this.barChartRef2 = React.createRef();
        this.barChartRef3 = React.createRef();
    }

    handleSelect(selectedIndex, e) {
        this.setState({ index: selectedIndex });
    }

    nextPage() {
        if (this.state.index < 2) {
            this.handleSelect(this.state.index + 1);
        }
    }

    prevPage() {
        if (this.state.index > 0) {
            this.handleSelect(this.state.index - 1);
        }
    }

    carouselRerender = () => {
        console.log('Carousel starting to rerender!');
        this.setState(prevState => ({
            triggerRender: !prevState.triggerRender
        }));
        if (this.barChartRef1.current) {
            this.barChartRef1.current.refreshWorkload();
        }
        if (this.barChartRef2.current) {
            this.barChartRef2.current.refreshWorkload();
        }
        if (this.barChartRef3.current) {
            this.barChartRef3.current.refreshWorkload();
        }
    }

    render() {

        const { proxy, username } = this.state;

        return (
            <div>
                <Carousel
                    activeIndex={this.state.index}
                    onSelect={this.handleSelect}
                    interval={null}
                    indicators={false}
                    wrap={false}
                    nextIcon={null}
                    prevIcon={null}
                >

                {/* This carousel shows workload chart 5 days at a time, up to one month in the future,
                to change the number of days showing per chart, adjust daysRequired and daysAdvanced props.
                Alternatively, add more carousel items. */}

                    <Carousel.Item className="chartDisplay">
                        <WorkloadBarChart proxy={proxy} username={username} daysRequired={5} daysAdvanced={1} ref={this.barChartRef1}/>
                    </Carousel.Item>

                    <Carousel.Item className="chartDisplay">
                        <WorkloadBarChart proxy={proxy} username={username} daysRequired={5} daysAdvanced={6} ref={this.barChartRef2}/>
                    </Carousel.Item>

                    <Carousel.Item className="chartDisplay">
                        <WorkloadBarChart proxy={proxy} username={username} daysRequired={5} daysAdvanced={11} ref={this.barChartRef3}/>
                    </Carousel.Item>
                    
                </Carousel>
                <div className="d-flex justify-content-around">
                    <Button variant="outline-success" size="sm" onClick={this.prevPage} disabled={this.state.index === 0}>Previous 5 working days</Button>
                    <Button variant="outline-success" size="sm" onClick={this.nextPage} disabled={this.state.index === 2}>Next 5 working days</Button>
                </div>
                
            </div>
        )
    };
}
 
export default CarouselComponent;