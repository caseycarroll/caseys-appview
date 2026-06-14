import http from 'node:http'
import { NodeOAuthClient, buildAtprotoLoopbackClientMetadata } from '@atproto/oauth-client-node'
import type { NodeSavedSession, NodeSavedState } from '@atproto/oauth-client-node'
import { Client } from '@atproto/lex'
import { Agent } from '@atproto/api'
import open from 'open'
import * as app from './lexicons/app.js'

const SCOPE = 'atproto rpc:app.bsky.feed.getTimeline?aud=did:web:api.bsky.app#bsky_appview'

const stateStore = new Map<string, NodeSavedState>()
const sessionStore = new Map<string, NodeSavedSession>()

const oauthClient = new NodeOAuthClient({
  clientMetadata: buildAtprotoLoopbackClientMetadata({
    scope: SCOPE,
    redirect_uris: ['http://127.0.0.1:3000/callback'],
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

async function login(handle: string) {
  // Start the OAuth flow — this resolves the handle, finds their auth
  // server (PDS), and returns a URL to redirect the user to
  const authUrl = await oauthClient.authorize(handle, { scope: SCOPE })

  // Wait for the callback from the authorization server
  const params = await new Promise<URLSearchParams>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url!, 'http://127.0.0.1:3000')
      if (url.pathname === '/callback') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<h1>Authorized! You can close this tab.</h1>')
        resolve(url.searchParams)
        server.close()
      }
    })
    server.listen(3000, '127.0.0.1', () => {
      console.log('Listening on http://127.0.0.1:3000/callback for OAuth redirect...')
      open(authUrl.toString())
    })
    server.on('error', reject)
  })

  // Exchange the authorization code for a session
  const { session } = await oauthClient.callback(params)
  return session
}

async function main() {
  const handle = process.argv[2]
  if (!handle) {
    console.error('Usage: npx tsx src/index.ts <your-handle>')
    process.exit(1)
  }

  console.log(`Logging in as ${handle}...`)
  const session = await login(handle)
  console.log(`Logged in! DID: ${session.did}`)

  // Create a lex Client with the authenticated session
  const client = new Client(session)

  // Fetch the user's profile
  const profile = await client.get(app.bsky.actor.profile, {
    repo: session.did,
  })

  console.log('\nProfile:')
  console.log(`  Handle: ${handle}`)
  console.log(`  DID: ${session.did}`)
  console.log(`  Display name: ${profile.value?.displayName ?? '(not set)'}`)
  console.log(`  Description: ${profile.value?.description ?? '(not set)'}`)
  
  const agent = new Agent(session);
  const timeline = await agent.getTimeline({ limit: 20 })
  const timelineData = await timeline.data

  console.log(JSON.stringify(timelineData))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
