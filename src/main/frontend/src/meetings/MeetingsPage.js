import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

const Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
};

const meetingsPath = "meetings";
const participantsPath = "participants";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    useEffect(() => {
        (async () => {
            await (() => new Promise(r => setTimeout(r, 200000)))();
            const response = await fetchData([meetingsPath]);
            if (response) {
                setMeetings(response);
            }
        })();
    }, []);

    async function fetchData(pathVariables = [""], method = Method.GET, body, headers = {}) {
        let response = await fetch(`/api/${pathVariables.join("/")}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                "Content-Type": "application/json",
                ...headers
            }
        });
        if (!response.ok) {
            return null;
        }
        try {
            return await response.json();
        } catch (error) {
            return response;
        }
    }

    async function handleNewMeeting(meeting) {
        const response = await fetchData([meetingsPath], Method.POST, meeting);
        if (response) {
            const nextMeetings = [...meetings, response];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetchData([meetingsPath, meeting.id], Method.DELETE);
        if (response) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
    }

    async function handleNewParticipant(meeting, participant) {
        const response = await fetchData([meetingsPath, participantsPath, meeting.id], Method.PUT, participant);
        if (response) {
            setMeetings([...meetings]);
        }
    }

    async function handleDeleteParticipant(meeting, participant) {
        const response = fetchData([meetingsPath, participantsPath, meeting.id, participant],
            Method.PUT, participant);
        if (response) {
            setMeetings([...meetings]);
        }
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 ?
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onNewParticipant={handleNewParticipant}
                              onDeleteParticipant={handleDeleteParticipant}/> :
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>}
        </div>
    );
}
