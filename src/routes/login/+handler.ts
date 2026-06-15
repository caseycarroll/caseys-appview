import { getOAuthClient } from "../../auth/client";
import { SCOPE } from "../../consts";

export const POST: MarkoRun.Handler = async (context, next) => {
    try {
        const formData = await context.request.formData();
        const handle = formData.get('login');
        console.log(handle)
        if(!handle || typeof handle !== "string") {
            return new Response(
                JSON.stringify({ error: "handle required"}), 
                { status: 400, headers: { "Content-Type": "application/json"}}
            )
        }
    
        const client = await getOAuthClient();
        const authUrl = await client.authorize(handle, {
            scope: SCOPE
        });
    
        return context.redirect(authUrl.toString())
    } catch(error) {
        console.error(error);
    }
}