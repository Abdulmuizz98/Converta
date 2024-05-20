import { firebase as admin } from "./lib/firebase";
import * as crypto from "crypto";

// Function to generate longer API key with expiration
export const generateApiKey = async (uid: string) => {
  const keyObj = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const jwk = await crypto.subtle.exportKey("jwk", keyObj);
  return `${uid}::${jwk.k}`;
};

// Function to verify API key against user's custom claims
export async function verifyApiKey(apiKeyHeader: string, apiService: string) {
  try {
    const regex = /^Bearer\s+(.*)$/;
    const match: RegExpExecArray | null = regex.exec(apiKeyHeader);
    if (!match) {
      return null;
    }
    const apiKey = match[1];
    const uid = apiKey.split("::")[0];

    // Fetch user by UID (assuming API key is stored as a custom claim)
    const userRecord = await admin.auth().getUser(uid);
    const customClaims = userRecord.customClaims || {};
    const service = customClaims[apiService] || {};

    // Check if the custom claims contain the provided API key
    return Object.keys(service).length > 0 && service.apiKey === apiKey
      ? userRecord
      : null;
  } catch (error) {
    console.error("Error verifying API key:", error);
    return null; // Return false if there's an error or if API key doesn't match
  }
}
