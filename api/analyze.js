import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
    });
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Use POST');
    const { imageBase64 } = req.body;

    try {
        // 1. Gemini Vision: Scan the whole squad at once
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const prompt = "List every DLS card name and rating in this image. Return ONLY JSON: [{n: 'Name', r: 99}]";
        
        const visionResult = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType: "image/png" } }
        ]);
        
        const players = JSON.parse(visionResult.response.text());

        // 2. Market Logic: Update each player found
        for (const player of players) {
            const docRef = db.collection("dlsvalueapi").doc(player.n);

            await db.runTransaction(async (t) => {
                const doc = await t.get(docRef);
                
                let totalPoints = player.r;
                let scanCount = 1;

                if (doc.exists) {
                    const data = doc.data();
                    totalPoints = (data.total_points || 0) + player.r;
                    scanCount = (data.scan_count || 0) + 1;
                }

                // MATH: (Total / Count) * Multiplier
                const avgRating = totalPoints / scanCount;
                let calculatedWorth = avgRating * 0.65; 

                // PRICE FLOOR: Never let legendary-tier cards go under $45.00
                const finalWorth = Math.max(calculatedWorth, 45.00).toFixed(2);

                t.set(docRef, {
                    total_points: totalPoints,
                    scan_count: scanCount,
                    avg_rating: avgRating.toFixed(1),
                    current_worth: finalWorth,
                    last_update: new Date().toISOString()
                }, { merge: true });
            });
        }

        res.status(200).json({ success: true, count: players.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
