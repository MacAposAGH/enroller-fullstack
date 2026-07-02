import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import {getTodayDate, MEETINGS_PATH, METHOD, PARTICIPANTS_PATH, scrollToTop, sendRequest} from "../Util";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const emptyMeeting = {title: "", description: "", date: getTodayDate()};
    const [meeting, setMeeting] = useState(emptyMeeting);
    const [meetings, setMeetings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [spinner, setSpinner] = useState(true);

    useEffect(() => {
        (async () => {
            await (() => new Promise(r => setTimeout(r, 1000)))();
            setSpinner(false);
            const response = await sendRequest([MEETINGS_PATH]);
            if (response.ok) {
                setMeetings(await response.json());
            }
        })();
    }, []);

    async function handleCreate() {
        const method = shouldUpdate ? METHOD.PUT : METHOD.POST;
        const pathVariables = [MEETINGS_PATH, ...(shouldUpdate ? [meeting.id] : [])];
        const response = await sendRequest(pathVariables, method, meeting);
        if (!response.ok) {
            return;
        }
        if (shouldUpdate) {
            setMeetings(prevState => prevState.map(m => m.id === meeting.id ? meeting : m));
        } else {
            const newMeetings = await response.json();
            setMeetings(prevState => [...prevState, newMeetings]);
        }
        setShouldUpdate(false);
        setShowForm(false);
    }

    function handleUpdate(meeting) {
        setShouldUpdate(true);
        setShowForm(true);
        setMeeting(meeting);
    }

    function handleSet(e) {
        const {name, value} = e.target;
        setMeeting((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    async function handleDeleteMeeting(meeting) {
        const response = await sendRequest([MEETINGS_PATH, meeting.id], METHOD.DELETE);
        if (response.ok) {
            const meetingToDelete = await response.json();
            setMeetings(prevState => prevState.filter(m => m.id !== meetingToDelete.id));
        }
    }

    async function handleAddParticipant(meeting, participant) {
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

    return <div>
        {spinner ?
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div> :
            <>
                {showForm ?
                    <NewMeetingForm meeting={meeting} onSet={handleSet} onCreate={handleCreate}/> :
                    <button onClick={() => {
                        setShowForm(true);
                        setMeeting(emptyMeeting);
                        scrollToTop()
                    }}>Dodaj nowe spotkanie</button>
                }
                {meetings.length > 0 ?
                    <>
                        <h2>Zajęcia ({meetings.length})</h2>
                        <MeetingsList meetings={meetings} login={username}
                                      onUpdate={handleUpdate}
                                      onDelete={handleDeleteMeeting}
                                      onAddParticipant={handleAddParticipant}
                                      onDeleteParticipant={handleDeleteParticipant}/>
                    </> :
                    <div>Nie masz zaplanowanych spotkań</div>}
            </>}
    </div>;
}