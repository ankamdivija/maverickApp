import React, { useState } from 'react';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = (props) => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <ul>
        <li className={props.tab == 'profile' ? 'active' : ''} onClick={() => navigate('/dashboard/profile')}>Profile</li>
        <li className={props.tab == 'users' ? 'active' : ''} onClick={() => navigate('/dashboard/users')}>Manage Users</li>
        <li className={props.tab == 'questions' ? 'active' : ''} onClick={() => navigate('/dashboard/questions')}>Manage Questionnaire</li>
        <li className={props.tab == 'resources' ? 'active' : ''} onClick={() => navigate('/dashboard/resources')}>Manage Resource</li>
        <li className={props.tab == 'daily' ? 'active' : ''} onClick={() => navigate('/dashboard/daily-questions')}>Manage Daily Questionnaire</li>
      </ul>
    </div >
  );
};

export default Sidebar;
