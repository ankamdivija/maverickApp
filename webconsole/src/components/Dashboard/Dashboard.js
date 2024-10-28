import React from 'react';
import NavBar from '../Utils/NavBar';
import './Dashboard.css';
import { Outlet } from 'react-router-dom';

const Dashboard = (props) => {
    return (
        <div className="container">
            {props.userInfo.username ? <> <NavBar userLoggesIn="true" username={props.userInfo.username} />
                <div className="content">
                    {/* Changable content based on different url */}
                    <Outlet />
                </div>
            </> : <>
                <h1 style={{ marginTop: '5rem' }}>You are not authorized to view this page</h1>
                <p style={{ marginTop: '3rem' }}>Please login <a href="/">here</a> to access adminstrative page</p>
            </>
            }
        </div>
    );
};

export default Dashboard;
