"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import FormInput from './FormInput';
import Button from './Button';
import Link from 'next/link';

interface TSignup {
    name: string,
    email: string,
    password: string
}

export const SignupForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<TSignup>({name:"", email: "", password: ""});

    const signup = async (data: TSignup) => {
        setLoading(true);
        await axios.post("/signup", data)
        .then((res) => {
            console.log(res)
        }).catch(error => {
            toast.error(error.message)
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleChange = (e: any) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        signup(data)
    }

  return (
    <div className='p-6 border border-gray-400 rounded-md'>
        <form className='flex flex-col gap-2'>
            <FormInput label='Name' name='signup_name' onChange={handleChange} />
            <FormInput label='Email' name='signup_email' onChange={handleChange}/>
            <FormInput label='Password' name='signup_pw' onChange={handleChange} />
            <p>By signing up, you agree to ZapMate's terms of service and privacy policy.</p>
            <div className='flex flex-col gap-2 items-center self-center'>
                <Button variant='primary' size='lg' onClick={handleSubmit}>
                    Get started for free {loading && <Spinner color='white' size={4} />}
                </Button>
                <Link href={"/login"}>Already have an account? Login</Link>
            </div>
        </form>
    </div>
  )
}
