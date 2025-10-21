import React from 'react'
import UserNavbar from './UserNavbar'

const UserDashBoard = () => {
  return (
    <div className='w-full'>
      <UserNavbar/>

      <div className='p-2 w-full border-[1px]'>
        <div className="search border-[1px] mx-auto w-[50%] p-1 mt-10">
          <input type="text" placeholder='Search Your Service' className='w-[95%] p-1 outline-none' />
        </div>
      </div>

      
    </div>
  )
}

export default UserDashBoard