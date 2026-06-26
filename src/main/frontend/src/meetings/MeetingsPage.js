import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";
import {MEETINGS_PATH, METHOD, PARTICIPANTS_PATH, sendRequest} from "../Util";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState(null);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await (() => new Promise(r => setTimeout(r, 2000)))();
            // const response = await sendRequest([MEETINGS_PATH]);
            // if (response) {
            //     setMeetings(response);
            // }
        })();
    }, []);

    async function handleNewMeeting(meeting) {
        const response = await sendRequest([MEETINGS_PATH], METHOD.POST, meeting);
        if (response) {
            const nextMeetings = [...meetings, response];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await sendRequest([MEETINGS_PATH, meeting.id], METHOD.DELETE);
        if (response) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
    }

    async function handleNewParticipant(meeting, participant) {
        const response = await sendRequest([MEETINGS_PATH, PARTICIPANTS_PATH, meeting.id], METHOD.PUT, participant);
        if (response) {
            setMeetings([...meetings]);
        }
    }

    async function handleDeleteParticipant(meeting, participant) {
        const response = sendRequest([MEETINGS_PATH, PARTICIPANTS_PATH, meeting.id, participant],
            METHOD.PUT, participant);
        if (response) {
            setMeetings([...meetings]);
        }
    }

    return (
        <div>
            <h2>Zajęcia ({meetings ? meetings.length : 0})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings ? meetings.length > 0 ?
                    <MeetingsList meetings={meetings} username={username}
                                  onDelete={handleDeleteMeeting}
                                  onNewParticipant={handleNewParticipant}
                                  onDeleteParticipant={handleDeleteParticipant}/> :
                    <div>Nie masz ustalonych spotkań</div> :
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>}
        </div>
    );
}
