import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h'; // Token expires in 1 hour, you can adjust this

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined. Authentication will not work.');
}

export interface JwtPayload {
  userId: number;
  username: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}; 