import {useState} from "react";

export default function LoginForm({onLogin, onRegister}) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    
    return <div>
        <label>Zaloguj się e-mailem</label>
        <input type={"text"} value={login} onChange={(e) => setLogin(e.target.value)}/>
        <input type={"password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
        <div className={"buttons-flex"}>
            <button type="button" onClick={() => onLogin(login, password)}>Login</button>
            <button type="button" onClick={() => {
                if (onRegister(login, password)) {
                    setLogin("");
                    setPassword("");
                }
            }}>Rejestracja</button>
        </div>
    </div>;
}
