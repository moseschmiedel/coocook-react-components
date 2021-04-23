import React, { useState, useEffect } from "react";
import "./App.css";

interface AppProps {}

function App({}: AppProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), 1000);
        return () => clearTimeout(timer);
    }, [count, setCount]);

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Page has been open for <code>{count}</code> seconds.
                </p>
                <p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </p>
            </header>
        </div>
    );
}

export default App;
