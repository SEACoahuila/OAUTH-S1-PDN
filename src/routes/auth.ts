import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

const validations = [AuthController.getHeaderData, asyncHandler(AuthController.validationRequest), asyncHandler(AuthController.validationRequestData)];

router.post('/token', validations, asyncHandler(AuthController.createToken));

export default router;