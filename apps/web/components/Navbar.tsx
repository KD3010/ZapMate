"use client";
import Link from 'next/link'
import React from 'react'
import Button from './Button'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    if(["/login", "/signup"].includes(pathname)) return <></>

  return (
    <nav className='w-full px-4 h-14 border-b border-gray-300 flex items-center justify-between transition-all'>
        <Link href="/" className='text-primary-500 font-bold text-2xl'>Zap<span className='text-black font-bold'>Mate</span></Link>
        <div className='flex gap-2'>
            <Button variant='link' onClick={() => router.push("/login")}>Login</Button>
            <Button variant='primary' onClick={() => router.push("/sign-up")}>Signup</Button>
        </div>
    </nav>
  )
}

export default Navbar