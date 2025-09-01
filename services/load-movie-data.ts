import { initDB } from "./database";


type Season = {
    season: string,
}


type Episode = {
    episode: string,
}

type Quality = {
    quality: string,
    language: string,
    url: string,
}


function parseSeasons(rows: unknown[]): Season[] {
    return rows.map((row: any) => ({
        season: row.season,
    }))
}


function parseEpisodes(rows: unknown[]): Episode[] {
    return rows.map((row: any) => ({
        episode: row.episode,
    }))
}

function parseQualities(rows: unknown[]): Quality[] {
    return rows.map((row: any) => ({
        quality: row.quality,
        language: row.language,
        url: row.url,
    }))
}

async function loadSeasons(title: string) {
    const db = await initDB()
    try {
        const rows = await db.getAllAsync(
            "SELECT DISTINCT season FROM files WHERE title LIKE ?",
            [`%${title}%`]
        )
        
        return parseSeasons(rows);
    }
    catch (error) {
        alert("Error in loading seasons")
        return []
    }
    
}

async function loadEpisodes(title: string, season: string) {
    const db = await initDB()
    try {
        const rows = await db.getAllAsync(
            "SELECT DISTINCT episode FROM files WHERE title LIKE ? AND season = ?",
            [`%${title}%`, +(season) as number]
        )
        
        return parseEpisodes(rows);
    }
    catch (error) {
        alert("Error in loading episodes")
        return []
    }
}

async function loadQualities(title: string, season: string, episode: string) {
    console.log(`looking for ${title} season ${season} episode ${episode}`);
    
    const db = await initDB()
    try {
        const rows = await db.getAllAsync(
            "SELECT DISTINCT quality, language, url FROM files WHERE title LIKE ? AND season = ? AND episode = ? AND format = 'video'",
            [`%${title}%`, +(season) as number, +(episode) as number]
        )
        
        return parseQualities(rows)
    }
    catch (error) {
        alert("Error in loading qualities")
        return []
    }
}

export { loadEpisodes, loadQualities, loadSeasons };

