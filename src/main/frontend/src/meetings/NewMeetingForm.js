import {getTodayDate} from "../Util";

export default function NewMeetingForm({meeting, onSet, onCreate}) {

    function submit(event) {
        event.preventDefault();
        onCreate();
    }

    return <form onSubmit={submit} className={"input-flex"}>
        <h3>Dodaj nowe spotkanie</h3>
        <label>Nazwa</label>
        <input type="text" name={"title"} value={meeting.title} onChange={onSet}/>
        <label>Opis</label>
        <textarea name={"description"} value={meeting.description} onChange={onSet}></textarea>
        <label>Data</label>
        <input name={"date"} type="date" value={meeting.date} min={getTodayDate()} onChange={onSet}/>
        <button>Dodaj</button>
    </form>;
}