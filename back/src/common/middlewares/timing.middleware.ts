//archivo creado para registrar las peticiones entrantes al servidor.

import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startAt = Date.now();
    const originalSend = res.send.bind(res);

    res.send = (body: unknown) => {
      const ms = Date.now() - startAt;
      res.setHeader('X-Response-Time', `${ms} ms`);
      return originalSend(body);
    };
//llamamos a next() para pasar el control al siguiente middleware o al controlador. 
//Sin next() la petición se queda colgada.
    next();
  }
}