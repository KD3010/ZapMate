"use client";
import React, { useState, type Dispatch, type SetStateAction } from 'react'
import Webhook from '@/public/webhook.png'
import Modal from './Modal';
import Image from 'next/image';
import { TSelectedAction, TSelectedTrigger } from '@repo/types';
import clsx from 'clsx';

const ZapCell = ({index, setSelectedTrigger, setSelectedActions, selectedActions, selectedTrigger, action} : {
    index: Number,
    setSelectedTrigger?: Dispatch<SetStateAction<TSelectedTrigger | undefined>>,
    setSelectedActions?: Dispatch<SetStateAction<TSelectedAction[]>>,
    selectedActions?: TSelectedAction[],
    selectedTrigger?: TSelectedTrigger,
    action?: TSelectedAction
}) => {
    const [modalVisibility, setModalVisibility] = useState<boolean>(false);
    const modalHeader = index === 1 ? "Available Triggers" : "Available Actions";

    const handleSelection = (selectedItem: any) => {
        if(index === 1) {
            setSelectedTrigger && setSelectedTrigger({
                availableTriggerId: selectedItem?.id,
                triggerType: selectedItem?.type,
                triggerMetaData: {}
            })
        } else {
            selectedActions && setSelectedActions && setSelectedActions([...selectedActions.slice(0, selectedActions.length - 1), {
                availableActionId: selectedItem.id,
                actionType: selectedItem.type,
                actionMetaData: {}
            }])
        }
        setModalVisibility(false);
    }

  if(index === 1) return (
    <div>
    <div onClick={() => setModalVisibility(true)} className='w-[25rem] h-[6rem] bg-base-100 shadow-md hover:shadow-lg transition-all rounded-md border border-dashed border-gray-700 px-4 py-3 cursor-pointer'>
        <div className={clsx('px-2 w-fit py-1 h-7 flex gap-1 items-center rounded-md border-2 border-gray-700 bg-gray-200', {
            'border-primary-500 bg-orange-100': selectedTrigger !== null && selectedTrigger !== undefined
        })}>
            <Image width={16} height={16} alt='Webhook' src={Webhook} />
            <p className='text-gray-700'>{selectedTrigger ? selectedTrigger?.triggerType : "Trigger"}</p>
        </div>
        <div className='mt-3 text-gray-700 text-sm'>
            <p>{index.toString()}. {selectedTrigger ? "Wait for a new POST, PUT, or GET to a ZapMate URL." : "Select an event to trigger your zap" }</p>
        </div>
    </div>
    <Modal isVisible={modalVisibility} setIsVisible={setModalVisibility} header={modalHeader} onClick={handleSelection} />
    </div>
  )

  if(action) return (
    <div>
        <div onClick={() => setModalVisibility(true)} className='w-[25rem] h-[6rem] bg-base-100 shadow-md rounded-md border border-dashed border-gray-700 px-4 py-3 cursor-pointer'>
                <div className={clsx('px-2 w-fit py-1 h-7 flex gap-1 items-center rounded-md border-2 border-gray-700 bg-gray-200', {
                    "border-primary-500 bg-orange-100": action.availableActionId !== ""
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#374151" className="size-4">
                        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                    </svg>
                    <p className='text-gray-700'>{action?.actionType ? action.actionType : "Action"}</p>
                </div>
                <div className='mt-3 text-gray-700 text-sm'>
                    <p>{index.toString()}. {action?.actionType ? `Send ${action?.actionType}`: 'Select the event to run after the zap is triggered'}</p>
                </div>
        </div>
        <Modal isVisible={modalVisibility} setIsVisible={setModalVisibility} header={modalHeader} onClick={handleSelection} />
    </div>            
    );
  
}

export default ZapCell