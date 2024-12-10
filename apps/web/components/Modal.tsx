'use client';
import axios from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'react-toastify';
import FormInput from './FormInput';

interface AvailableItem {
    id: string,
    type: string,
    image: string
}

const Modal = ({page, isVisible, setIsVisible, onClick}: {
    page: number,
    isVisible: number,
    setIsVisible: Dispatch<SetStateAction<number>>,
    onClick?: (selectedItem: any) => void
}) => {
    const [availableItem, setAvailableItem] = useState<AvailableItem[] | []>([]);
    const [selectedItem, setSelectedItem] = useState<string>();

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
        if(page === 1) {
            if(isVisible === 1) {
                fetchAvailableTriggers();
            } else if(isVisible > 1) {
                fetchAvailableActions();
            }
        }

        return (() => {
            setAvailableItem([]);
        })
    }, [])

    const selectAction = (
        <div className='flex flex-col gap-2 mt-4'>
            {availableItem.map((item) => (
                <div onClick={() => {
                    onClick && onClick(item);
                    setSelectedItem(item.type);
                }} key={item?.id} className='flex gap-1 items-center cursor-pointer transition-all hover:bg-link-bg rounded-md'>
                    <img className='h-6 w-6' alt={item?.type} src={item?.image}  />
                    <p>{item?.type}</p>
                </div>
            ))}
        </div>
    )

    const actionMetaData = (
        <div>
            {}
        </div>
    )

    return (
        <div className={'absolute justify-center items-center bg-modal-bg h-screen w-screen top-0 left-0 flex transition-all'}
        >
            <div className='bg-white w-[40rem] h-96 rounded-md shadow-lg p-4 animate-zoom_in'>
                <div className='flex items-center justify-between pb-2 border-b border-b-gray-300'>
                    <h3 className='font-semibold text-lg'>{`Select ${isVisible === 1 ? 'Trigger' : isVisible > 1 ? 'Action': ''}`}</h3>
                    <svg onClick={() => setIsVisible(0)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="size-6 cursor-pointer">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>
                {page === 1 ? selectAction : actionMetaData}
            </div>
        </div>
      )

}

export default Modal