import { useState, useEffect } from "react";
export default function ScoreBoard() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch("http://localhost:8000/scoreboard")
            .then((response) => response.json())
            .then((jsonData) => {
                setData(jsonData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    return data
        ? data.map((entry) => (
              <p key={entry.id}>{entry.player + " : " + entry.score}</p>
          ))
        : null;
}
