import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import cors from 'cors';

import AppError from '@shared/errors/AppError';
import logs from '@shared/infra/http/middlewares/logsMiddleware';
import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import '@shared/infra/typeorm';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logs);
app.use('/file', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'Error',
    message: 'Intarnal server error',
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`server Started in http://localhost:${PORT}`);
});