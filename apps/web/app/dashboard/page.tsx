"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import MainSection from "@/components/MainSection";
import Button from '@/components/Button';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import { formatDateTimeToCustomString, getSessionDetails } from '../../helper';
import { useRouter } from 'next/navigation';

interface TZap {
    id: string,
    name?: string,
    triggerId: string,
    action: TAction[]
    trigger: TTrigger
    createdDate: Date | string
  }
  
  interface TAction {
    id: string,
    actionId: string,
    zapId: string,                     
    sortingOrder: number                      
    metadata: JSON | null
  }
  
  interface TTrigger {
    id: string,
    metadata: JSON | null
    triggerId: string
    zapId: string
  }

function page() {
    const router = useRouter();
    const session = getSessionDetails();
    if(!session.token) router.push("/")

    const [loading, setLoading] = useState<boolean>(true);
    const [linkCopied, setLinkCopied] = useState<boolean>(false);
    const [data, setData] = useState<{zaps: TZap[] | [], total: number}>({zaps: [], total: 0})

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/zaps`, {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                    'Cache-Control': 'no-cache',
                  }
                })

                setData({zaps: response?.data?.data?.zaps, total: response?.data?.data?.total})
              } catch (error) {
                toast.error("Couldn't fetch the data");
              }
            setLoading(false);
        }

        fetchData();
    }, [])

    const handleCreateClick = () => {
        router.push("/editor")
    }

    const handleUrlCopy = async (url: string) => {
        try {
            await window.navigator.clipboard.writeText(url);
            toast.info("Copied to clipboard!");
        } catch (err) {
            toast.error("Unable to copy to clipboard");
        }
        setLinkCopied(true);
    }

  return (
    <MainSection>
        <div className='flex flex-col py-4 px-20 gap-6'>
            <div className='flex justify-between items-center'>
                <h3 className='text-4xl font-semibold '>Zaps</h3>
                <Button variant='secondary' onClick={handleCreateClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    <span className='mx-2 my-1'>Create</span>
                </Button>
            </div>
            {loading ? <div className='mt-20 w-full text-center'><Spinner color='primary' /></div> : (
                <table>
                <thead>
                    <tr>
                        <th className='font-normal py-3 border-b border-gray-200 text-start w-64'>Name</th>
                        <th className='font-normal py-3 border-b border-gray-200 text-start'>Webhook URL</th>
                        <th className='font-normal py-3 border-b border-gray-200 text-start w-64'>Created At</th>
                        <th className='font-normal py-3 border-b border-gray-200 text-center w-20'>Status</th>
                        <th className='font-normal py-3 border-b border-gray-200 text-start'></th>
                    </tr>
                </thead>
                <tbody>
                    {data.total > 0 && (data?.zaps?.map((zap: TZap) => {
                        const url = `http://localhost:8000/hooks/2/${zap.id}`;
                        
                        return (<tr key={zap.id}>
                            <td className='font-normal py-3 border-b border-gray-200 text-start'>{zap.name}</td>
                            <td className='font-normal py-3 border-b border-gray-200 text-start'>
                                {linkCopied ? 
                                    (<div className='flex gap-10'>{url} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#695BE8" className="size-6">
                                        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                                        <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                                    </svg></div>)
                                : 
                                    (<div className='flex gap-10'>{url} 
                                        <svg onClick={() => handleUrlCopy(url)} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth={1.5} fill="#FFFFFF" stroke="#695BE8" className="size-6 cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                        </svg>
                                    </div>)
                                }
                            </td>
                            <td className='font-normal py-3 border-b border-gray-200 text-start'>{formatDateTimeToCustomString(zap.createdDate)}</td>
                            <td className='font-normal py-3 border-b border-gray-200 text-center'>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                                </label>
                            </td>
                            <td className='font-normal py-3 border-b border-gray-200 text-start w-5 cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                                </svg>
                            </td>
                        </tr>)
                    }))}
                </tbody>
            </table>
            )}
        </div>
    </MainSection>
  )
}

export default page