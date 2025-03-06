import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export function getUser() {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  } catch (error) {
    return null;
  }
}
