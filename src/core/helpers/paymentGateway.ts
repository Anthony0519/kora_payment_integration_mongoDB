import axios from "axios";
import InternalServerError from "../errors/internalServerError";
import variable from '../envVariables/environment'
import {
    BankVerification,
    InitializePayinReq,
    InitializePayoutReq,
    PaymentGateway,
    PayoutGateway,
    QueryTransaction,
    QueryTransactionRes
} from "../interfaces/transaction";
import { logger } from '../utils/logger'

const apiKey = variable.API_KEY;


export const InitializePayin = async (
    body: InitializePayinReq,
    userData: { [key: string]: any }
): Promise<PaymentGateway<object>> => {
    try {

        const URL = 'https://api.korapay.com/merchant/api/v1/charges/initialize'
        const requestData = {
                    amount: body.amount,
                    redirect_url: 'https://tour-haven-appli.vercel.app',
                    currency: body.currency,
                    reference: userData.ref,
                    narration: body.narration ? `${body.narration}` : "nil",
                    channels: [
                        'card',
                        'bank_transfer',
                    ],
                    default_channel: 'card',
                    customer: {
                        name: userData.name,
                        email: userData.email,
                    },
                    notification_url: 'https://kora-payment-integration-mongodb.onrender.com/webhook',
                    metadata: {
                        user_id: userData.id,
                    }
                }
        const data = await axios.post(URL, requestData,
        {
        headers : {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": 'application/json'
            }
        })

        // logger.info("first logger",data)

        const response = data
        if(response.data && response.data.status === true){
            // logger.info("second logger =======",response)
            return { data: response.data }
        }
        // return false;
 
    } catch (error: any) {
        console.log(error)
        throw new InternalServerError(`an error occoured: ${error.message}`, error)
    }
}

export const queryCharge = async (
    body: QueryTransaction,
): Promise<QueryTransactionRes<object>> => {
    try {

        const URL = `https://api.korapay.com/merchant/api/v1/charges/${body.reference}`

        const data = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json()
        return {
            reference: response.data.reference,
            status: response.data.status,
            amount: parseInt(response.data.amount),
            data: response
        }

    } catch (error: any) {
        logger.error(error.message)
        throw new InternalServerError(`an error occoured: ${error.message}`, error)
    }
}

export const InitializePayout = async (
    body: InitializePayoutReq,
    userData: { [key: string]: any }
): Promise<PayoutGateway<object>> => {
    try {

        const URL = 'https://api.korapay.com/merchant/api/v1/transactions/disburse'

        const data = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                reference: userData.ref,
                destination: {
                    type: 'bank_account',
                    amount: body.amount,
                    currency: 'NGN',
                    narration: body.narration ? `${body.narration}` : null,
                    bank_account: {
                        bank: body.bank,
                        account: body.account
                    },
                    customer: {
                        name: userData.name,
                        email: userData.email
                    }
                }
            })
        })

        const response = await data.json()
        // console.log(response)
        return { data: response, currency: response.data.currency }

    } catch (error: any) {
        console.log(error)
        logger.error(error.message)
        throw new InternalServerError(`an error occoured: ${error.message}`, error)
    }
}

export const verifyTransfer = async (
    body: QueryTransaction,
): Promise<QueryTransactionRes<object>> => {
    try {

        const URL = `https://api.korapay.com/merchant/api/v1/transactions/${body.reference}`

        const data = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'content-type': 'application/json'
            }
        })

        const response = await data.json()
        return {
            reference: response.data.reference,
            status: response.data.status,
            amount: parseInt(response.data.amount),
            data: response
        }

    } catch (error: any) {
        logger.error(error.message)
        throw new InternalServerError(`an error occoured: ${error.message}`, error)
    }
}

export const verifyBank = async (
    body: BankVerification
): Promise<PaymentGateway<object>> => {
    try {

        const URL = 'https://api.korapay.com/merchant/api/v1/misc/banks/resolve'

        const data = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                bank: body.bank,
                account: body.account,
                currency: 'NGN'
            })
        })

        const response = await data.json()
        return { data: response }
    } catch (error: any) {
        logger.error(error.message)
        throw new InternalServerError(`an error occoured: ${error.message}`, error)
    }
}