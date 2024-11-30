"use client";
import MainSection from '@/components/MainSection';
import PublishZap from '@/components/PublishZap';
import { useSearchParams } from 'next/navigation';
import React from 'react'

function page() {
  const searchParams = useSearchParams();
  const zapId: String | null = searchParams.get("zapId");

  return (
    <MainSection>
      <div className='min-h-[92vh] canvas w-full flex flex-col items-center py-8'>
        <PublishZap zapId={zapId ?? ""} />
      </div>
    </MainSection>
  )
}

export default page;