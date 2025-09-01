import { initDB } from "./database";


type Season = {
    season: string,
}


type Episode = {
    episode: string,
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
export { loadEpisodes, loadSeasons };

