import ConflictError from '../errors/conflictError';
import InternalServerError from '../errors/internalServerError';
import ResourceNotFound from '../errors/resourceNotFoundError';
import { PaymentGateway } from '../interfaces/transaction';
import User from '../models/user';
import Transaction from '../models/transaction';

// Payin Update
export const PayinUpdate = async (
    reference: string,
    amount: number,
    status: string
): Promise<PaymentGateway<object>> => {
    try {
        // Find the transaction with the reference
        const transaction = await Transaction.findOne({ transaction_reference: reference });

        if (!transaction) {
            const error = new Error();
            throw new ResourceNotFound("Transaction not found", error);
        }

        // Check for the user
        const user = await User.findById(transaction.userId);
        if (!user) {
            const error = new Error();
            throw new ResourceNotFound("User not found", error);
        }

        // Return message if failed
        if (status === "failed") {
            transaction.status = status;
            await transaction.save();
            const error = new Error();
            throw new ConflictError("Payment error", error);
        }

        // Update user balance on success
        user.balance += amount;
        await user.save();

        transaction.status = status;
        await transaction.save();

        return { data: transaction };
    } catch (error: any) {
        throw new InternalServerError("An error occurred", error.message);
    }
};

// Payout Update
export const payoutUpdate = async (
    reference: string,
    amount: number,
    status: string
): Promise<PaymentGateway<object>> => {
    try {
        // Find the transaction with the reference
        const transaction = await Transaction.findOne({ transaction_reference: reference });

        if (!transaction) {
            const error = new Error();
            throw new ResourceNotFound("Transaction not found", error);
        }

        // Get the user's info
        const user = await User.findById(transaction.userId);

        if (!user) {
            const error = new Error();
            throw new ResourceNotFound("User not found", error);
        }

        // Update transaction if failed
        if (status === 'failed') {
            transaction.status = status;
            await transaction.save();
            return { data: transaction };
        }

        // Update user balance and transaction if successful
        transaction.status = status;
        user.balance -= amount;
        await user.save();
        await transaction.save();
        return { data: transaction };
    } catch (error: any) {
        throw new InternalServerError("An error occurred", error.message);
    }
};
