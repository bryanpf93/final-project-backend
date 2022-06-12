import express from "express";
import usersRouter from './users/users.router.js';
import authRouter from './auth/auth.router.js';
import { validateAuth } from "./auth/auth.middleware.js";
import cors from 'cors'

export const app  = express();

app.use(cors());
app.use(express.json())

app.use(express.json()); // permitimos que el app process JSON en el body de la request
app.use('/auth', authRouter);
app.use('/users', validateAuth, usersRouter); // ahora en /students se encuentran TODAS las rutas y subrutas definidas por stundentRouter