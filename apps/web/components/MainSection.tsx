"use client";
import React, { useState } from 'react'
import Navbar from './Navbar';
import { getSessionDetails } from '@/helper';

function MainSection({children}: {
    children?: React.ReactNode
}) {  
    const session = getSessionDetails();
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
  return (
    <div className="w-full h-full overflow-x-hidden z-10" onClick={() => dropdownVisible && setDropdownVisible(false)}>
      <Navbar dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} session={session.token as string} />
      {children}
    </div>
  )
}

export default MainSection