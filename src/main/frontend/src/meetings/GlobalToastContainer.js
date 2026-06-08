import React from 'react';
import {Slide, ToastContainer} from "react-toastify";

export  default function GlobalToastContainer() {
    return (
        <ToastContainer position="top-center"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        transition={Slide}/>
    );
}

