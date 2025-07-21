import React from 'react'
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

function AdminPopup({ isModalOpen, closeViewModal, title, children }: any) {
  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 flex items-center justify-center" onClose={closeViewModal}>
        <div className="fixed inset-0 bg-black opacity-30" />
        <Transition.Child
          as={Fragment}
          enter="transform transition duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transform transition duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block p-6 my-8 overflow-hidden text-left bg-white shadow-xl w-[500px] rounded-2xl">
            <Dialog.Title className="text-2xl font-large text-gray-500">{title}</Dialog.Title>
            <hr className="my-4 border-t-2 border-gray-300" />
            <div className="overflow-y-auto max-h-screen p-1" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {children}
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}

export default AdminPopup