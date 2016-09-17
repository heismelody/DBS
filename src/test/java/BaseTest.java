import org.apache.log4j.Logger;

/**
 * Created by root on 16-9-17.
 */
public class BaseTest {

    private Logger logger;
    public static void main(String[] args){
        Logger logger = Logger.getLogger(BaseTest.class);
        logger.debug("666");
        System.out.print("Hello");
    }
}
