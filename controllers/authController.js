import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";
import { json } from "express";

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user"; // u req.body su svi values

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword; // postavljamo novu vrijednost

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: `User created` });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // if (!user) throw new UnauthenticatedError(`invalid credentials`);
  // const isPasswordCorrect = await comparePassword(
  //   req.body.password,
  //   user.password
  // );
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  console.log(req.body.password, user.password);
  if (!isValidUser) throw new UnauthenticatedError(`invalid credentials`);

  const token = createJWT({ userId: user._id, role: user.role });
  // res.json({ token }); //ovako bi se token pohranjivao u frontend (u local storage ili kao HTTP Cookie). Šaljemo ga s res.
  // res.send("login");
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    // "token" je ime token objekta
    httpOnly: true,
    expires: new Date(Date.now() + oneDay), // cookie nam prestaje vrijediti za jedan dan
    secure: process.env.NODE_ENV === "production", // secure nam je https, ali samo za production, da na devu možemo testirati
  }); // instance of res.
  res.status(StatusCodes.OK).json({ msg: "User logged in" }); // OK je 200. Drugi instance of res.
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    // ime cookie treba biti isto. logout je value koji šaljemo
    httpOnly: true,
    expires: new Date(Date.now()), //
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" }); // response
};
