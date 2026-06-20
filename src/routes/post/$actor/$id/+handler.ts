import { Agent, AppBskyFeedDefs } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client-node";

async function getPostThread(
    session: OAuthSession,
    params: MarkoRun.Context["params"],
) {
    const agent = new Agent(session);

    const res = await agent.getPostThread({
        uri: `at://${params.actor}/app.bsky.feed.post/${params.id}`,
    });
    const { thread } = res.data;
    if (AppBskyFeedDefs.isThreadViewPost(thread)) {
        return thread;
    }
}

export const GET: MarkoRun.Handler = async (context) => {
    if(!context.session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const postThread = await getPostThread(context.session, context.params);
    if(!postThread) {
        return new Response("Failed to load post thread", { status: 500 })
    }
    
    context.thread = postThread;
}