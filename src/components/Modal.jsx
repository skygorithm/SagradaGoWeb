import { useState } from "react"


export default function Modal({ message, setShowModal }){

    function closeModal(){
        setShowModal(false)
    }

    return(
        <>
            <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
                <div className="w-100 h-70 bg-red-400 flex flex-col items-center justify-end pb-5!">
                    <h1>{message}</h1>
                    <button 
                        className="w-30 bg-blue-400 py-2! mt-20!"
                        onClick={closeModal}
                    >
                        OK
                    </button>
                </div>
            </div>
        </>
    )
}