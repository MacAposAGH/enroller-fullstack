import {useState} from "react";
import {Slide, toast, ToastContainer} from "react-toastify";
import GlobalToastContainer from "./meetings/GlobalToastContainer";

export default function LoginForm({onLogin}) {
    const [email, setEmail] = useState("");
    const notify = () => toast.error("Login can't be empty", {})

    return <div>
        <label>Zaloguj się e-mailem</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <button type="button" onClick={() => email ? onLogin(email) : notify()}>{"Wchodzę"}</button>
        <GlobalToastContainer/>
    </div>
}
