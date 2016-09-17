package model;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by root on 16-9-17.
 */
@Entity
@Table(name = "task_completion", schema = "test", catalog = "")
public class TaskCompletionEntity {
    private int taskId;
    private Timestamp recordTime;
    private String completionRate;
    private String finishType;
    private Timestamp finishTime;

    @Id
    @Column(name = "task_id")
    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    @Basic
    @Column(name = "record_time")
    public Timestamp getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(Timestamp recordTime) {
        this.recordTime = recordTime;
    }

    @Basic
    @Column(name = "completion_rate")
    public String getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(String completionRate) {
        this.completionRate = completionRate;
    }

    @Basic
    @Column(name = "finish_type")
    public String getFinishType() {
        return finishType;
    }

    public void setFinishType(String finishType) {
        this.finishType = finishType;
    }

    @Basic
    @Column(name = "finish_time")
    public Timestamp getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(Timestamp finishTime) {
        this.finishTime = finishTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TaskCompletionEntity that = (TaskCompletionEntity) o;

        if (taskId != that.taskId) return false;
        if (recordTime != null ? !recordTime.equals(that.recordTime) : that.recordTime != null) return false;
        if (completionRate != null ? !completionRate.equals(that.completionRate) : that.completionRate != null)
            return false;
        if (finishType != null ? !finishType.equals(that.finishType) : that.finishType != null) return false;
        if (finishTime != null ? !finishTime.equals(that.finishTime) : that.finishTime != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = taskId;
        result = 31 * result + (recordTime != null ? recordTime.hashCode() : 0);
        result = 31 * result + (completionRate != null ? completionRate.hashCode() : 0);
        result = 31 * result + (finishType != null ? finishType.hashCode() : 0);
        result = 31 * result + (finishTime != null ? finishTime.hashCode() : 0);
        return result;
    }
}
