import { getOAuthClient } from "../../auth/client";
import { getDid } from "../../auth/session";

export const POST: MarkoRun.Handler = async (context, next) => {
    try {
        const cookie = context.request.headers.get("cookie");
        if(!cookie) return;
    
        const did = getDid(cookie);
        if(did) {
            const client = await getOAuthClient();
            await client.revoke(did);
        }
    
        context.request.headers.delete("cookie");
        return await next();
    } catch(error) {
        console.error("logout error", error);
        context.request.headers.delete("cookie");
    }
};
