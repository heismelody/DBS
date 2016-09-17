package model;

import javax.persistence.*;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "user_task", schema = "test", catalog = "")
public class UserTaskEntity {
    private int userId;
    private Integer taskId;

    @Id
    @Column(name = "user_id")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Basic
    @Column(name = "task_id")
    public Integer getTaskId() {
        return taskId;
    }

    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserTaskEntity that = (UserTaskEntity) o;

        if (userId != that.userId) return false;
        if (taskId != null ? !taskId.equals(that.taskId) : that.taskId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = userId;
        result = 31 * result + (taskId != null ? taskId.hashCode() : 0);
        return result;
    }
}
