import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError } from 'sequelize';
// import { SequelizeDatabaseErr } from 'sequelize';
import DomainError from '../../core/errors/domainError';
import { logger } from '../../core/utils/logger';
import { Errors } from '../../core/constant/errorResponse';
import mongoose from 'mongoose';

export const handleErrors = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    if (err instanceof DomainError) {
        return res.status(err.getHttpCode()).send({
            status: err.getStatus(),
            error: err.getName(),
            message: err.message,
            data: err.getData ? err.getData() || {} : {},
        });
    }

    if (err instanceof ValidationError) {
        logger.error('[Database validation error] => ', err.message);
        return res.status(400).send({
            status: false,
            error: 'validation_error',
            message: err.message,
            data: {}
        });
    }
    
    if (err instanceof DatabaseError) {
        logger.error('[SequelizeDatabaseError] => ', err.message);
        return res.status(500).send({
            status: false,
            error: 'database_error',
            message: 'There was a problem with the database.',
            details: err.message,
            data: {}
        });
    }

    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
            field: error.path,
            message: error.message
        }));

        logger.error('[MongooseValidationError] => ', err.message);
        return res.status(400).send({
            status: false,
            error: 'validation_error',
            message: 'Validation failed',
            details: errors,
            data: {}
        });
    }

     if (err instanceof TypeError) {
        logger.error('[TypeError] => ', err.message);
        return res.status(500).send({
            status: false,
            error: 'type_error',
            message: 'There was an unexpected error. Please try again later.',
            details: err.message,
            data: {}
        });
    }


    logger.error('[Unhandled Error] => ', err)
    return res.status(500).send({
        status: false,
        error: 'server_error',
        message: Errors.SERVER_ERROR,
        data: {}
    })
}