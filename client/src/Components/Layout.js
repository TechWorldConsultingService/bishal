import React from 'react'
import NavbarComponent from './NavbarComponent'

const Layout = ({children}) => {
  return (
    <div className='flex flex-col'>
    <NavbarComponent />
    <div>
        {children}
    </div>
    </div>
  )
}

export default Layout