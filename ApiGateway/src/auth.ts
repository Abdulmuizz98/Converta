import express, { Request, Response } from "express";
import { firebase as admin } from "./lib/firebase";
import { generateApiKey } from "./utils";

const router = express.Router();

// async function setApiKeyForUser(userId: string, token: string) {
//     const endpoint = "http://localhost:3000/auth/set-api-key";
//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Include authentication token if required
//         },
//         body: JSON.stringify({ userId, service: "converta" }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to set API key");
//       }

//       console.log("API key set successfully");
//     } catch (error) {
//       console.error("Error setting API key:", error);
//     }
//   }

// Function to set API key as custom claim for a user
async function setApiKeyForUser(
  userId: string,
  service: string,
  apiKey: string
) {
  try {
    // Set custom claims for the user
    await admin.auth().setCustomUserClaims(userId, { [service]: { apiKey } });

    console.log(`API key ${apiKey} set for user ${userId}`);
  } catch (error) {
    console.error("Error setting custom claims:", error);
    throw error;
  }
}

router.post("/set-api-key", async (req: Request, res: Response) => {
  const { userId, service } = req.body;

  try {
    // Generate API key for the user
    const apiKey = await generateApiKey(userId);
    await setApiKeyForUser(userId, service, apiKey);

    res.status(200).json({ [service]: { apiKey } });
  } catch (error) {
    console.error("Error setting API key:", error);
    res.status(400).json({ error: "Failed to set API key" });
  }
});

router.post("/get-api-key", async (req: Request, res: Response) => {
  const { userId, service } = req.body;

  try {
    // Get user custom claims
    const claims = (await admin.auth().getUser(userId)).customClaims || {};
    const apikey = claims[service] || {};

    res.status(200).json({ [service]: apikey });
  } catch (error) {
    console.error("Error getting API key:", error);
    res.status(400).json({ error: "Failed to get API key" });
  }
});
// // Login route handler
// // router.post("/login", async (req: Request, res: Response) => {
// //   const { email, password } = req.body;

// //   try {
// //     // Authenticate user using Firebase Authentication
// //     const userCredential = await admin
// //       .auth()
// //       .signInWithEmailAndPassword(email, password);
// //     const user = userCredential.user;

// //     // Generate Firebase ID token for the authenticated user
// //     const idToken = await user.getIdToken();

// //     // Respond with the generated Firebase ID token
// //     res.status(200).json({ token: idToken });
// //   } catch (error) {
// //     console.error("Error logging in:", error);
// //     res.status(401).json({ error: "Unauthorized" });
// //   }
// // });

// // Register route handler
// // router.post("/register", async (req: Request, res: Response) => {
// //   const { email, password } = req.body;

// //   try {
// //     // Create a new user account using Firebase Authentication
// //     const userCredential = await admin.auth().createUser({
// //       email,
// //       password,
// //     });
// //     const user = userCredential.user;

// //     // Generate Firebase ID token for the newly created user
// //     const idToken = await user.getIdToken();

// //     // Respond with the generated Firebase ID token
// //     res.status(200).json({ token: idToken });
// //   } catch (error) {
// //     console.error("Error registering user:", error);
// //     res.status(400).json({ error: "Registration failed" });
// //   }
// // });

// // Login route handler
// router.post("/login", async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     // Authenticate user using Firebase Authentication
//     const userCredential = await admin
//       .auth()
//       .signInWithEmailAndPassword(email, password);
//     const user = userCredential.user;

//     // Get user custom claims (API key and expiry date)
//     const { apiKey, apiKeyExpiry } =
//       (await admin.auth().getUser(user.uid)).customClaims || {};

//     // Generate JWT token with user information, API key, and expiry date
//     const token = jwt.sign(
//       {
//         uid: user.uid,
//         email: user.email,
//         apiKey: apiKey,
//         apiKeyExpiry: apiKeyExpiry,
//         // Include other user information as needed
//       },
//       SECRET_KEY
//     );

//     // Respond with the JWT token
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(401).json({ error: "Unauthorized" });
//   }
// });

// // Register route handler (optional)
// router.post("/register", async (req: Request, res: Response) => {
//   const { username, email, password } = req.body;

//   try {
//     // Create a new user account using Firebase Authentication
//     const userCredential = await admin
//       .auth()
//       .createUser({ displayName: username, email, password });
//     const user = userCredential.user;

//     // Generate API key
//     const apiKey = generateApiKey();

//     // Calculate expiry date (30 days from now)
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + 30);

//     // Store API key and expiry date in Firebase Authentication custom claims
//     await admin.auth().setCustomUserClaims(user.uid, {
//       apiKey,
//       apiKeyExpiry: expiryDate.toISOString(),
//     });

//     // Generate JWT token with user information, API key, and expiry date
//     const token = jwt.sign(
//       {
//         uid: user.uid,
//         email: user.email,
//         apiKey: apiKey,
//         apiKeyExpiry: expiryDate.toISOString(),
//         // Include other user information as needed
//       },
//       SECRET_KEY
//     );
//     // Respond with the JWT token and API key
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(400).json({ error: `Registration failed: ${error}` });
//   }
// });
export default router;
