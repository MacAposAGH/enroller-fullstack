package com.company.enroller.persistence;

import com.company.enroller.model.Participant;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;
import java.util.Collection;

@Component("participantService")
public class ParticipantService extends AbstractService<Participant>{

    @Autowired
    PasswordEncoder passwordEncoder;

    public Collection<Participant> getAll(String sortBy, String sortOrder, String key) {
        CriteriaBuilder cb = connector.getSession().getCriteriaBuilder();
        CriteriaQuery<Participant> query = cb.createQuery(Participant.class);
        Root<Participant> participant = query.from(Participant.class);

        if (!key.isBlank()) {
            query.where(cb.like(participant.get("login"), "%%%s%%".formatted(key)));
        }

        if (sortBy.equalsIgnoreCase("login")) {
            Order order = sortOrder.equalsIgnoreCase("desc") ?
                    cb.desc(participant.get(sortBy)) : cb.asc(participant.get(sortBy));
            query.orderBy(order);
        }

        return connector.getSession().createQuery(query).getResultList();
    }

    public Collection<Participant> getAll() {
        return getAll(Participant.class);
    }

    public Participant findByLogin(String login) {
        return findById(Participant.class, login);
    }

    public Participant addParticipant(Participant participant) {
        String hashed = passwordEncoder.encode(participant.getPassword());
        participant.setPassword(hashed);
        return transaction(participant, Session::save);
    }

    public void updateParticipant(Participant existingParticipant, Participant participant) {
        transaction(participant, (s, p)->{
            s.delete(existingParticipant);
            s.save(p);
        });
    }

    public void deleteParticipant(Participant participant) {
         transaction(participant, Session::delete);
    }

}
