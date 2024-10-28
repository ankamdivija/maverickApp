import React from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import UserTable from './UserTable';
//import Pagination from './components/Pagination';
import './Users.css';

const Users = (props) => {
  return (
    <div className="user-content">
      <SideBar access="true" tab="users" />
      <div className="user-main-content">
        <UserTable username={props.userInfo.username} />
      </div>
    </div>
  );
};

export default Users;
