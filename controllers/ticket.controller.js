import { ticketService } from "../services/ticket.service.js";
import ErrorResponse from "../lib/error.res.js";
import SuccessResponse from "../lib/success.res.js";

const createTicket = async (req, res, next) => {
  const {topic, resolution } = req.body;

  if (!topic || !resolution) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const data = await ticketService.createTicket(req);
    if (data)
      return SuccessResponse.created(res, "Ticket created successfully", data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const informUser = async (req, res, next) => {
  const { ticketId,status,comment } = req.body;

  if (!ticketId || !status|| !comment) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const data = await ticketService.updateTicketStatusAndNotify(req);
    if (data)
      return SuccessResponse.created(res, "Ticket status updated and email sent to the user", data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchTickets = async (req, res, next) => {
  try {
    const data = await ticketService.fetchTickets(req);
    if (data)
      return SuccessResponse.ok(res, "Tickets fetched successfully", data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const ticketController = {
  createTicket,
  fetchTickets,
  informUser
};
