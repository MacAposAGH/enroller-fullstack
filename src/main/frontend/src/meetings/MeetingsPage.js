import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);



    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                console.log(meetings)
                setMeetings(meetings);
            }
        };

        fetchMeetings();
    }, []);

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            const nextMeetings = [...meetings, await response.json()];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
    }

    async function handleNewParticipant(meeting, participant) {
        const response = await fetch(`/api/meetings/participants/${meeting.id}`, {
            method: 'PUT',
            body: JSON.stringify(participant),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            console.log("ok")
            setMeetings([...meetings, meeting])
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
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onNewParticipant={handleNewParticipant}/>}
        </div>
    )
}
