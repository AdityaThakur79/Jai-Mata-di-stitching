import jwt from "jsonwebtoken";
import Employee from "../models/employee.js";
import { User } from "../models/user.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const employeeToken = req.cookies.employeeToken;
    const userToken = req.cookies.userToken;
    const token = employeeToken || userToken;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    if (!process.env.SECRETKEY) {
      return res.status(500).json({
        message: "Server misconfiguration: SECRETKEY not set",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRETKEY);
    
    if (employeeToken) {
      req.employeeId = decode.employeeId;
      req.employee = decode;
      
      if (decode.isAdminUser) {
        const adminUser = await User.findById(req.employeeId);
        if (!adminUser || adminUser.status === "inactive") {
          return res.status(401).json({
            message: "Authentication failed. Admin account deactivated.",
            success: false,
          });
        }
      } else {
        const employee = await Employee.findById(req.employeeId);
        if (!employee || employee.status === "inactive") {
          return res.status(401).json({
            message: "Authentication failed. Employee account deactivated.",
            success: false,
          });
        }
      }
    } else if (userToken) {
      req.id = decode.userId;
      req.user = decode;
      
      const user = await User.findById(req.id);
      if (!user || user.status === "inactive") {
        return res.status(401).json({
          message: "Authentication failed. Account deactivated.",
          success: false,
        });
      }
    }
    
    next();
  } catch (error) {
    console.log("JWT Verify Error:", error.message);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
      error: error.message,
    });
  }
};

const isEmployeeAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.employeeToken;

    if (!token) {
      return res.status(401).json({
        message: "No employee token provided",
        success: false,
      });
    }

    if (!process.env.SECRETKEY) {
      return res.status(500).json({
        message: "Server misconfiguration: SECRETKEY not set",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRETKEY);
    req.employeeId = decode.employeeId || decode.userId;
    req.employee = decode;

    if (decode.isAdminUser) {
      const adminUser = await User.findById(req.employeeId);
      if (!adminUser || adminUser.status === "inactive") {
        return res.status(401).json({
          message: "Your admin account is deactivated.",
          success: false,
        });
      }
    } else {
      const employee = await Employee.findById(req.employeeId);
      if (!employee || employee.status === "inactive") {
        return res.status(401).json({
          message: "Your employee account has been deactivated.",
          success: false,
        });
      }
    }

    next();
  } catch (error) {
    console.log("Employee JWT Verify Error:", error.message);
    return res.status(401).json({
      message: "Employee authentication failed",
      success: false,
      error: error.message,
    });
  }
};

export { isAuthenticated, isEmployeeAuthenticated };
export default isAuthenticated;
