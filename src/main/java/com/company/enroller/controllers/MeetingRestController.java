package com.company.enroller.controllers;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import com.company.enroller.persistence.ErrorHandler;
import com.company.enroller.persistence.MeetingService;
import com.company.enroller.persistence.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/meetings")
public class MeetingRestController {

    @Autowired
    ParticipantService participantService;

    @Autowired
    MeetingService meetingService;

    @Autowired
    ErrorHandler errorHandler;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> getMeetings() {
        return new ResponseEntity<>(meetingService.getAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getMeeting(@PathVariable Long id) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return errorHandler.entityDoesntExist();
        }
        return new ResponseEntity<>(meeting, HttpStatus.OK);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> registerMeeting(@RequestBody Meeting meeting) {
        if (meetingService.exists(meeting)) {
            return errorHandler.entityAlreadyExist();
        }
        return new ResponseEntity<>(meetingService.addMeeting(meeting), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateMeeting(@PathVariable Long id,
                                           @RequestBody Meeting meeting) {
        Meeting existingMeeting = meetingService.findById(id);
        String message = "Meeting to update";
        if (existingMeeting == null) {
            return errorHandler.entityDoesntExist(message);
        }
        if (meetingService.exists(meeting)) {
            errorHandler.entityAlreadyExist(message);
        }

        meetingService.updateMeeting(id, meeting);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteMeeting(@PathVariable Long id) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return errorHandler.entityDoesntExist();
        }
        meetingService.deleteMeeting(meeting);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/participants", method = RequestMethod.GET)
    public ResponseEntity<?> getMeetingsParticipants(@PathVariable Long id) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return errorHandler.entityDoesntExist();
        }
        return new ResponseEntity<>(meeting.getParticipants(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/participants", method = RequestMethod.POST)
    public ResponseEntity<?> registerMeetingsParticipant(@PathVariable Long id, @RequestBody Participant participant) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return errorHandler.entityDoesntExist("Meeting");
        }
        Participant existingParticipant = participantService.findByLogin(participant.getLogin());
        if (existingParticipant == null) {
            return errorHandler.entityDoesntExist("Participant");
        }
        meeting.getParticipants().add(existingParticipant);
        meetingService.updateMeeting(id, meeting);
        return new ResponseEntity<>(meeting, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}/participants", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteMeetingsParticipant(@PathVariable Long id, @RequestBody Participant participant) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return errorHandler.entityDoesntExist("Meeting");
        }

        if (!meeting.getParticipants().contains(participant)) {
            return errorHandler.entityDoesntExist("Participant");
        }
        meeting.getParticipants().remove(participant);
        meetingService.updateMeeting(id, meeting);
        return new ResponseEntity<>(meeting, HttpStatus.OK);
    }

}
