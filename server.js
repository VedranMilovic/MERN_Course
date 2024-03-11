import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express"; // import iz node_modules, pa ne treba express.js
const app = express(); // pokretanje: npm run dev
import morgan from "morgan";
import mongoose from "mongoose";
// import { validateTest } from "./middleware/validationMiddleware.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

//routers
import jobRouter from "./routers/jobRouter.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";

//public

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

import { dirname } from "path";
import { fileURLToPath } from "url"; // Node.js module
import path from "path"; // Node.js module

//middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js"; // named export imamo u authMiddleware

//The fileURLToPath(import.meta.url) converts the file URL to a file path, and then dirname(...)
//extracts the directory name from that path. The result is assigned to __dirname, which is a
//common pattern in CommonJS modules for getting the current directory name.
//This is often used as a workaround in ESM (ECMAScript modules) because the __dirname variable is
// not automatically available in ESM as it is in CommonJS modules.
const __dirname = dirname(fileURLToPath(import.meta.url)); // ovo upućuje na current folder

if (process.env.NODE_ENV === "development") {
  // da se morgan logovi vide samo u devu. NODE_ENV smo zapravo napravili environment variable
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./client/dist"))); // static middleware, koristi static files iz ./client/dist, naš najnoviji front-end
// path.resolve radi apsolutni path do ./public, neovisno o current script => trenutno http://localhost:5100/avatar-1.jpg otvara fotku!
//IMPORTANT time nam je public folder publically available
app.use(cookieParser());
app.use(express.json());

// stari način =>
// const getData = async () => {
//   const response = await fetch(
//     "https://www.course-api.com/react-useReducer-cart-project"
//   );
//   const cartData = await response.json();
//   console.log(cartData);
// };

// getData();

//moderni način
// try {
//   const response = await fetch(
//     "https://www.course-api.com/react-useReducer-cart-project"
//   );
//   const cartData = await response.json();
//   console.log(cartData);
// } catch (error) {
//   console.log(error);
// }

app.get("/", (req, res) => {
  res.send("hello world");
});

// primjer validacije
// app.post(
//   "/api/v1/test",
//   validateTest,

//   (req, res) => {
//     // validacija u brackets + anonimna funkcija
//     const { name } = req.body;
//     res.json({ message: `hello ${name}` });
//     // console.log(req);
//     // res.json({ message: "data received", data: req.body }); // tu smo napravili objekt s keyevima message i data
//   }
// );

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use(`/api/v1/jobs`, authenticateUser, jobRouter); // zaštićene routes sa authenticateUser
app.use(`/api/v1/users`, authenticateUser, userRouter); // zaštićene routes sa authenticateUser (provjera ako user ima permisije za ove routes)
app.use(`/api/v1/auth`, authRouter); // public routes,  dostupne svim  userima

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/client/dist", "index.html")); //controller za entry point za frontend koji je u public folderu, entry je index.html
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: `not found` });
}); // naš error middleware koriste se svi URL do zvjezdice (poredak je bitan), jer imamo zvjezdicu
// hvata error ako nema resource, dakle pravi URL

// express error middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on port ${port}`); // ako se povežemo s bazom, onda pokreni server
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
