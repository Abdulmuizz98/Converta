import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response, NextFunction } from "express";
import axios, { AxiosError } from "axios";
import { firebase as admin } from "./lib/firebase";
import { verifyApiKey } from "./utils";
import authRoutes from "./auth";
import cors from "cors";
import bodyParser from "body-parser";

console.log("PORT: ", process.env.PORT);

const app: Express = express();
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());
// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

export const SECRET_KEY = "your-secret-key"; // Change this to your secret key

interface CustomRequest extends Request {
  user?: any;
}

// Middleware to verify Firebase ID token or API key and fetch user profile
async function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  console.log("Tried to authenticate...");

  const idToken = req.headers["authorization"]?.split("Bearer ")[1];
  const apiKey = req.headers["x-api-key"] as string;
  const apiService = req.headers["x-api-service"] as string;

  if (!idToken && !apiKey) {
    return res.status(401).json({
      error:
        "Unauthorized: Authorization header with Bearer token or X-API-KEY header is required",
    });
  }

  try {
    let userProfile = null;
    if (idToken) {
      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userProfile = await admin.auth().getUser(decodedToken.uid); // Fetch full user profile
    } else {
      // Verify API key
      userProfile = await verifyApiKey(apiKey, apiService);

      if (!userProfile) {
        return res.status(403).json({ error: "Forbidden: Invalid API key" });
      }
    }

    req.user = userProfile; // Attach full user profile to request object
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid token or API key" });
  }
}

app.use("/auth", authenticateToken, authRoutes);

// Define middleware to route requests
app.use(
  "/converta",
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    console.log("Tried to forward...");

    try {
      let url =
        process.env.API_ENDPOINT + req.originalUrl.replace("/converta", "");

      if (
        req.originalUrl.match(/\/api\/metaevent/i) &&
        req.method === "POST" &&
        req.user &&
        req.user.uid
      )
        url += `&userId=${req.user.uid}`;

      console.log(url);

      // Make a GET request to backend service 1
      const response = await axios({
        url,
        method: req.method as any,
        data: req.body,
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers["authorization"], // Pass along the authorization header
        },
      });
      res.send(response.data); // Forward the response from backend service 1
    } catch (error: any) {
      console.log(error);
      res
        .status(error.response?.status || 400)
        .send(error.message || "Internal Server Error");
    }
  }
);

// Handle requests to unknown paths
app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
