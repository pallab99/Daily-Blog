import express,{ json } from 'express';
import 'dotenv/config';
import { connectMongoDbDatabase } from './configs/database/dbConnection.js';
import userRouter from './routes/user/userRoute.js'

const app = express();
app.use(json());

const port = process.env.PORT || 3000;

connectMongoDbDatabase();

app.get('/', (req, res) => {
  res.send('Hello,I am the base endPoint');
});

app.use("/api/user",userRouter)

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
