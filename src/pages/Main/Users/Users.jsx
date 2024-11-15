import React from 'react'
import { Outlet } from 'react-router-dom'
import './Users.css'


function Users() {
  return (
    <>
        <div className='users-header'>User Management</div>
        <Outlet />
    </>
  )
}

export default Users