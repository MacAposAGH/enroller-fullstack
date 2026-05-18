package com.company.enroller.controllers;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import com.company.enroller.persistence.MeetingService;
import com.company.enroller.persistence.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/meetings")
public class MeetingRestController {

    @Autowired
    MeetingService meetingService;

    @Autowired
    ParticipantService participantService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> findMeetings(@RequestParam(value = "title", defaultValue = "") String title,
                                          @RequestParam(value = "description", defaultValue = "") String description,
                                          @RequestParam(value = "sort", defaultValue = "") String sortMode,
                                          @RequestParam(value = "participantLogin", defaultValue = "") String participantLogin) {

        Participant foundParticipant = null;
        if (!participantLogin.isEmpty()) {
            foundParticipant = participantService.findByLogin(participantLogin);
        }
        Collection<Meeting> meetings = meetingService.findMeetings(title, description, foundParticipant, sortMode);
        return new ResponseEntity<>(meetings, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getMeeting(@PathVariable("id") long id) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(meeting, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteMeeting(@PathVariable("id") long id) {
        Meeting meeting = meetingService.findById(id);

        if (meeting == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!meeting.getParticipants().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
        }
        meetingService.delete(meeting);
        return new ResponseEntity<>(meeting, HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> addMeeting(@RequestBody Meeting meeting) {
        if (meetingService.alreadyExist(meeting)) {
            return new ResponseEntity<>("Unable to add. A meeting with title " + meeting.getTitle() + " and date "
                    + meeting.getDate() + " already exist.", HttpStatus.CONFLICT);
        }
        meetingService.add(meeting);
        return new ResponseEntity<>(meeting, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateMeeting(@PathVariable("id") long id, @RequestBody Meeting meeting) {
        Meeting currentMeeting = meetingService.findById(id);
        if (currentMeeting == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        meeting.setId(currentMeeting.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "participants/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> addMeetingParticipant(@PathVariable("id") long id, @RequestBody Participant participant) {
        Meeting currentMeeting = meetingService.findById(id);
        if (currentMeeting == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Participant currentMeetingParticipant = participantService.findByLogin(participant.getLogin());
        if (currentMeetingParticipant != null && currentMeeting.getParticipants().contains(currentMeetingParticipant)) {
            return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
        }
        currentMeeting.addParticipant(participant);
        meetingService.update(currentMeeting);
        return new ResponseEntity<>(currentMeeting, HttpStatus.CREATED);
    }

    @RequestMapping(value = "participants/{id}/{login}", method = RequestMethod.PUT)
    public ResponseEntity<?> deleteMeetingParticipant(@PathVariable("id") long id,
                                                      @PathVariable("login") String login) {
        Meeting currentMeeting = meetingService.findById(id);
        if (currentMeeting == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Participant participant = participantService.findByLogin(login);
        if(!currentMeeting.getParticipants().contains(participant)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        currentMeeting.removeParticipant(participant);
        meetingService.update(currentMeeting);
        return new ResponseEntity<>(currentMeeting, HttpStatus.CREATED);
    }

}