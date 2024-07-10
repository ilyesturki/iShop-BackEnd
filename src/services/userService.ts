import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User, { UserType } from "../models/User";
import ApiError from "../utils/ApiError";
import generateToken from "../utils/generateToken";

import { Request, Response, NextFunction } from "express";
import factory from "./factoryService";

// @desc    Update the password of the logged-in user
// @route   PUT /users/update-password
// @access  Private
export const updateLoggedUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { currentPassword, password } = req.body;
    const user = await User.findById(userId);

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return next(new ApiError("Invalid password", 400));
    }
    user.password = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
    user.pwUpdatedAt = new Date();
    user.pwResetCode = undefined;
    user.pwResetExpires = undefined;
    user.pwResetVerified = undefined;
    await user.save();
    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).json({ data: userObject, token });
  }
);

// @desc    Create a new user
// @route   POST /users
// @access  Admin
export const createUser = factory.createOne<UserType>(User);

// @desc    Get a list of users
// @route   GET /users
// @access  Admin
export const getUsers = factory.getAll<UserType>(User);

// @desc    Update a specific user by ID
// @route   PUT /users/:id
// @access  Private/Admin
export const updateUser = factory.updateOne<UserType>(User);

// @desc    Delete a specific user by ID
// @route   DELETE /users/:id
// @access  Private/Admin
export const deleteUser = factory.deleteOne<UserType>(User);

// @desc    Get a specific user by ID
// @route   GET /users/:id
// @access  Private/Admin
export const getUser = factory.getOne<UserType>(User);
