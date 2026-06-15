import { getOAuthClient } from "./client";

export async function getSession(cookie: string | null) {
    if(!cookie) return null;
    
    const did = getDid(cookie);
    if(!did) return null;
    
    try {
        const client = await getOAuthClient();
        return await client.restore(did)
    } catch {
        return null;
    }
}

export function getDid(cookie: string) {
    const keyVals = cookie.split('; ');
    const did = keyVals.find(keyVal => keyVal.startsWith('did='))?.split("=")[1]
    return did;
}