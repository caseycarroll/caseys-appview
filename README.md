# Casey's App View
Simplistic app view that render's a bsky profile's main timeline. Opening a post triggers a View Transition to the post page and renders the post's thread.  

## Overview

This project is powered by [@marko/run](https://github.com/marko-js/run).

- Run `npm run dev` to start the development server
- Run `npm run build` to build a production-ready node.js server
- Run `npm run preview` to run the production server

## Todo
 - external links (medium)
 - replies (medium)
 - link to post page (low)
 - render thread on post page (low)
 - view transition to post page (medium)
    - shared element transition with avatar, name and post text (medium)
- production support oauth callback
- DB for session mgmt (high)
- ~~proper logout flow~~
