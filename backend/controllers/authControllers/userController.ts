import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../services/authServices/userService';  
import Users  from '../../models/userModel';  
import { handleError } from '../../utils/errorHandler';
import { AppError } from '../../utils/appError';
const { validationResult } = require('express-validator');

const userService = new UserService();  


export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        "Validation failed: " +
          errors
            .array()
            .map((e: any) => e.msg)
            .join(", "),
        400
      );
    }

    const { name, email, password, role } = req.body; 

    const result = await userService.createUser({
      id: "",
      name,
      email,
      password,
      role: role ?? "team", 
    });

    if (!result.success) {
      return res.status(result.error.status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        'Validation failed: ' + errors.array().map((e: any) => e.msg).join(', '),
        400
      );
    }

    const { id } = req.params;  
    const { name, email, password, role, permissions } = req.body; 

    const result = await userService.updateUser({
      id, name, email, password, role, permissions
    });

    if (!result.success) {
      return res.status(result.error.status || 400).json(result); 
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        'Validation failed: ' + errors.array().map((e: any) => e.msg).join(', '),
        400
      );
    }

    const { id } = req.params;  

    const result = await userService.deleteUser({ id });

    if (!result.success) {
      return res.status(result.error.status || 400).json(result);  
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        'Validation failed: ' + errors.array().map((e: any) => e.msg).join(', '),
        400
      );
    }

    const page = parseInt(req.query.page as string) || 1;  
    const limit = parseInt(req.query.limit as string) || 10;  
    const name = req.query.name as string;
    const email = req.query.email as string;
    const sortField = req.query.sortField as string || 'createdAt';  
    const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';  

    const result = await userService.getUsers(page, limit, { name, email }, sortField, sortOrder);

    return res.status(200).json(result.data);
  } catch (error) {
    next(error);
  }
};


export const getTeamMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        "Validation failed: " + errors.array().map((e: any) => e.msg).join(", "),
        400
      );
    }

    const result = await userService.getTeamMembers();

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};