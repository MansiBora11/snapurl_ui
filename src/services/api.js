const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function createShortUrl(url, expiresAt, idempotencyKey) {
    const response = await fetch(`${API_BASE_URL}/api/urls`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
            url,
            expiresAt: expiresAt || null,
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Failed to create short URL"
        );
    }

    return data;
}