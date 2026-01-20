import { LoginData } from "./user.interface";
import Users from "../../models/userModel";
import jwt from "jsonwebtoken";
import { AppError } from '../../utils/appError';  
import bcrypt from "bcryptjs";


export class authService {
async login(data: LoginData): Promise<any> {
  const email = data.email?.trim().toLowerCase();
  const password = String(data.password ?? "");

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }


  const user = await Users.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status === "N") {
    throw new AppError("User account is disabled", 401);
  }


  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }


  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );


  const userObj = user.toObject();
  delete (userObj as any).password;

  return {
    success: true,
    message: "Login successful",
    token,
    user: userObj,
  };
}
}