import express from "express";
import 'dotenv/config'
import userRouter from './routes/users.routes.js'
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('You have reached the home route');
})

app.use('/users', userRouter);

app.listen(PORT, () => console.log("server is running on port ", PORT));