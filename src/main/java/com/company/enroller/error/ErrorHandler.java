package com.company.enroller.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component("errorHandler")
public class ErrorHandler {

    private ResponseEntity<?> throwConflictResponse(String message) {
        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }

    public ResponseEntity<?> entityAlreadyExist(String message) {
        return throwConflictResponse("%s already exists".formatted(message) );
    }

    public ResponseEntity<?> entityAlreadyExist() {
        return entityAlreadyExist("Entity");
    }

    public ResponseEntity<?> entityDoesntExist(String message) {
        return throwConflictResponse("%s doesn't exist".formatted(message));
    }

    public ResponseEntity<?> entityDoesntExist() {
        return entityDoesntExist("Entity");
    }

}
