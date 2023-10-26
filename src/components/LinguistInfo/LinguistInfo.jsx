import React, { Component } from 'react';

class LinguistInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            proxy: props.proxy,
            username: props.username,
            fullname: '',
            locale: ''
        }
    }

    componentDidMount() {
        this.fetchName();
        this.fetchLocale();
    }

    fetchName = () => {
        fetch(`${this.state.proxy}/name/${this.state.username}`)
            .then(response => response.json())
            .then(name => {
                this.setState({ fullname: name })
            })
    }

    fetchLocale = () => {
        fetch(`${this.state.proxy}/locale/${this.state.username}`)
            .then(response => response.json())
            .then(locale => {
                this.setState({ locale: locale })
            })
    }

    render() {

        const { fullname, locale } = this.state;

        return (
            <div>
                {/*  Title  */}
                <div className="row my-3">
                    <div className="col-sm-2 p-1 border border-2 rounded bg-primary-subtle text-center">
                        <span className="fs-5 fw-bold">My Workload</span>
                    </div>
                </div>

                {/*  Linguist info  */}
                <div className="row g-3 d-flex align-content-center">
                    <div className="col-sm-1 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                        <span className="fs-5 fw-bold">Name</span>
                    </div>
                    <div className="col-sm-5 d-flex align-content-center">
                        <span className="display-5" id="linguistName">{fullname}</span>
                    </div>
                    <div className="col-sm-1 p-1 border border-2 rounded bg-dark-subtle d-flex justify-content-center align-items-center">
                        <span className="fs-5 fw-bold">Locale</span>
                    </div>
                    <div className="col-sm-5 d-flex align-content-center">
                        <span className="display-5">{locale}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default LinguistInfo;