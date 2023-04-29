/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

require('dotenv').config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server started on PORT = ${port}`);
        })
    } catch(e) {
        console.log(e);
    }
}

start()
