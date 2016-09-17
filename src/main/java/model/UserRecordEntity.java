package model;

import javax.persistence.*;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "user_record", schema = "test", catalog = "")
public class UserRecordEntity {
    private int userId;
    private SportsRecordEntity sportsRecordByRecordId;

    @Basic
    @Column(name = "user_id")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserRecordEntity that = (UserRecordEntity) o;

        if (userId != that.userId) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return userId;
    }

    @ManyToOne
    @JoinColumn(name = "record_id", referencedColumnName = "record_id", nullable = false)
    public SportsRecordEntity getSportsRecordByRecordId() {
        return sportsRecordByRecordId;
    }

    public void setSportsRecordByRecordId(SportsRecordEntity sportsRecordByRecordId) {
        this.sportsRecordByRecordId = sportsRecordByRecordId;
    }
}
