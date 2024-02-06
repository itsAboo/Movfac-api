import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface UserDecoded {
  _id: string;
  email: string;
  name: string;
  plans: {};
}

export const verifyToken: RequestHandler = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(404);
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token === "null") {
    return res.status(401).json({ msg: "ไม่มี token" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    user: UserDecoded;
  };
  console.log("decoded", decoded);
  if (!decoded) {
    return res.status(401).json({ msg: "ไม่มีสิทธิ์เข้าถึง" });
  }
  req.userId = decoded.user._id;
  next();
};

// export const verifyToken: RequestHandler = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({ msg: "ไม่มี token" });
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//     user: UserDecoded;
//   };
//   if (!decoded) {
//     return res.status(401).json({ msg: "ไม่มีสิทธิ์เข้าถึง" });
//   }
//   req.userId = decoded.user._id;
//   next();
// };
