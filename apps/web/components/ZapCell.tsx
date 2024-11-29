"use client";
import React from 'react'
import clsx from 'clsx';

const ZapCell = ({index, name, onClick} : {
    index: number,
    name: string,
    onClick: () => void
}) => {

  return (
        <div onClick={onClick} className='w-[25rem] bg-base-100 shadow-md hover:shadow-lg transition-all rounded-md border border-dashed border-gray-700 p-4 cursor-pointer'>
                <div className={clsx('px-2 w-fit py-1 h-7 flex gap-1 items-center rounded-md border-2 border-gray-700 bg-gray-200', {
                    "border-primary-500 bg-orange-100": name !== "Trigger" && name !== "Action"
                })}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#374151" className="size-4">
                        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                    </svg>
                    <p className='text-gray-700'>{name}</p>
                </div>
                <p className='text-gray-700 mt-2'>{index.toString()}. {name === "Trigger" ? "Select the event to trigger your Zap!" : "Select the event to run after your zap is triggered"}</p>
        </div>
    );
  
}

export default ZapCell