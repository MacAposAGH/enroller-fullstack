package com.company.enroller.service;

import com.company.enroller.persistence.DatabaseConnector;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.Collection;
import java.util.List;
import java.util.function.BiConsumer;

public abstract class AbstractService<T> {
    DatabaseConnector connector;

    public AbstractService() {
        connector = DatabaseConnector.getInstance();
    }

    protected T transaction(T entity, BiConsumer<Session, T> operation) {
        Session session = connector.getSession();
        Transaction transaction = session.beginTransaction();
        operation.accept(session, entity);
        transaction.commit();
        return entity;
    }

    protected Collection<T> getAll(Class<T> type) {
        String hql = "FROM %s".formatted(type.getSimpleName());
        List<T> list = connector.getSession().createQuery(hql, type).list();
        return list;
    }

    protected T findById(Class<T> type, String id) {
        return type.cast(connector.getSession().get(type, id));
    }

    protected T findById(Class<T> type, Long id) {
        return type.cast(connector.getSession().get(type, id));
    }
}
