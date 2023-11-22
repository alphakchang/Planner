import React from 'react';
import './Navigation.css';
import logo from './alpha_logo.png';

/**
 * This component is the navigation bar of the application
 * @returns Navigation bar component
 */

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
                            <a href="https://naga.alphacrc.com:5214" className="nav-link">AI Playground</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;