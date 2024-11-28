"use client";
import React, { useState } from 'react'
import Button from './Button';
import ZapCell from './ZapCell';
import { TSelectedAction, TSelectedTrigger } from '@repo/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const emptyAction = {
    availableActionId: "",
    actionType: "",
    actionMetaData: {}
}

const PublishZap = () => {
    const router = useRouter();
    const [selectedTrigger, setSelectedTrigger] = useState<TSelectedTrigger>();
    const [selectedActions, setSelectedActions] = useState<TSelectedAction[]>([emptyAction]);

    const handlePublish  = async () => {
        if(!selectedTrigger) {
            toast.error("Invalid trigger selection!");
            return;
        }
        const createZapData = {
            "availableTriggerId": selectedTrigger.availableTriggerId,
            "triggerMetaData": {},
            "actions": selectedActions.map((action) => ({
                availableActionId: action.availableActionId,
                actionMetaData: {}
            }))
        }

        try {
            await axios.post("http://localhost:5000/api/zaps", createZapData, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })

            router.push("/dashboard");
        } catch(error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

  return (
    <>
    <div className='self-end mr-10'>
        <Button variant='secondary' onClick={handlePublish} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
          <p className='mr-1'>Publish</p>
        </Button>
    </div>
    <div className='mt-20 flex flex-col gap-3'>
        <ZapCell index={1} setSelectedTrigger={setSelectedTrigger} selectedTrigger={selectedTrigger} />
        {selectedActions?.map((action, index) => (
            <div key={index + 1}><ZapCell index={index + 2} setSelectedActions={setSelectedActions} selectedActions={selectedActions} action={action} /></div>
        ))}
    </div>
    <div className='mt-10'>
        <button onClick={() => setSelectedActions([...selectedActions, emptyAction])} className='bg-secondary-500 shadow-md hover:bg-secondary-700 hover:shadow-lg transition-all p-2 rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
    </>
  )
}

export default PublishZap