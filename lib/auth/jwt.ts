import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN_SECONDS = process.env.JWT_EXPIRES_IN_SECONDS
  ? parseInt(process.env.JWT_EXPIRES_IN_SECONDS, 10)
  : 7 * 24 * 60 * 60;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  };

  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as JWTPayload;
  } catch{
    throw new Error('Invalid token');
  }
}