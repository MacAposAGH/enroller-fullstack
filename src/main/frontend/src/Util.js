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

async function sendRequest(pathVariables = [""], method = METHOD.GET, body,
                           credentials = CREDENTIALS.include, headers = {}) {
    const response = await fetch(`http://localhost:8080/${pathVariables.join("/")}`, {
        method,
        credentials,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    });

    console.log(response);

    if (response.ok) {
        return await response.json();
    }
    return response;
}

export {METHOD, MEETINGS_PATH, PARTICIPANTS_PATH, LOGIN_PATH, CREDENTIALS, sendRequest};