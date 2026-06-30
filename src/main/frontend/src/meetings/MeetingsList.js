export default function MeetingsList({meetings, login, onDelete, onNewParticipant, onDeleteParticipant}) {

    const onSignIn = (meeting) => {
        const participant = {login};
        meeting.participants.push(participant);
        onNewParticipant(meeting, participant);
    };

    const onSignOut = (meeting) => {
        meeting.participants = meeting.participants.filter(p => p.login !== login);
        onDeleteParticipant(meeting, {login});
    };

    const isParticipant = (meeting) => {
        return meeting.participants.find(p => p.login === login);
    };

    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                <th>Uczestnicy</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {meetings.map((meeting, index) =>
                <tr key={index}>
                    <td>{meeting.title}</td>
                    <td>{meeting.description}</td>
                    {meeting.participants &&
                        <>
                            <td>
                                <ul>
                                    {meeting.participants.map((participant, index) =>
                                        <li key={index}>{participant.login}</li>)}
                                </ul>
                            </td>

                        </>}
                    <td>
                        {!isParticipant(meeting) &&
                            <button onClick={() => onSignIn(meeting)}>Sign in</button>}
                        {isParticipant(meeting) &&
                            <button onClick={() => onSignOut(meeting)}>Sign out</button>}
                        {meeting.participants.length === 0 &&
                            <button onClick={() => onDelete(meeting)}>Delete</button>}
                    </td>
                </tr>)
            }
            </tbody>
        </table>
    );
}
