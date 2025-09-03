import { _registerUser, _loginUser,_userProfile,_getTicketList } from "../services/user.service.js";

import SuccessResponse from "../lib/success.res.js";


const registerUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
     return res.json({ success: false, message: "All fields are required" });
    }

    const response = await _registerUser(req, res, next);
    if (response)
      return SuccessResponse.created(res, response.message, response.data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       return res.json({ success: false, message: "All fields are required" });
    }

    const response = await _loginUser(req, res);
    if (response)
      return SuccessResponse.created(res, response.message, response.data);
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const userProfile = async (req, res, next) => {
  try {
    const response = await _userProfile(req, res,next);
    if (response)
      return SuccessResponse.ok(res, response.message, response.data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTicketList = async (req, res) => {
  try {
    const response = await _getTicketList(req, res);
    if (response)
      return SuccessResponse.ok(res, response.message, response.data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerUser, loginUser, userProfile, getTicketList };
