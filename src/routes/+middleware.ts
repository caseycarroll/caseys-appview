import type { OAuthSession } from "@atproto/oauth-client-node";
import { getSession } from "../auth/session";
import type { AppBskyFeedDefs } from "@atproto/api";

declare module "@marko/run" {
  interface Context {
    session: OAuthSession | null;
    thread: AppBskyFeedDefs.ThreadViewPost
  }
}

const middleware = (async (context, next) => {
    if(context.request.url.includes("/login")) {
        return next();
    }

    const cookie = context.request.headers.get("cookie");
    const session = await getSession(cookie)
    context.session = session;
    return await next();
    
}) satisfies MarkoRun.Handler

export default middleware;