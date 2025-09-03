import express from 'express';
import { ticketController } from '../controllers/ticket.controller.js';
import verifyAuth from '../middlewares/verifyAuth.js';

const router = express.Router();

router.post('/create-tickets',verifyAuth, ticketController.createTicket);
router.get('/tickets', ticketController.fetchTickets);
router.put('/tickets', ticketController.informUser);
export default router;


