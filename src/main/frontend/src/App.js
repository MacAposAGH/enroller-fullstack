import "milligram";
import {useEffect, useState} from "react";
import './App.css';
import UserPanel from "./participant/UserPanel";
import LoginForm from "./participant/LoginForm";
import {
    CREDENTIALS,
    GlobalToastContainer,
    LOGIN_PATH, LOGOUT_PATH,
    METHOD,
    notifyError,
    PARTICIPANTS_PATH,
    sendRequest,
} from "./Util";

function App() {
    const [loggedIn, setLoggedIn] = useState("");
    const item = "login";

    useEffect(() => {
        const login = localStorage.getItem(item);
        (async () => {
            if (login) {
                const response = await sendRequest([LOGIN_PATH], METHOD.POST, {login});
                if(response.ok){
                    setLoggedIn(login);
                }
            }
        })();
    }, []);

    async function register(login, password) {
        const response = await sendRequest([PARTICIPANTS_PATH], METHOD.POST, {login, password},
            CREDENTIALS.include);
        if (response.ok) {
            return true;
        }
        notifyError(await response.text());
        return false;
    }

    async function login(login, password) {
        const response = await sendRequest([LOGIN_PATH], METHOD.POST, {login, password});
        if (response.ok) {
            const json = await response.json();
            const login = json.login;
            localStorage.setItem(item, login);
            setLoggedIn(login);
            return;
        }
        notifyError("User not found");
    }

   async function logout() {
        const response = await sendRequest([LOGOUT_PATH], METHOD.POST);
        if(response.ok){
            localStorage.removeItem(item);
            setLoggedIn("");
        }
    }

    return <div>
        <h1>System do zapisów na zajęcia</h1>
        {loggedIn ? <UserPanel username={loggedIn} onLogout={logout}/> :
            <LoginForm onLogin={login} onRegister={register}/>}
        <GlobalToastContainer/>
    </div>;
}

export default App;
