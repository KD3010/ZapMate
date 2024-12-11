"use client";
import React, { useEffect, useState } from 'react'
import Button from './Button';
import ZapCell from './ZapCell';
import { TSelectedAction, TSelectedTrigger } from '@repo/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import Modal from './Modal';

const emptyAction = {
    availableActionId: "",
    actionType: "",
    actionMetaData: {}
}

const PublishZap = ({zapId}: {
    zapId?: String
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>();
    const [selectedTrigger, setSelectedTrigger] = useState<TSelectedTrigger>();
    const [selectedActions, setSelectedActions] = useState<TSelectedAction[]>([emptyAction]);
    const [modalVisibilityFor, setModalVisibilityFor] = useState<number>(0);

    useEffect(() => {
        if(zapId !== "") {
            const fetchZapDetails = async () => {
                try {
                    const zapIdString = JSON.parse(zapId as string)
                    const {data: { zap }} = await axios.get(`http://localhost:5000/api/zaps/${zapIdString}`, {headers: {Authorization: localStorage.getItem("token")}});
                    setSelectedTrigger({availableTriggerId: zap.trigger.trigger.id, triggerType: zap.trigger.trigger.type});
                    setSelectedActions(zap.actions.map((a: any) => ({
                        availableActionId: a.action.id,
                        actionType: a.action.type
                    })))
                } catch(error) {
                    toast.error("Could not fetch zap details!")
                    router.push("/dashboard");
                }
            }

            fetchZapDetails();
        }
    }, [])
    
    const handlePublish  = async () => {
        setLoading(true);
        if(!selectedTrigger) {
            toast.error("Invalid trigger selection!");
            return;
        }
        const createZapData = {
            "availableTriggerId": selectedTrigger.availableTriggerId,
            "triggerMetaData": {},
            "actions": selectedActions.map((action) => ({
                availableActionId: action.availableActionId,
                actionMetaData: action.actionMetaData
            }))
        }
        
        try {
            if(!zapId) {
                await axios.post("http://localhost:5000/api/zaps", createZapData, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
            } else {
                const zapIdString = JSON.parse(zapId as string)
                await axios.put(`http://localhost:5000/api/zaps/${zapIdString}`, createZapData, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
            }
            router.push("/dashboard");
        } catch(error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }

    const handleTriggerOrActionSelection = (selectedItem: any) => {
        if(modalVisibilityFor === 1) {
            setSelectedTrigger && setSelectedTrigger({
                availableTriggerId: selectedItem?.id,
                triggerType: selectedItem?.type,
                triggerMetaData: {}
            })
        } else if(modalVisibilityFor > 1) {
            setSelectedActions && setSelectedActions(a => a.map((action, i) => {
                if(i+2 === modalVisibilityFor) {
                    action.actionType = selectedItem?.type,
                    action.availableActionId = selectedItem?.id,
                    action.actionMetaData = selectedItem?.metadata;
                }
                return action;
            }))
        } 

        setModalVisibilityFor(0);
    }

    const handleCellClick = (index: Number) => {
        if(index === 1) {
            setModalVisibilityFor(1)
        } else if(Number(index) > 1) {
            setModalVisibilityFor(Number(index))
        } else {
            setModalVisibilityFor(0)
        }
    }

    const handleActionDelete = (index: number) => {
        setSelectedActions(selectedActions.filter((_, i) => i+2 !== index))
    }

  return (
    <>
    <div className='w-full fixed flex justify-between px-10 py-2 bg-[#2d2e2e]'>
        <div/>
        <Button variant='secondary' onClick={handlePublish} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
          <p className='mr-1'>{zapId !== "" ? "Save" : "Publish"}</p>
          {loading && <Spinner color='white' />}
        </Button>
    </div>
    <div className='mt-32 flex flex-col items-center gap-4'>
        <ZapCell index={1} name={selectedTrigger ? selectedTrigger.triggerType : "Trigger"} onClick={() => handleCellClick(1)} />
        {selectedActions?.map((action, index) => <div key={index}><ZapCell index={index+2} name={action.actionType ? action.actionType : "Action"} onClick={() => handleCellClick(index+2)} handleDelete={handleActionDelete} /></div>)}
    </div>
    <div className='mt-8 flex justify-center'>
        <button onClick={() => setSelectedActions([...selectedActions, emptyAction])} className='bg-secondary-500 shadow-md hover:bg-secondary-700 hover:shadow-lg transition-all p-2 rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
    {modalVisibilityFor !== 0 && <Modal isVisible={modalVisibilityFor} setIsVisible={setModalVisibilityFor} onClick={handleTriggerOrActionSelection} />}
    </>
  )
}

export default PublishZap