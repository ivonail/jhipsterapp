package com.praksa.breza.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Article.
 */
@Entity
@Table(name = "article")
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount")
    private Long amount;

    @NotNull
    @Size(min = 2, max = 22)
    @Column(name = "name", length = 22, nullable = false)
    private String name;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAmount() {
        return amount;
    }

    public Article amount(Long amount) {
        this.amount = amount;
        return this;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getName() {
        return name;
    }

    public Article name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Article article = (Article) o;
        if (article.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), article.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Article{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", name='" + getName() + "'" +
            "}";
    }
}
