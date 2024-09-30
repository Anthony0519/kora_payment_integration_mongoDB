import express from 'express'
import variable from './core/envVariables/environment'
import { userRoutes } from './api/routes/user'
import { transactionRoutes } from './api/routes/transaction'
import { logger } from './core/utils/logger'
import { Errors } from './core/constant/errorResponse'
import { handleErrors } from './api/middleware/handleError'
import dbConnect from './core/config/dbConnect'

const app = express()
app.use(express.json())
app.use(userRoutes)
app.use(transactionRoutes)

app.use((req, res, _next): void => {
  res.status(404).send({
    status: false,
    error: 'not found',
    message: `${Errors.RESOURCE_NOT_FOUND}... Probably a wrong endpoint or method`,
    data: {},
    path: req.url
  })
})
app.use(handleErrors)

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(variable.PORT, () => {
      logger.info(`Server running on port: ${variable.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server due to database connection failure');
    process.exit(1);
  }
};

startServer();
