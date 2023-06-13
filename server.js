import express, { json } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectMongoDbDatabase } from './configs/database/dbConnection.js';
import userRouter from './routes/user/userRoute.js';
import blogRouter from './routes/blog/blogRoute.js';

const app = express();
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(json());

const port = process.env.PORT || 3000;

connectMongoDbDatabase();

app.get('/', (req, res) => {
  res.send('Hello,I am the base endPoint');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS'
  );
});

app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
