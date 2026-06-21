import {useState} from "react";
import {notifyError} from "../Util";

export default function LoginForm({onLogin, onRegister}) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const renderInput = (type, value, action) =>
        <input type={type} value={value} onChange={(e) => action(e.target.value)}/>;

    const renderButton = (text, action) =>
        <button type="button"
                onClick={() => login && password ? action() : notifyError("Login and/or password can't be empty")}>
            {text}
        </button>;

    return <div>
        <label>Zaloguj się e-mailem</label>
        {renderInput("text", login, (v) => setLogin(v))}
        {renderInput("password", password, (v) => setPassword(v))}
        {renderButton("Login", () => onLogin(login, password))}
        {renderButton("Register", () => {
            if (onRegister(login, password)) {
                setLogin("");
                setPassword("");
            }
        })}
    </div>;
}
