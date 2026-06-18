//archivo creado para registrar las peticiones entrantes al servidor.
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    //llamamos a next() para pasar el control al siguiente middleware o al controlador. 
    next();
  }
}