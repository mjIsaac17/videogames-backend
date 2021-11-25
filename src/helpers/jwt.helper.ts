import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

const sign = (payload: Object, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, options);
};

const generateTokens = (
  userId: string,
  userName: string,
  userRoleId: ObjectId
) => {
  const authToken = sign(
    { userId, userName, userRoleId },
    { expiresIn: "20d" }
  );
  const refreshToken = sign(
    { userId, userName, userRoleId },
    { expiresIn: "1d" }
  );

  return { authToken, refreshToken };
};

const validateToken = (token: string) => {
  try {
    const tokenData = jwt.verify(token, process.env.SECRET_KEY as string);
    return { validToken: true, tokenData };
  } catch (error) {
    return { validToken: false };
  }
};

export default { generateTokens, validateToken };
