package model;

import javax.persistence.*;
import java.math.BigDecimal;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "route", schema = "test", catalog = "")
public class RouteEntity {
    private int routeId;
    private BigDecimal startLat;
    private BigDecimal startLng;
    private BigDecimal endLat;
    private BigDecimal endLng;
    private int pointCount;

    @Id
    @Column(name = "route_id")
    public int getRouteId() {
        return routeId;
    }

    public void setRouteId(int routeId) {
        this.routeId = routeId;
    }

    @Basic
    @Column(name = "start_lat")
    public BigDecimal getStartLat() {
        return startLat;
    }

    public void setStartLat(BigDecimal startLat) {
        this.startLat = startLat;
    }

    @Basic
    @Column(name = "start_lng")
    public BigDecimal getStartLng() {
        return startLng;
    }

    public void setStartLng(BigDecimal startLng) {
        this.startLng = startLng;
    }

    @Basic
    @Column(name = "end_lat")
    public BigDecimal getEndLat() {
        return endLat;
    }

    public void setEndLat(BigDecimal endLat) {
        this.endLat = endLat;
    }

    @Basic
    @Column(name = "end_lng")
    public BigDecimal getEndLng() {
        return endLng;
    }

    public void setEndLng(BigDecimal endLng) {
        this.endLng = endLng;
    }

    @Basic
    @Column(name = "point_count")
    public int getPointCount() {
        return pointCount;
    }

    public void setPointCount(int pointCount) {
        this.pointCount = pointCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RouteEntity that = (RouteEntity) o;

        if (routeId != that.routeId) return false;
        if (pointCount != that.pointCount) return false;
        if (startLat != null ? !startLat.equals(that.startLat) : that.startLat != null) return false;
        if (startLng != null ? !startLng.equals(that.startLng) : that.startLng != null) return false;
        if (endLat != null ? !endLat.equals(that.endLat) : that.endLat != null) return false;
        if (endLng != null ? !endLng.equals(that.endLng) : that.endLng != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = routeId;
        result = 31 * result + (startLat != null ? startLat.hashCode() : 0);
        result = 31 * result + (startLng != null ? startLng.hashCode() : 0);
        result = 31 * result + (endLat != null ? endLat.hashCode() : 0);
        result = 31 * result + (endLng != null ? endLng.hashCode() : 0);
        result = 31 * result + pointCount;
        return result;
    }
}
