import express from 'express';
import axios from 'axios';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'playlist-modify-public playlist-modify-private';

export async function authenticate(): Promise<string> {
    const authUrl =
        `https://accounts.spotify.com/authorize` +
        `?client_id=${CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(SCOPES)}` +
        `&show_dialog=true`;

    console.log('Opening Spotify login in your browser...');
    console.log('If it does not open automatically, paste this URL into your browser:');
    console.log(authUrl);

    const { default: open } = await import('open');
    await open(authUrl);

    return new Promise((resolve, reject) => {
        const app = express();
        const server = app.listen(PORT);

        app.get('/callback', async (req, res) => {
            const code = req.query.code as string;

            if (!code) {
                res.send('Login failed: no authorization code received.');
                server.close();
                reject(new Error('No authorization code received'));
                return;
            }

            try {
                const response = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: REDIRECT_URI,
                    }),
                    {
                        headers: {
                            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                res.send('Login successful! You can close this tab and return to your terminal.');
                resolve(response.data.access_token);
            } catch (error) {
                res.send('Login failed. Check your terminal for details.');
                reject(error);
            } finally {
                server.close();
            }
        });
    });
}
