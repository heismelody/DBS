package model;

import javax.persistence.*;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "admin", schema = "test", catalog = "")
public class AdminEntity {
    private String adminId;
    private String pw;

    @Id
    @Column(name = "admin_id")
    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    @Basic
    @Column(name = "pw")
    public String getPw() {
        return pw;
    }

    public void setPw(String pw) {
        this.pw = pw;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AdminEntity that = (AdminEntity) o;

        if (adminId != null ? !adminId.equals(that.adminId) : that.adminId != null) return false;
        if (pw != null ? !pw.equals(that.pw) : that.pw != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = adminId != null ? adminId.hashCode() : 0;
        result = 31 * result + (pw != null ? pw.hashCode() : 0);
        return result;
    }
}
