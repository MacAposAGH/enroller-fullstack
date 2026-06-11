package com.company.enroller.service;

import com.company.enroller.model.Meeting;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component("meetingService")
public class MeetingService extends AbstractService<Meeting> {


    public Collection<Meeting> getAll() {
        return getAll(Meeting.class);
    }

    public Meeting findById(Long id) {
        return findById(Meeting.class, id);
    }

    public Meeting findById(String id) {
        return findById(Meeting.class, id);
    }

    public boolean exists(Meeting meeting) {
        if (findById(meeting.getId()) == null) {
            return false;
        }
        String hql = "FROM Meeting m WHERE m.title = ?1 AND m.date = ?2";
        Query<Meeting> query = connector.getSession().createQuery(hql, Meeting.class);
        query.setParameter(1, meeting.getTitle());
        query.setParameter(2, meeting.getDate());
        return query.uniqueResult() != null;
    }

    public Meeting addMeeting(Meeting meeting) {
        return transaction(meeting, Session::save);
    }

    public void updateMeeting(Long id, Meeting meeting) {
        meeting.setId(id);
        transaction(meeting, Session::merge);
    }

    public void deleteMeeting(Meeting meeting) {
        transaction(meeting, Session::delete);
    }
}
