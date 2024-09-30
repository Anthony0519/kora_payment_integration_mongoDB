import { 
    InitializePayinReq,
    PayinRes,
    InitializePayoutReq,
    PayoutRes,
    PaymentGateway,
    WebhookRes,
    BankVerification,
    QueryTransaction
} from "../interfaces/transaction";
import Transaction from '../models/transaction';
import User from '../models/user'
import ResourceNotFound from '../errors/resourceNotFoundError';
import BadRequestError from '../errors/badRequestError';
import { generateReference } from '../helpers/reference';
import { InitializePayin, InitializePayout, verifyBank, queryCharge, verifyTransfer } from "../helpers/paymentGateway";
import { PayinUpdate, payoutUpdate } from "../helpers/userUpdates";
import { logger } from "../utils/logger";

// INITIALIZE CHARGE(DEPOSITE)
export const InitializeCharge = async (
    id: string, // Changed to string for MongoDB ObjectId
    body: InitializePayinReq
): Promise<PayinRes<object>> => {
    // Find the user with the ID logged in
    const user = await User.findById(id); // Mongoose `findById`

    if (!user) {
        const error = new Error();
        throw new ResourceNotFound("User not found", error);
    }

    // Abbreviation of the user's first and last letter of fullname
    const userFullname = user.fullName.split(' ');
    const getFirstAndLastLetter1 = userFullname[0].slice(0, 1).toUpperCase() + userFullname[0].slice(-1).toUpperCase();
    const getFirstAndLastLetter2 = userFullname[1].slice(0, 1).toUpperCase() + userFullname[1].slice(-1).toUpperCase();
    const abbName = getFirstAndLastLetter1 + getFirstAndLastLetter2;

    const generate = generateReference(10);
    const ref = `${abbName}-${generate}`;

    // Extract the needed data from the user found
    const userData = {
        id: user.id,
        email: user.email,
        name: user.fullName,
        ref: ref,
    };

    // Initialize the payment
    const response = await InitializePayin(body, userData);

    // Calculate the transaction date and time
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // Save the transaction in MongoDB
    await Transaction.create({
        userId: id,
        amount: body.amount,
        status: 'pending',
        currency: body.currency,
        transaction_reference: ref,
        DateTime: formattedDate,
    });

    logger.info('Successfull');
    return { message: "Pay in successful", data: response.data };
};

export const verifyPayin = async (
    body: QueryTransaction
):Promise<PayinRes<object>>=>{
    const transaction = await queryCharge(body)
    await PayinUpdate(transaction.reference, transaction.amount, transaction.status);
    return { message: "Payment retrieved successful and user Updated", data: transaction.data }
}

export const verifyPayout = async (
    body: QueryTransaction
):Promise<PayinRes<object>>=>{
    const res = await verifyTransfer(body)
    // console.log(res)
    await payoutUpdate(res.reference, res.amount, res.status);
    return { message: "Payment retrieved successful and user Updated", data: res.data }
}

export const Payout = async (
    id: string,
    body: InitializePayoutReq
): Promise<PayoutRes> => {
    // Find the user making the transfer
    const user = await User.findById(id); // Mongoose `findById`

    if (!user) {
        const error = new Error();
        throw new ResourceNotFound("User not found", error);
    }

    if (user.balance < body.amount) {
        const error = new Error();
        throw new BadRequestError("Low Balance", error);
    }

    // Abbreviation of the user's first and last letter of fullname
    const userFullname = user.fullName.split(' ');
    const getFirstAndLastLetter1 = userFullname[0].slice(0, 1).toUpperCase() + userFullname[0].slice(-1).toUpperCase();
    const getFirstAndLastLetter2 = userFullname[1].slice(0, 1).toUpperCase() + userFullname[1].slice(-1).toUpperCase();
    const abbName = getFirstAndLastLetter1 + getFirstAndLastLetter2;

    const generate = generateReference(10);
    const ref = `${abbName}-${generate}`;

    const userData = {
        id: user.id,
        email: user.email,
        name: user.fullName,
        ref: ref,
    };

    // Initialize the payout
    const response = await InitializePayout(body, userData);

    // Calculate the transaction date and time
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // Save the transaction in MongoDB
    await Transaction.create({
        userId: id,
        amount: body.amount,
        status: 'pending',
        currency: response.currency,
        transaction_reference: ref,
        DateTime: formattedDate,
    });

    logger.info(response.data);
    logger.info("Payout success");
    return {
        message: "Payout successful",
        sender: user.fullName,
        receiver: body.account,
        receiverBank: body.bank,
    };
};

// Webhook for handling transactions
export const webhook = async (
    body: WebhookRes
): Promise<PaymentGateway<object>> => {
    const { reference, amount, status, event } = body;

    if (event === 'charge.success' || event === 'charge.failed') {
        const updateBalance = await PayinUpdate(reference, amount, status);
        return updateBalance;
    } else if (event === 'transfer.success' || event === 'transfer.failed') {
        const updateBalance = await payoutUpdate(reference, amount, status);
        return updateBalance;
    } else {
        const error = new Error();
        throw new BadRequestError("Unhandled event", error);
    }
};

// Bank Details Verification
export const BankDetails = async (
    body: BankVerification
): Promise<PaymentGateway<object>> => {
    // Verify bank details
    const response = await verifyBank(body);

    // Return the response
    logger.info('success');
    return { data: response.data };
};
