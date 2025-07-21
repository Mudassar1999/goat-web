import React from 'react'
import ForwordIcon from '@/assests/svg/forwordIcon'
import { getFirstCharCap } from '@/utils/getFirstCharCap'

function ReviewedLogs({ reviewedData, router }: any) {
  return (
    <div className="w-full">
      {reviewedData.length > 0 ?
        <div className={`${reviewedData.length > 0 && 'bg-zinc-500 bg-opacity-20'} rounded-[14px] border border-[#545458a6] mt-[24px]`}>

          {reviewedData?.map((data: any, index: number) => (
            <div key={data?.id} className="pl-[16px]" onClick={() => router.push(`/journey/reviewed-detail?id=${data?.id}`)}>
              <div className={`${index === reviewedData?.length - 1 ? '' : 'border-b border-zinc-600 border-opacity-60'} w-full flex flex-wrap justify-between items-center py-[11px]`}>
                <div className='flex gap-4'>
                  <div className="text-17">
                    <span className="font-normal">{data?.User?.firstName + ' ' + data?.User?.lastName}</span>
                  </div>
                  <p className={` px-[8px] py-[2px] rounded-[16px] text-12-bold ${data?.status === 'rejected' ? 'text-[#B42318] bg-[#FEF3F2]' : 'text-[#027A48] bg-[#ECFDF3]'}`}>{getFirstCharCap(data?.status)}</p>
                </div>
                <div className='pr-[16px] pl-[8px] cursor-pointer'>
                  <ForwordIcon />
                </div>
              </div>
            </div>
          ))}

        </div>
        :
        <div className="text-violet-100 text-opacity-60 font-sans text-subheadline font-regular font-feature-case text-15 leading-20 tracking-tight flex items-center justify-center w-full h-[100px]">
          No data
        </div>}

    </div>
  )
}

export default ReviewedLogs