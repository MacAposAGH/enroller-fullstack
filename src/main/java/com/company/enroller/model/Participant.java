package com.company.enroller.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "participant")
public class Participant {

	@Id
	private String login;

	@Column
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Participant that)) return false;
        return Objects.equals(login, that.login) && Objects.equals(password, that.password);
	}

	@Override
	public int hashCode() {
		return Objects.hash(login, password);
	}
}
