// api/prices.js
export default function handler(req, res) {
    const marketData = [
        { name: "Maxed Mbappe", fc24_rating: 91, base_worth: 50.00 },
        { name: "Maxed Haaland", fc24_rating: 91, base_worth: 48.50 },
        { name: "Maxed Bellingham", fc24_rating: 86, base_worth: 35.00 },
        { name: "Maxed Messi", fc24_rating: 90, base_worth: 75.00 } // Rarity premium
    ];

    // Simulate a "Live" market shift based on real-world hype
    const liveData = marketData.map(p => {
        const fluctuation = (Math.random() * 2) - 1; // Real-time wiggle
        return {
            ...p,
            current_worth: (p.base_worth + fluctuation).toFixed(2),
            trend: fluctuation >= 0 ? `+${Math.abs(fluctuation).toFixed(1)}%` : `-${Math.abs(fluctuation).toFixed(1)}%`
        };
    });

    res.status(200).json(liveData);
}
