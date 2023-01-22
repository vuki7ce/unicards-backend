import express, { Express } from 'express';
import morgan from 'morgan';

import subjectRouter from './routes/subjectRoutes';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/subjects', subjectRouter);

const port = 3000;
app.listen(port, () => console.log(`App running on port ${port}...`));
