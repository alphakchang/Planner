import React, { Component } from 'react';
import Chart from 'chart.js/auto';

// Bar chart color picker

const backgroundColors = (values, members=1) => {
    return values.map((value) => {
        if (value > 7*members) {
            return 'rgba(200, 0, 0, 0.4)'; // red
        } else if (value > 6*members) {
            return 'rgba(200, 200, 0, 0.4)'; // yellow
        } else {
            return 'rgba(0, 200, 0, 0.4)'; // green
        }
    });
};

const borderColors = (values, members=1) => {
    return values.map((value) => {
        if (value > 7*members) {
            return 'rgba(255, 0, 0, 0.9)'; // red
        } else if (value > 6*members) {
            return 'rgba(255, 255, 0, 0.9)'; // yellow
        } else {
            return 'rgba(0, 255, 0, 0.9)'; // green
        }
    });
};

const convertDateToSimpleFormat = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because Months are 0-indexed
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}

const generateDates = (daysRequired, daysAdvanced) => {
    if (daysRequired < 0) {
        throw new Error("The number of dates cannot be negative");
    }

    const dates = [];
    let todayDate = new Date();
    
    // Adjust todayDate by 'daysAdvanced' weekdays
    while (daysAdvanced > 0) {
        todayDate.setDate(todayDate.getDate() + 1);
        if (todayDate.getDay() !== 0 && todayDate.getDay() !== 6) {
            daysAdvanced--;
        }
    }

    let i = 0;
    while (dates.length < daysRequired) {
        const newDate = new Date(todayDate);
        newDate.setDate(todayDate.getDate() + i);

        const dayOfWeek = newDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          dates.push(convertDateToSimpleFormat(newDate));
        }

        i++;
    }

    return dates;
}

class WorkloadBarChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username,
            workloadData: [],
            daysRequired: props.daysRequired, // Controls how many working days are displayed by the chart
            daysAdvanced: props.daysAdvanced, // Controls the first date showing on the chart, 0 daysAdvanced means today, 1 daysAdvanced means tomorrow, etc.
            loading: true
        };
        this.chartRef = React.createRef();
    }

	componentDidMount() {
        this.fetchWorkload();
    }

    refreshWorkload = async () => {
        await this.fetchWorkload();
    }

    fetchWorkload = async () => {
        try {
          const { daysRequired, daysAdvanced } = this.state;
          const newDates = generateDates(daysRequired, daysAdvanced);
          const workloadDataArray = [];
      
          for (const date of newDates) {
            const response = await fetch(`${this.state.proxy}/workload/${this.state.username}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ date })
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const workload = await response.json();
            workloadDataArray.push(workload);
          }
      
          this.setState({ workloadData: workloadDataArray, loading: false }, () => {
            this.setupChart(newDates);
          });
        } catch (error) {
          console.error('Error:', error);
        }
      };
      

    setupChart = (dates) => {
        const { workloadData } = this.state;
        const labels = dates;
        
        // Find the maximum value in the workloadData array
        const maxWorkload = Math.max(...workloadData);
        const suggestedMax = maxWorkload > 8 ? Math.ceil(maxWorkload / 2) * 2 : 8;
    
        const ctx = this.chartRef.current.getContext("2d");
    
        // Destroy the previous chart instance before creating a new one
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        this.chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Workload - Hours",
                    data: workloadData,
                    backgroundColor: backgroundColors(workloadData),
                    borderColor: borderColors(workloadData),
                    borderWidth: 1.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: suggestedMax
                    }
                },
                layout: {
                    padding: 20
                }
            }
        });
    }

	render() {
        const { loading } = this.state;
        
        if (loading) {
            return <div>Loading...</div>;
        }
    
        return (
            <div style={{ height: '100%' }}>
                <canvas
                    id="workloadChart"
                    ref={this.chartRef}
                />
            </div>
        );
    }
}

export default WorkloadBarChart;