import express from "express";

import { protect, allowedTo } from "../services/authService";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  updateLoggedUserPassword,
} from "../services/userService";
import {
  createUserValidator,
  updateUserValidator,
  updateLoggedUserPasswordValidator,
  updatePasswordValidator,
  deleteLoggedUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
  getLoggedUserValidator,
} from "../utils/validators/userValidator";
import {
  uploadUserImage,
  resizeProfilImage,
} from "../middlewares/uploadImage/uploadUserImage";
import extractUserId from "../middlewares/extractUserId";

const router = express.Router();

// Protect all routes below this middleware with authentication
router.use(protect);

// Routes for operations on the logged-in user by ID
router.use("/me/:id", extractUserId);
router
  .route("/me/:id")
  /**
   * @route   GET /me/:id
   * @desc    Get the logged-in user
   * @access  Private
   */
  .get(getLoggedUserValidator, getUser)
  /**
   * @route   PUT /me/:id
   * @desc    Update the logged-in user
   * @access  Private
   */
  .put(
    uploadUserImage,
    resizeProfilImage,
    updateLoggedUserValidator,
    updateUser
  )
  /**
   * @route   DELETE /me/:id
   * @desc    Delete the logged-in user
   * @access  Private
   */
  .delete(deleteLoggedUserValidator, deleteUser);

/**
 * @route   PUT /update-password
 * @desc    Update the password of the logged-in user
 * @access  Private
 */
router.put(
  "/update-password",
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

// Authorization middleware for admin-only routes
router.use(allowedTo("admin"));

router
  .route("/")
  /**
   * @route   GET /users
   * @desc    Get all users
   * @access  Private (admin only)
   */
  .get(getUsers)
  /**
   * @route   POST /users
   * @desc    Create a new user
   * @access  Private (admin only)
   */
  .post(uploadUserImage, resizeProfilImage,createUserValidator, createUser);

router
  .route("/:id")
  /**
   * @route   GET /users/:id
   * @desc    Get a user by ID
   * @access  Private (admin only)
   */
  .get(getUserValidator, getUser)
  /**
   * @route   PUT /users/:id
   * @desc    Update a user by ID
   * @access  Private (admin only)
   */
  .put(uploadUserImage, resizeProfilImage, updateUserValidator, updateUser)
  /**
   * @route   DELETE /users/:id
   * @desc    Delete a user by ID
   * @access  Private (admin only)
   */
  .delete(deleteUserValidator, deleteUser);

/**
 * @route   PUT /users/changePassword/:id
 * @desc    Update a user's password by ID
 * @access  Private (admin only)
 */
router.put("/changePassword/:id", updatePasswordValidator, updateUser);

export default router;
