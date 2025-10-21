import React from 'react'
import { Link } from 'react-router-dom'

const UserNavbar = () => {
  return (
    <div className='w-full h-[70px] bg-[var(--primary--color)] p-2 flex items-center justify-between'>
        <h2 className='text-3xl text-white'>Quick Serve App</h2>
        <div className='flex gap-3'>
          <Link className='text-white'>Home</Link>
          <Link className='text-white'>My Bookings</Link>
        </div>
        <div className='rounded-[50%] w-[50px] bg-white h-[50px] flex items-center justify-center'>
            <Link to={"/user/profilesetup"}>p</Link>
        </div>
    </div>
  )
}

export default UserNavbar