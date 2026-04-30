import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { authenticate } from './auth';
import { searchAlbumTrack } from './spotify';

const PAGE_URL = 'https://daily.bandcamp.com/best-experimental/the-best-experimental-music-on-bandcamp-january-2026';

async function scrape() {
    const { data } = await axios.get(PAGE_URL);
    const $ = cheerio.load(data);

    const pageTitle = $('h1').first().text().trim();

    const albums: string[] = [];

    $('a.mptralbum').each((_, el) => {
        albums.push($(el).text().trim());
    });

    return { pageTitle, albums };
}

async function main() {
    const token = await authenticate();
    console.log('Logged in to Spotify successfully.');

    const { pageTitle, albums } = await scrape();
    console.log(`Found ${albums.length} albums on "${pageTitle}".`);

    const results = await Promise.all(
        albums.map(album => searchAlbumTrack(token, album).then(uri => ({ album, uri })))
    );

    const trackUris: string[] = [];
    for (const { album, uri } of results) {
        if (uri) {
            trackUris.push(uri);
            console.log(`  Found: ${album}`);
        } else {
            console.log(`  Not found on Spotify: ${album}`);
        }
    }

    console.log(`\nFound ${trackUris.length} tracks. Add these to a Spotify playlist manually:`);
    trackUris.forEach(uri => {
        const trackId = uri.split(':')[2];
        console.log(`  https://open.spotify.com/track/${trackId}`);
    });
}

main();
