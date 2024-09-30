import { Router } from 'express';
import {
    payIn,
    payOut,
    verifyBank,
    webhookRes,
    verifyTransfer,
    verifyPayment
} from '../requestHandler/transaction';
import { authenticate } from '../middleware/authentication';

const router = Router();

router.post('/deposite', authenticate, payIn);
router.post('/verify_payment', verifyPayment);
router.post('/verify_transfer', verifyTransfer);
router.post('/pay-out', authenticate, payOut);
router.get('/verify-bank', authenticate, verifyBank);
router.put('/webhook', webhookRes);

export { router as transactionRoutes };
