import MainSection from '@/components/MainSection';
import PublishZap from '@/components/PublishZap';
import React from 'react'

function page() {
  
  return (
    <MainSection>
      <div className='min-h-[91vh] canvas w-full flex flex-col items-center py-8'>
        <PublishZap />
      </div>
    </MainSection>
  )
}

export default page;