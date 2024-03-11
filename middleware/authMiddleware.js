import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  console.log(req.cookies); // req.cookies je property koje daje cookie-parser library
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("authentication invalid");

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "65e99cb3f1ca2b3ad418bad4";

    console.log("Decoded User:", { userId, role });

    req.user = { userId, role, testUser }; // ovaj req. šaljemo sljedećem kontroleru (job controller)
    // console.log(user);       // ovaj console.log ga smetao jer user nije bio postavljen!!!!!
    next();
  } catch (error) {
    // console.error("Token Verification Error:", error);       // error checking, korisno

    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    // funkcija u funkciji, jer kad ju proslijedimo ju odmah invokamo (IIFE)
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("unauthorized to access this route");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo user. Read Only"); // ako nije test user, ovo se ignorira
  next(); // prebacujemo sljedećem middleware, u našem slučaju jobRouter.
};
