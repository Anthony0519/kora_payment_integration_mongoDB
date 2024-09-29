import {connect} from "mongoose"
import variable from '../envVariables/environment'
import { logger } from '../utils/logger'

const dbConnect = async () => {
    try {
      await connect(variable.DBLink);
      logger.info('Connected to Database.');
    } catch (err: any) {
      logger.error(`Unable to connect to the database: ${err.message}`);
    }
  };

export default dbConnect
