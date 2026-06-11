import {useState} from "react";
import {toast} from "react-toastify";
import GlobalToastContainer from "../meetings/GlobalToastContainer";
import {CREDENTIALS, METHOD, PARTICIPANTS_PATH, sendRequest} from "../Util";

export default function LoginForm({onLogin}) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const notify = (content) => toast.error(content, {});

    async function register(email, password) {
        const response = await sendRequest([PARTICIPANTS_PATH], METHOD.POST, {login: email, password: password},
            CREDENTIALS.include);
        if (response.login) {
            setLogin("");
            setPassword("");
            return;
        }
        notify(await response.text());
    }

    const renderInput = (type, value, action) =>
        <input type={type} value={value} onChange={(e) => action(e.target.value)}/>;

    const renderButton = (text, action) =>
        <button type="button"
                onClick={() => login && password ? action() : notify("Login and/or password can't be empty")}>
            {text}
        </button>;

    return <div>
        <label>Zaloguj się e-mailem</label>
        {renderInput("text", login, (v) => setLogin(v))}
        {renderInput("password", password, (v) => setPassword(v))}
        {renderButton("Login", () => onLogin(login, password))}
        {renderButton("Register", () => register(login, password))}
        <GlobalToastContainer/>
    </div>;
}
