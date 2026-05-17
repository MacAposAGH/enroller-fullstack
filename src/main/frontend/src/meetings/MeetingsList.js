export default function MeetingsList({meetings, username, onDelete, onNewParticipant}) {

    const onSignIn = (meeting) => {
        const participant = {login:username}
        meeting.participants.push(participant)
        onNewParticipant(meeting, participant);
    }

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
            {
                meetings.map((meeting, index) => <tr key={index}>
                    <td>{meeting.title}</td>
                    <td>{meeting.description}</td>
                    <td>
                        <ul>
                            {meeting.participants.map((participant, index) =>
                                <li key={index}>{participant.login}</li>)}
                        </ul>
                    </td>
                    <td>
                        {meeting.participants.indexOf(username) === -1 &&
                            <button onClick={() => onSignIn(meeting)}>Sign in</button>}
                        {meeting.participants.length === 0 &&
                            <button onClick={() => onDelete(meeting)}>Delete</button>}
                    </td>
                </tr>)
            }
            </tbody>
        </table>
    );
}
