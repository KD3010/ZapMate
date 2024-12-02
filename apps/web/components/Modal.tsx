'use client';
import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify';

interface AvailableItem {
    id: string,
    type: string,
    image: string
}

const Modal = ({isVisible, setIsVisible, onClick}: {
    isVisible: "None" | "Triggers" | "Actions",
    setIsVisible: Dispatch<SetStateAction<"None" | "Triggers" | "Actions">>,
    onClick?: (selectedItem: any) => void
}) => {
    const [availableItem, setAvailableItem] = useState<AvailableItem[] | []>([]);

    const fetchAvailableTriggers = async () => {
        try{
            const response = await axios.get("http://localhost:5000/api/triggers", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
            });
            setAvailableItem(response?.data?.avialableTriggers);
        } catch (error) {
            toast.error(error as string)
        }
    }

    const fetchAvailableActions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/actions", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setAvailableItem(response?.data?.availableActions);
        } catch (error) {
            toast.error(error as string)
        }
    }

    useEffect(() => {
        if(isVisible === "Triggers") {
            fetchAvailableTriggers();
        } else if(isVisible === "Actions") {
            fetchAvailableActions();
        }

        return (() => {
            setAvailableItem([]);
        })
    }, [])

  return (
    <div className={clsx('absolute justify-center items-center bg-modal-bg h-screen w-screen top-0 left-0 flex transition-all')}
    >
        <div className='bg-white w-[40rem] h-96 rounded-md shadow-lg p-4 animate-zoom_in'>
            <div className='flex items-center justify-between pb-2 border-b border-b-gray-300'>
                <h3 className='font-semibold text-lg'>{`Available ${isVisible}`}</h3>
                <svg onClick={() => setIsVisible("None")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="size-6 cursor-pointer">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                {availableItem.map(item => (
                    <div onClick={() => onClick && onClick(item)} key={item?.id} className='flex gap-1 items-center cursor-pointer transition-all hover:bg-link-bg rounded-md'>
                        <img className='h-6 w-6' alt={item?.type} src={item?.image}  />
                        <p>{item?.type}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Modal