import express from "express";
import 'dotenv/config'
import userRouter from './routes/users.routes.js'
import auth from "./middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(auth)

app.get('/', (req, res) => {
    res.send('You have reached the home route');
})

app.use('/users', userRouter);

app.listen(PORT, () => console.log("server is running on port ", PORT));