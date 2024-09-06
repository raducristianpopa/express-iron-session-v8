import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { isAuth, sessions, withSession } from "./session";

const EMAIL = "johndoe@example.com";

const app = express();

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(withSession);

router.get("/login", async (req, res) => {
  const sessionId = crypto.randomUUID();
  const sessionUser = {
    email: EMAIL,
  };
  req.session.id = sessionId;
  req.session.user = sessionUser;

  await req.session.save();

  sessions.set(sessionId, sessionUser);

  res.send("Logged in");
});

router.get("/logout", isAuth, async (req, res) => {
  const sessionId = req.session.id;
  sessions.delete(sessionId);
  req.session.destroy();

  res.send("Logged out");
});

router.get("/session", (req, res) => {
  const session = req.session;
  res.status(200).json({ session });
});

router.use((e: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.send(e.message);
});

app.use(router);

app.listen(4848, () => {
  console.log("Listening on http://localhost:4848");
});
