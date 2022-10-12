package bangiay.com.entity;

import javax.persistence.*;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @Column(name = "ID")
    private Integer id;

    @Column(name = "PAREN_ID")
    private Integer parenId;

    @Column(name = "NAMECATE")
    private String namecate;

    @Column(name = "CREATED")
    private java.sql.Timestamp created;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED")
    private java.sql.Timestamp modified;

    @Column(name = "MODIFIER")
    private String modifier;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParenId() {
        return this.parenId;
    }

    public void setParenId(Integer parenId) {
        this.parenId = parenId;
    }

    public String getNamecate() {
        return this.namecate;
    }

    public void setNamecate(String namecate) {
        this.namecate = namecate;
    }

    public java.sql.Timestamp getCreated() {
        return this.created;
    }

    public void setCreated(java.sql.Timestamp created) {
        this.created = created;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public java.sql.Timestamp getModified() {
        return this.modified;
    }

    public void setModified(java.sql.Timestamp modified) {
        this.modified = modified;
    }

    public String getModifier() {
        return this.modifier;
    }

    public void setModifier(String modifier) {
        this.modifier = modifier;
    }
}
