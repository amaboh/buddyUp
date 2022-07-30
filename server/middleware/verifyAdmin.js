import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return next(createError(401, "You are not authenticiated!"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return next(createError(403, "Invalid Authentication."));
      req.user = user;
      next();
    });
  } catch (error) {
    return next(createError(400, error.message));
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
