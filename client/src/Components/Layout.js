import React from 'react'
import NavBarComponent from './NavBar'

const Layout = ({children}) => {
  return (
    <div className='flex flex-col'>
    <NavBarComponent />
    <div>
        {children}
    </div>
    </div>
  )
}

export default Layout