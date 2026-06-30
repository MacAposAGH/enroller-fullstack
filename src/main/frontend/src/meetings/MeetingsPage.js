import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";
import {MEETINGS_PATH, METHOD, PARTICIPANTS_PATH, sendRequest} from "../Util";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    useEffect(() => {
        (async () => {
            await (() => new Promise(r => setTimeout(r, 1000)))();
            const response = await sendRequest([MEETINGS_PATH]);
            if (response.ok) {
                setMeetings(await response.json());
            }
        })();
    }, []);

    async function handleNewMeeting(meeting) {
        const response = await sendRequest([MEETINGS_PATH], METHOD.POST, meeting);
        if (response.ok) {
            setMeetings([...meetings, await response.json()]);
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await sendRequest([MEETINGS_PATH, meeting.id], METHOD.DELETE);
        if (response.ok) {
            const meetingToDelete = await response.json();
            setMeetings(prevState => prevState.filter(m => m.id !== meetingToDelete.id));
        }
    }

    async function handleNewParticipant(meeting, participant) {
        const response = await sendRequest([MEETINGS_PATH, meeting.id, PARTICIPANTS_PATH],
            METHOD.POST, participant);
        if (response.ok) {
            const updatedMeeting = await response.json();
            setMeetings(prevState => prevState.map(m => m.id === meeting.id ? updatedMeeting : m));
        }
    }

    async function handleDeleteParticipant(meeting, participant) {
        const response = await sendRequest([MEETINGS_PATH, meeting.id, PARTICIPANTS_PATH],
            METHOD.DELETE, participant);
        if (response.ok) {
            const updatedMeeting = await response.json();
            setMeetings(prevState => prevState.map(m => m.id === meeting.id ? updatedMeeting : m));
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
                    <MeetingsList meetings={meetings} login={username}
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
