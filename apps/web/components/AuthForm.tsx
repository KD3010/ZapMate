"use client";
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import FormInput from './FormInput';
import Button from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TSignup {
    signup_name: string,
    signup_email: string,
    signup_pw: string
}

export const SignupForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<TSignup>({signup_name:"", signup_email: "", signup_pw: ""});
    const router = useRouter();

    const signup = async (data: TSignup) => {
        setLoading(true);
        await axios.post("http://localhost:5000/api/auth/signup", {
            name: data?.signup_name,
            email: data?.signup_email,
            password: data?.signup_pw
        })
        .then((res) => {
            toast.success(res.data.message)
            setTimeout(() => {
                router.push("/login")
            }, 1000)
        }).catch(error => {
            toast.error(error.response.data.message)
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
    <div className='p-6 border border-gray-400 rounded-md w-full lg:w-[60%]'>
        <form className='flex flex-col gap-2'>
            <FormInput label='Name' name='signup_name' onChange={handleChange} />
            <FormInput label='Email' name='signup_email' onChange={handleChange}/>
            <FormInput label='Password' name='signup_pw' onChange={handleChange} />
            <p>By signing up, you agree to ZapMate's terms of service and privacy policy.</p>
            <div className='flex flex-col gap-2 items-center self-center'>
                <Button variant='primary' size='lg' onClick={handleSubmit}>
                   <span className='mr-2'>Get started for free</span> {loading && <Spinner color='white'/>}
                </Button>
                <Link href={"/login"}>Already have an account? Login</Link>
            </div>
        </form>
    </div>
  )
}

interface TLogin {
    login_email: string,
    login_pw: string
}

export const LoginForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<TLogin>({ login_email: "", login_pw: ""});
    const router = useRouter();

    const signup = async (data: TLogin) => {
        setLoading(true);
        await axios.post("http://localhost:5000/api/auth/signin", {
            email: data?.login_email,
            password: data?.login_pw
        })
        .then((res) => {
            toast.success(res.data.message);
            localStorage.setItem("token", res?.data?.data?.token)
            setTimeout(() => {
                router.push("/dashboard")
            }, 1000)
            
        }).catch(error => {
            toast.error(error.response.data.message)
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
    <div className='p-6 border border-gray-400 rounded-md w-full lg:w-[60%]'>
        <form className='flex flex-col gap-2'>
            <FormInput label='Email' name='login_email' onChange={handleChange}/>
            <FormInput label='Password' name='login_pw' onChange={handleChange} />
            <p>By signing up, you agree to ZapMate's terms of service and privacy policy.</p>
            <div className='flex flex-col gap-2 items-center self-center'>
                <Button variant='primary' size='lg' onClick={handleSubmit}>
                   <span className='mr-2'>Continue</span> {loading && <Spinner color='white'/>}
                </Button>
                <Link href={"/sign-up"}>Don't have an account? Signup</Link>
            </div>
        </form>
    </div>
  )
}
