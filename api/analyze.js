import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";

// 1. Initialize Firebase (Check if already initialized to prevent errors)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: "https://dls-value-api.firebaseio.com"
    });
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    const { imageBase64 } = req.body; // Image sent from your frontend

    try {
        // 2. Multimodal AI Analysis (Gemini 2.5 Flash-Lite)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const prompt = "Analyze this DLS 26 card. Extract: Player Name, Overall Rating, and Card Type (Legendary/Rare). Return as JSON.";
        
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: "image/png" } }
        ]);

        const cardData = JSON.parse(result.response.text());

        // 3. Save "Learned" Data to Firebase
        await db.collection("dlsvalueapi").doc(cardData.name).set({
            rating: cardData.rating,
            type: cardData.type,
            lastSeen: new Date().toISOString(),
            source: "AI_VISION"
        }, { merge: true });

        res.status(200).json({ message: "Card analyzed and saved!", data: cardData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
