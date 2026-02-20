import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl, ip } = req;
    const user = (req as any).user;
    const userId = user ? user.id : 'anonymous';

    console.log(`[Audit Log] User: ${userId}, Method: ${method}, URL: ${originalUrl}, IP: ${ip}, Time: ${new Date().toISOString()}`);

    next();
  }
}