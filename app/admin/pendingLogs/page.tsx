import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import PendingLogs from '@/components/PendingLogs/PendingLogs';
import React from 'react'

const PendingLogsPage: React.FC = () => {
     return (
       <>
        <Breadcrumb pageName="Pending Logs" />
         <div className="mt-4 grid grid-cols-13 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">    
           <div className="col-span-12 xl:col-span-8">
             <PendingLogs /> 
           </div>
          
         </div>
       </>
     );
   };

export default PendingLogsPage