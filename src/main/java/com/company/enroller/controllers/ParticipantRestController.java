package com.company.enroller.controllers;

import com.company.enroller.model.Participant;
import com.company.enroller.error.ErrorHandler;
import com.company.enroller.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Collection;

@RestController
@RequestMapping("/participants")
public class ParticipantRestController {

    @Autowired
    ParticipantService participantService;

    @Autowired
    ErrorHandler errorHandler;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> getParticipants(
            @RequestParam(name = "sortBy", required = false, defaultValue = "") String sortBy,
            @RequestParam(name = "sortOrder", required = false, defaultValue = "") String sortOrder,
            @RequestParam(name = "key", required = false, defaultValue = "") String key) {
        Collection<Participant> participants = participantService.getAll(sortBy, sortOrder, key);
        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getParticipant(@PathVariable("id") String login) {
        Participant participant = participantService.findByLogin(login);
        if (participant == null) {
            return errorHandler.entityDoesntExist();
        }
        return new ResponseEntity<>(participant, HttpStatus.OK);
    }

//    @RequestMapping(value = "/login", method = RequestMethod.POST)
//    public ResponseEntity<?> login(@RequestBody Participant participant, HttpServletResponse response) {
//        if (participantService.findByLogin(participant.getLogin()) != null) {
//            return errorHandler.entityDoesntExist();
//        }
//
//
//
//        return new ResponseEntity<>(participant, HttpStatus.OK);
//    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> registerParticipant(@RequestBody Participant participant) {
        if (participantService.findByLogin(participant.getLogin()) != null) {
            return errorHandler.entityAlreadyExist();
        }
        return new ResponseEntity<>(participantService.addParticipant(participant), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{login}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateParticipant(@PathVariable("login") String login,
                                               @RequestBody Participant participant) {
        Participant existingParticipant = participantService.findByLogin(login);
        if (existingParticipant == null) {
            return errorHandler.entityDoesntExist();
        }
        if (participantService.findByLogin(participant.getLogin()) != null) {
            return errorHandler.entityAlreadyExist();
        }
        participantService.updateParticipant(existingParticipant, participant);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{login}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteParticipant(@PathVariable("login") String login) {
        Participant existingParticipant = participantService.findByLogin(login);
        if (existingParticipant == null) {
            return errorHandler.entityDoesntExist();
        }
        participantService.deleteParticipant(existingParticipant);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
