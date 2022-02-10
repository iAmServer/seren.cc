import express from 'express';
import responseController from '../controllers/response.controller.js';

const router = express.Router();

router.get('/retrieve', responseController.getAll);

export default router;