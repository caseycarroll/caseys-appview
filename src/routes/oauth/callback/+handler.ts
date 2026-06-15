import { getOAuthClient } from "../../../auth/client";
const PUBLIC_URL = process.env.PUBLIC_URL || "http://127.0.0.1:3000";

export const GET: MarkoRun.Handler = async (context, next) => {
    try {
        const url = new URL(context.request.url);
        const searchParams = url.searchParams;

        const client = await getOAuthClient();
        const { session } = await client.callback(searchParams);

        const isProd = process.env.NODE_ENV === "production";

        const headers = new Headers({
            Location: new URL("/", PUBLIC_URL).toString(),
        });
        headers.append(
            "Set-Cookie",
            `did=${session.did}; HttpOnly; ${isProd ? "Secure;" : ""} SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Path=/`
        );

        return new Response(null, {
            status: 302,
            headers,
        });
    } catch (error) {
        console.error("OAuth callback error:", error);

        // Error redirect using standard response headers
        return new Response(null, {
            status: 302,
            headers: {
                Location: new URL("/?error=login_failed", PUBLIC_URL).toString(),
            },
        });
    }
};