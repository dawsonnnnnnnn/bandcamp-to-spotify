import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

function headers(token: string) {
    return { Authorization: `Bearer ${token}` };
}

export async function searchAlbumTrack(token: string, albumTitle: string): Promise<string | null> {
    const response = await axios.get(`${BASE_URL}/search`, {
        headers: headers(token),
        params: {
            q: `album:${albumTitle}`,
            type: 'track',
            limit: 1,
        },
    });

    const tracks = response.data.tracks.items;
    if (tracks.length === 0) return null;

    return tracks[0].uri;
}
