import { useState } from "react";
import { createShortUrl } from "./services/api";

function App() {
    const [url, setUrl] = useState("");
    const [expiration, setExpiration] = useState("never");

    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const generateIdempotencyKey = () => {
        return crypto.randomUUID();
    };

    const calculateExpiration = () => {
        if (expiration === "never") {
            return null;
        }

        const now = new Date();

        switch (expiration) {
            case "1h":
                now.setHours(now.getHours() + 1);
                break;

            case "24h":
                now.setHours(now.getHours() + 24);
                break;

            case "7d":
                now.setDate(now.getDate() + 7);
                break;

            default:
                return null;
        }

        return now.toISOString().slice(0, 19);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setShortUrl("");
        setCopied(false);

        if (!url.trim()) {
            setError("Please enter a URL.");
            return;
        }

        setLoading(true);

        try {
            const expiresAt = calculateExpiration();

            const idempotencyKey = generateIdempotencyKey();

            const response = await createShortUrl(
                url.trim(),
                expiresAt,
                idempotencyKey
            );

            setShortUrl(response.shortUrl);

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to create short URL. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="app">

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            {/* HEADER */}

            <header className="header">

                <div className="logo">
                    <span className="logo-mark">
                        S
                    </span>

                    <span>
                        SnapURL
                    </span>
                </div>

                <span className="badge">
                    URL SHORTENER
                </span>

            </header>


            {/* MAIN */}

            <main className="main">

                <section className="hero">

                    <div className="eyebrow">
                        SIMPLE. FAST. RELIABLE.
                    </div>

                    <h1>
                        Turn long URLs into
                        <span> short links.</span>
                    </h1>

                    <p>
                        Create clean, shareable links in seconds.
                        No unnecessary complexity.
                    </p>

                </section>


                {/* URL FORM */}

                <section className="card">

                    <form onSubmit={handleSubmit}>

                        <label htmlFor="url">
                            YOUR LONG URL
                        </label>

                        <div className="input-wrapper">

                            <input
                                id="url"
                                type="url"
                                placeholder="https://example.com/your/very/long/url"
                                value={url}
                                onChange={(e) =>
                                    setUrl(e.target.value)
                                }
                                disabled={loading}
                            />

                        </div>


                        <label htmlFor="expiration">
                            EXPIRATION
                        </label>

                        <select
                            id="expiration"
                            value={expiration}
                            onChange={(e) =>
                                setExpiration(e.target.value)
                            }
                            disabled={loading}
                        >

                            <option value="never">
                                Never
                            </option>

                            <option value="1h">
                                1 hour
                            </option>

                            <option value="24h">
                                24 hours
                            </option>

                            <option value="7d">
                                7 days
                            </option>

                        </select>


                        {error && (
                            <div className="error">
                                {error}
                            </div>
                        )}


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "CREATING..."
                                : "SHORTEN URL"}

                            {!loading && (
                                <span>
                                    →
                                </span>
                            )}

                        </button>

                    </form>


                    {/* RESULT */}

                    {shortUrl && (

                        <div className="result">

                            <div className="result-label">
                                YOUR SHORT URL
                            </div>

                            <div className="result-row">

                                <a
                                    href={shortUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {shortUrl}
                                </a>

                                <button
                                    className="copy-button"
                                    onClick={copyUrl}
                                >
                                    {copied
                                        ? "COPIED!"
                                        : "COPY"}
                                </button>

                            </div>

                        </div>

                    )}

                </section>

            </main>


            {/* FOOTER */}

            <footer>

                <span>
                    Built with Spring Boot + React
                </span>

                <span>
                    © 2026 SnapURL
                </span>

            </footer>

        </div>
    );
}

export default App;