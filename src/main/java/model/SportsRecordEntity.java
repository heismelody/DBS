package model;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "sports_record", schema = "test", catalog = "")
public class SportsRecordEntity {
    private int recordId;
    private String totalTime;
    private Timestamp startTime;
    private Timestamp endTime;
    private String activityType;
    private int totalLength;
    private RouteEntity routeByRouteId;

    @Id
    @Column(name = "record_id")
    public int getRecordId() {
        return recordId;
    }

    public void setRecordId(int recordId) {
        this.recordId = recordId;
    }

    @Basic
    @Column(name = "total_time")
    public String getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(String totalTime) {
        this.totalTime = totalTime;
    }

    @Basic
    @Column(name = "start_time")
    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    @Basic
    @Column(name = "end_time")
    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    @Basic
    @Column(name = "activity_type")
    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    @Basic
    @Column(name = "total_length")
    public int getTotalLength() {
        return totalLength;
    }

    public void setTotalLength(int totalLength) {
        this.totalLength = totalLength;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SportsRecordEntity that = (SportsRecordEntity) o;

        if (recordId != that.recordId) return false;
        if (totalLength != that.totalLength) return false;
        if (totalTime != null ? !totalTime.equals(that.totalTime) : that.totalTime != null) return false;
        if (startTime != null ? !startTime.equals(that.startTime) : that.startTime != null) return false;
        if (endTime != null ? !endTime.equals(that.endTime) : that.endTime != null) return false;
        if (activityType != null ? !activityType.equals(that.activityType) : that.activityType != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = recordId;
        result = 31 * result + (totalTime != null ? totalTime.hashCode() : 0);
        result = 31 * result + (startTime != null ? startTime.hashCode() : 0);
        result = 31 * result + (endTime != null ? endTime.hashCode() : 0);
        result = 31 * result + (activityType != null ? activityType.hashCode() : 0);
        result = 31 * result + totalLength;
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "route_id", referencedColumnName = "route_id", nullable = false)
    public RouteEntity getRouteByRouteId() {
        return routeByRouteId;
    }

    public void setRouteByRouteId(RouteEntity routeByRouteId) {
        this.routeByRouteId = routeByRouteId;
    }
}
