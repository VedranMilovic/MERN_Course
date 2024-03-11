import jwt from "jsonwebtoken";

// token šaljemo s be na fe. onda ga fe šalje natrag zajedno sa  HTTPCookie (sa svim ostalim zahtjevima) na be
export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    // secret string može biti bilo kaj
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = (token) => {
  // tu provjeravamo JWT token koji dobijamo od clienta (iz cookie)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
