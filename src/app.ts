import express from 'express';

import { linksRouter } from './routes/links';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use('/', linksRouter);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
