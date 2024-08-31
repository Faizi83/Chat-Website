import React from 'react'
import Navbar from '../Components/Navbar'; 

const Settings = () => {
    return  (
        <div className="chat-section">
          <div className="chat-container">
            {/* Sidebar */}
            <Navbar/>
           
            {/* Profile details */}
            <h1 className='ml-60'>Settings Here</h1>
          </div>
        </div>
      );
}

export default Settings