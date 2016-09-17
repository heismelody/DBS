package model;

import javax.persistence.*;
import java.math.BigDecimal;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "route_point", schema = "test", catalog = "")
public class RoutePointEntity {
    private int pointId;
    private BigDecimal lat;
    private BigDecimal lng;
    private RouteEntity routeByRouteId;

    @Id
    @Column(name = "point_id")
    public int getPointId() {
        return pointId;
    }

    public void setPointId(int pointId) {
        this.pointId = pointId;
    }

    @Basic
    @Column(name = "lat")
    public BigDecimal getLat() {
        return lat;
    }

    public void setLat(BigDecimal lat) {
        this.lat = lat;
    }

    @Basic
    @Column(name = "lng")
    public BigDecimal getLng() {
        return lng;
    }

    public void setLng(BigDecimal lng) {
        this.lng = lng;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RoutePointEntity that = (RoutePointEntity) o;

        if (pointId != that.pointId) return false;
        if (lat != null ? !lat.equals(that.lat) : that.lat != null) return false;
        if (lng != null ? !lng.equals(that.lng) : that.lng != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = pointId;
        result = 31 * result + (lat != null ? lat.hashCode() : 0);
        result = 31 * result + (lng != null ? lng.hashCode() : 0);
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
