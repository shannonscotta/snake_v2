import { useState, useEffect } from "react";
export default function ScoreBoard() {
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    "http://localhost:8000/scoreboard"
                );
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [data]);
    return data ? (
        data.map((entry) => (
            <p key={entry.id}>{entry.player + " : " + entry.score}</p>
        ))
    ) : (
        <p>Loading or there's an error...</p>
    );
}
