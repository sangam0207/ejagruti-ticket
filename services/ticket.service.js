import Ticket from "../models/ticket.model.js";
import crypto from "crypto";
import emailService from "./email.service.js";
import User from "../models/user.modal.js";
const generateTicketId = () => {
  return "TICKET" + crypto.randomBytes(4).toString("hex").toUpperCase();
};

const createTicket = async (req) => {
  const {id} = req.user;
  const existingUser = await User.findById(id);
    if (!existingUser) {
    return res.json({ success: false, message: "User not found" });
  }
  const { resolution, topic } = req.body;

  const ticketId = generateTicketId();
  console.log(ticketId);
  const newTicket = new Ticket({
    userName: existingUser.name,
    userEmail: existingUser.email,
    topic,
    resolution,
    ticketId,
  });
  await newTicket.save();
  const emailTransport = await emailService.sendTicketCreateEamil(
    existingUser.email,
    existingUser.name,
    topic,
    resolution,
    ticketId
  );

  if (!emailTransport) {
    return next(ErrorResponse.internalServer("Failed to send email"));
  }
  console.log(newTicket);
  return newTicket;
};
const updateTicketStatusAndNotify = async (req) => {
  const { ticketId, status, comment } = req.body;

  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    return next(ErrorResponse.notFound("Ticket not found"));
  }

  ticket.status = status;
  await ticket.save();

  const emailTransport = await emailService.sendResolvedEamil(
    ticket.userEmail,
    ticket.userName,
    ticket.topic,
    ticket.resolution,
    ticket.ticketId,
    comment
  );

  if (!emailTransport) {
    return next(ErrorResponse.internalServer("Failed to send email"));
  }

  return ticket;
};
const fetchTickets = async (req) => {
  let { pageIndex, pageSize, search, sort } = req.query;

  pageSize = parseInt(pageSize);
  pageIndex = parseInt(pageIndex);

  if (!pageIndex) pageIndex = 1;
  if (!pageSize) pageSize = 10;

  let query = {};

  if (search && search !== "") {
    query = {
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ],
    };
  }

  const skip = (pageIndex - 1) * pageSize;

  let sortCriteria = { createdAt: -1 };

  if (sort && sort.key && (sort.order === "asc" || sort.order === "desc")) {
    let { key, order } = sort;
    sortCriteria = { [key]: order === "asc" ? 1 : -1 };
  }

  const totalCount = await Ticket.countDocuments(query);
  const tickets = await Ticket.find(query)
    .sort(sortCriteria)
    .skip(skip)
    .limit(pageSize)
    .select("-_id -__v");

  return {
    data: tickets,
    tableData: {
      search: search || "",
      pageIndex,
      pageSize,
      sort: {
        key: sort?.key || "createdAt",
        order: sort?.order || "desc",
      },
      totalRecords: totalCount,
    },
  };
};

export const ticketService = {
  createTicket,
  fetchTickets,
  updateTicketStatusAndNotify
};
