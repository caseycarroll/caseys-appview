import { NodeOAuthClient, buildAtprotoLoopbackClientMetadata } from '@atproto/oauth-client-node'
import type { NodeSavedSession, NodeSavedState } from '@atproto/oauth-client-node'
import { SCOPE } from '../consts'

const stateStore = new Map<string, NodeSavedState>()
const sessionStore = new Map<string, NodeSavedSession>()

let oauthClient: NodeOAuthClient | null = null;

export async function getOAuthClient() {
  if(oauthClient) return oauthClient;

  oauthClient = new NodeOAuthClient({
    clientMetadata: buildAtprotoLoopbackClientMetadata({
      scope: SCOPE,
      redirect_uris: ['http://127.0.0.1:3000/oauth/callback'],
    }),
    stateStore: {
      async get(key: string) { return stateStore.get(key) },
      async set(key: string, value: NodeSavedState) { stateStore.set(key, value) },
      async del(key: string) { stateStore.delete(key) },
    },
    sessionStore: {
      async get(key: string) { return sessionStore.get(key) },
      async set(key: string, value: NodeSavedSession) { sessionStore.set(key, value) },
      async del(key: string) { sessionStore.delete(key) },
    },
  })

  return oauthClient;
}