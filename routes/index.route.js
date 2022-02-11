import express from 'express';
import responseController from '../controllers/response.controller.js';
import installController from '../controllers/install.controller.js';

const router = express.Router();

router.get('/retrieve', responseController.getAll);
router.get('/installs', installController.getAll);

export default router;