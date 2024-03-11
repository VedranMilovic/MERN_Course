import { body, param, validationResult } from "express-validator"; // middleware za validaciju, slično Joi

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import JobModel from "../models/JobModel.js";
import User from "../models/UserModel.js";

const withValidationErrors = (validateValues) => {
  return [
    // grupiranje middleware-a pomoću uglatih zagrada (brackets) => može i bez
    validateValues, // ovo je prvi middleware koji ubacujemo kao parametar
    (req, res, next) => {
      const errors = validationResult(req); // tu radimo validaciju na temelju prijašnjih uvjeta
      console.log(errors.isEmpty()); // rezultat je false ( u cli)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages); // tu provjeravamo ako posao postoji u bazi
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route"); // tu može i običan JS error
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  //koristimo Schema-u za postavke validation
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(
    async (value, { req }) => {
      const isValidId = mongoose.Types.ObjectId.isValid(value); // true ili false
      if (!isValidId) throw new BadRequestError("invalid MongoDB id"); // krivi length id-a. Tu može i obični JS Error
      const job = await JobModel.findById(value);
      if (!job) throw new NotFoundError(`no job with id: ${value}`); // ovo se logira u cli, procesuira error middleware. Tu može i obični JS Error
      const isAdmin = req.user.role === "admin";
      const isOwner = req.user.userId === job.createdBy.toString();
      if (!isAdmin && !isOwner)
        throw new UnauthorizedError("not authorized to access this route");
    }
    // naša vlastita funkcija uz pomoć custom() metode. naša je asinkrona, radimo s bazom da vidimo postoji li job
    // async funkcije ne vraćaju true/false, a nama to treba
  ),
]);

// export const validateTest = withValidationErrors([
//   // ova validacija ide u svaki validation kontroler, miijenjamo metode po potrebi
//   body("name")
//     .notEmpty()
//     .withMessage("name is required")
//     .isLength({ min: 3, max: 50 })
//     .withMessage("name must be between 3 and 50 characters long")
//     .trim(),
// ]);

//validacija za Usera

//register  user
export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("name is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("pass has to be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);

//login user
export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("name is required")
    .isEmail()
    .withMessage("invalid email format"),

  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("name is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        // provjera ako user postoji i ako sam to ja
        throw new BadRequestError("email already exists");
      }
    }),

  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);
