package dao;

/**
 * Created by root on 16-9-17.
 */
public interface IUserDao extends BaseDao{

    void create(Object obj);

    void retrieve(Object obj);

    void update(Object obj);

    void delete(Object obj);
}
