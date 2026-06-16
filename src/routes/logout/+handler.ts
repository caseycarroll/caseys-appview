import { getOAuthClient } from "../../auth/client";
import { getDid } from "../../auth/session";

export const GET: MarkoRun.Handler = async (context, next) => {
    try {
        const cookie = context.request.headers.get("cookie");
        if(!cookie) return;
    
        const did = getDid(cookie);
        console.log(did)
        if(did) {
            const client = await getOAuthClient();
            await client.revoke(did);
        }
    } catch(error) {
        console.error("logout error", error);
    }

    const response = await next();
    response.headers.append(
        "Set-Cookie",
        "did=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
    return response;
};
