import type { Response } from "express";
import type { IronSession } from "iron-session";

declare global {
  interface SessionData {
    id: string;
    user: {
      email: string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

  // eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword
  declare module Express {
    interface Request {
      session: IronSession<SessionData>;
    }
  }

  export interface CustomResponse<
    TData = undefined,
    TBody = TypedResponseBody<TData>,
  > extends Response {
    json: Send<TBody, this>;
  }

  interface BigInt {
    toJSON(): string;
  }
}
