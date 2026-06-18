import "milligram";
import {useEffect, useState} from "react";
import './App.css';
import UserPanel from "./participant/UserPanel";
import LoginForm from "./participant/LoginForm";
import {
    CREDENTIALS,
    GlobalToastContainer,
    LOGIN_PATH,
    METHOD,
    notifyError,
    PARTICIPANTS_PATH,
    sendRequest2,
} from "./Util";

function App() {
    const [loggedIn, setLoggedIn] = useState("");
    const item = "login";

    useEffect(() => {
        const login = localStorage.getItem(item);
        if (login) {
            setLoggedIn(login);
        }
    }, []);

    async function register(login, password) {
        const response = await sendRequest2([PARTICIPANTS_PATH], METHOD.POST, {login, password},
            CREDENTIALS.include);
        if (response.ok) {
            return true;
        }
        notifyError(await response.text());
        return false;
    }

    async function login(login, password) {
        const response = await sendRequest2([LOGIN_PATH], METHOD.POST, {login, password});
        if (response.ok) {
            const login = await response.json();
            localStorage.setItem(item, login);
            setLoggedIn(login);
            return;
        }
        notifyError("User not found");
    }

    function logout() {
        localStorage.removeItem(item);
        setLoggedIn("");
    }

    return <div>
        <h1>System do zapisów na zajęcia</h1>
        {loggedIn ? <UserPanel username={loggedIn} onLogout={logout}/> :
            <LoginForm onLogin={login} onRegister={register}/>}
        <GlobalToastContainer/>
    </div>;

}

export default App;
