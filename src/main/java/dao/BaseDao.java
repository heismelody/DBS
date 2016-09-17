package dao;

/**
 *
 */
public interface BaseDao {

    /**
     * create operation
     * @param obj
     */
    void create(Object obj);

    /**
     * retrieve operation
     * @param obj
     */
    void retrieve(Object obj);

    /**
     * update operation
     * @param obj
     */
    void update(Object obj);

    /**
     * delete operation
     * @param obj
     */
    void delete(Object obj);
}
