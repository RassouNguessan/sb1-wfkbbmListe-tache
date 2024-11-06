import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Node.js!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});