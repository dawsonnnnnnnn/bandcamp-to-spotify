import axios from 'axios';
import * as cheerio from 'cheerio';

const PAGE_URL = 'https://daily.bandcamp.com/best-experimental/the-best-experimental-music-on-bandcamp-january-2026';

async function scrape() {
    const { data } = await axios.get(PAGE_URL);
    const $ = cheerio.load(data);

    $('a.mptralbum').each((_, el) => {
        const albumTitle = $(el).text().trim();
        const artistName = $(el).siblings('a.mpartist').text().trim();
        console.log(`Artist: ${artistName}`);
        console.log(`Album:  ${albumTitle}`);
        console.log('---');
    });
}

scrape();
