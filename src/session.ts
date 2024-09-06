import type { NextFunction, Request, Response } from "express";
import {
  type SessionOptions,
  type IronSession,
  getIronSession,
} from "iron-session";

export const SESSION_OPTIONS: SessionOptions = {
  password: "super-secret-cookie-password-32-chars-long",
  cookieName: "test.cookie",
  cookieOptions: {
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    httpOnly: true,
  },
  ttl: 3600,
} as const;

function getPropertyDescriptorForReqSession(
  session: IronSession<any>,
): PropertyDescriptor {
  return {
    enumerable: true,
    get() {
      return session;
    },
    set(value) {
      const keys = Object.keys(value);
      const currentKeys = Object.keys(session);
      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          delete session[key];
        }
      });
      keys.forEach((key) => {
        session[key] = value[key];
      });
    },
  };
}

export const withSession: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (req, res, next) => {
  const session = await getIronSession(req, res, SESSION_OPTIONS);
  Object.defineProperty(
    req,
    "session",
    getPropertyDescriptorForReqSession(session),
  );

  next();
};

export const isAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.session.id || !req.session.user) {
      req.session.destroy();
      throw new Error("Unauthorized");
    }
  } catch (e) {
    next(e);
  }

  next();
};

export const sessions = new Map();
