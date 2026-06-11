import "milligram";
import './App.css';
import {useState} from "react";
import UserPanel from "./participant/UserPanel";
import LoginForm from "./participant/LoginForm";
import {CREDENTIALS, LOGIN_PATH, METHOD, PARTICIPANTS_PATH, sendRequest} from "./Util";

function App() {
    const [loggedIn, setLoggedIn] = useState("");
    const [password, setPassword] = useState("");

    async function register(email, password) {
        const response = await sendRequest([PARTICIPANTS_PATH], METHOD.POST, {login: email, password: password},
            CREDENTIALS.include);
        const login = response.login ?? null;
        if (login) {
            setLoggedIn("");
            setPassword("");
            return;
        }
        console.log(response.statusMessage);
    }

    async function login(email, password) {
        const response = await sendRequest([LOGIN_PATH], METHOD.POST, {login: email, password: password},
            CREDENTIALS.include);
        console.log(response);

        const login = response.login ?? null;
        if (login) {
            setLoggedIn(login);
            return;
        }
    }

    function logout() {
        setLoggedIn("");
        setPassword("");
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {loggedIn ?
                <UserPanel username={loggedIn} onLogout={logout}/> :
                <LoginForm onRegister={register} onLogin={login}/>
            }
        </div>
    );
}

export default App;
