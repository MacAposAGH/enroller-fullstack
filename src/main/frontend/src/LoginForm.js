import {useState} from "react";
import {toast} from "react-toastify";
import GlobalToastContainer from "./meetings/GlobalToastContainer";

export default function LoginForm({onLogin}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const notify = () => toast.error("Login and/or password can't be empty", {});

    const renderInput = (type, value, action) =>
        <input type={type} value={value} onChange={(e) => action(e.target.value)}/>

    const renderButton = (text, action) =>
        <button type="button" onClick={() => email && password ? action() : notify()}>
            {text}
        </button>;

    return <div>
        <label>Zaloguj się e-mailem</label>
        {renderInput("text", email, (v) => setEmail(v))}
        {renderInput("password", password, (v) => setPassword(v))}
        {renderButton("Login", () => onLogin(email, password))}
        {renderButton("Register", () => onLogin(email, password))}
        <GlobalToastContainer/>
    </div>;
}
