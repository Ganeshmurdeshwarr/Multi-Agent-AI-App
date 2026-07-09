import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "../multi-agent-ai-d04b1-firebase-adminsdk-fbsvc-cccf164231.json" with { type: "json" };

export const app = initializeApp({
  credential: cert(serviceAccount)
});
