import "milligram";
import './App.css';
import {useState} from "react";
import UserPanel from "./participant/UserPanel";
import LoginForm from "./participant/LoginForm";
import {CREDENTIALS, LOGIN_PATH, METHOD, sendRequest} from "./Util";

function App() {
    const [loggedIn, setLoggedIn] = useState("");

    async function login(email, password) {
        const response = await sendRequest([LOGIN_PATH], METHOD.POST,
            {login: email, password: password});
        const login = response.login ?? null;
        if (login) {
            setLoggedIn(login);
        }
    }

    function logout() {
        setLoggedIn("");
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {loggedIn ? <UserPanel username={loggedIn} onLogout={logout}/> : <LoginForm onLogin={login}/>}
        </div>
    );
}

export default App;
