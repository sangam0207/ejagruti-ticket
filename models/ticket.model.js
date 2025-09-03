import mongoose from "mongoose";

/**
 * Schema for Ticket
 */
const ticketSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
       
    },
    ticketId: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    resolution: {
        type: String,
        required: true,
        trim: true
    },
     status: {
        type: String,
        enum: ["open", "in_progress", "closed"],
        default: "open"
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
