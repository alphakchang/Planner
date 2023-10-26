import React from 'react';
import './Navigation.css';
import logo from './alpha_logo.png';

const Navigation = () => {
    return (
        <nav className="navbar navbar-expand-md fixed-top" id="top">
            <div className="container-fluid">
                    <a href="https://alphacrc.com/">
                        <span className="m-3">
                            <img src={logo} height="50px" width="50px" alt='logo' />
                        </span>
                    </a>
                    <span className="fw-bold text-uppercase navbar-brand navTitle">
                        Alpha Work Allocation Planner
                    </span>

                {/* toggle button for mobile nav */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false"
                aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* navbar links */}
                <div className="collapse navbar-collapse justify-content-end align-center" id="main-nav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="#myWorkload" className="nav-link">My Workload</a>
                        </li>
                        <li className="nav-item">
                            <a href="#myTasks" className="nav-link">My Tasks</a>
                        </li>
                        <li className="nav-item">
                            <a href="#teamWorkload" className="nav-link">Team Workload</a>
                        </li>
                        <li className="nav-item">
                            <a href="tasks.html" className="nav-link">All Tasks</a>
                        </li>
                        <li className="nav-item">
                            <a href="https://portal.alphacrc.com:3443/" className="nav-link">Alpha Portal</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;