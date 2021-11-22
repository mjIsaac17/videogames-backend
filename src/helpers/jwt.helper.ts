import jwt from "jsonwebtoken";

export const sign = (
  payload: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, options);
};
