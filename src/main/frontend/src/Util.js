import {Slide, toast, ToastContainer} from "react-toastify";

const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};

const CREDENTIALS = {omit: "omit", include: "include"};
const MEETINGS_PATH = "meetings";
const PARTICIPANTS_PATH = "participants";
const LOGIN_PATH = "login";
const LOGOUT_PATH = "logout";

export async function sendRequest(pathVariables = [""], method = METHOD.GET, body,
                                  credentials = CREDENTIALS.include, headers = {}) {
    const s = `http://localhost:8080/${pathVariables.join("/")}`;
    console.log(s);
    return await fetch(`http://localhost:8080/${pathVariables.join("/")}`, {
        method,
        credentials,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    });
}

export function notifyError(content) {
    toast.error(content, {});
}

export function GlobalToastContainer() {
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

export {METHOD, MEETINGS_PATH, PARTICIPANTS_PATH, LOGIN_PATH, LOGOUT_PATH, CREDENTIALS};