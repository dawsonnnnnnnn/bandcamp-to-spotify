# Bandcamp to Spotify

Scrapes album listings from Bandcamp Daily curated pages (e.g. ["Best Experimental Music on Bandcamp: April 2026")](https://daily.bandcamp.com/best-experimental/the-best-experimental-music-on-bandcamp-april-2026) and outputs Spotify track links for each album found.

## Don't @ me, bro
- I didn't configure this app to write to Spotify because I especially love Spotify. Apple Music's developer tools are just not as friendly. Maybe in a future iteration of this tool...

## Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- A [Spotify Developer account](https://developer.spotify.com)
-   As of this writing, this using a Developer account is a Spotify Premium feature.

## Spotify Setup

Before running the app, create a Spotify Developer app:

1. Log in to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Under **APIs used**, check **Web API**
4. Add `http://127.0.0.1:8888/callback` as a **Redirect URI** and save
5. Go to **User Management** and add your Spotify account email
6. Copy your **Client ID** and **Client Secret**

## Installation

```
git clone https://github.com/dawsonnnnnnnn/bandcamp-to-spotify
cd bandcamp-to-spotify
npm install
```

## Configuration

Copy the example environment file and fill in your Spotify credentials:

```
cp .env.example .env
```

Open `.env` and add your values:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

## Usage

```
npm run scrape
```

A browser window will open to the Spotify login page. After you approve access, the terminal will print Spotify track links for each album found on the Bandcamp page.

## Notes

- The Bandcamp URL to scrape is currently hardcoded in `src/index.ts`. A future version may accept it as a command-line argument.
- Some albums may not be found on Spotify, particularly obscure or experimental releases.
- Playlist creation requires Spotify to approve your developer app for extended API access.
