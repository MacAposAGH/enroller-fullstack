import React from 'react';
import {Slide, toast, ToastContainer} from "react-toastify";

  function notifyError(content) {
    toast.error(content, {});
}

  function GlobalToastContainer() {
    return (
        <ToastContainer position="top-center"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        // pauseOnFocusLoss
                        draggable
                        // pauseOnHover
                        theme="dark"
                        transition={Slide}/>
    );
}

export  {notifyError, GlobalToastContainer}

