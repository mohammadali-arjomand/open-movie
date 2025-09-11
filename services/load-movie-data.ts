import Toast from "react-native-root-toast";
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

type FullRow = {
    quality: string,
    language: string,
    url: string,
    title: string,
    season: string,
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

function parseQualities(rows: unknown[]): Quality[] {
    return rows.map((row: any) => ({
        quality: row.quality,
        language: row.language,
        url: row.url,
    }))
}

function parseFullRow(rows: unknown[]): FullRow[] {
    return rows.map((row: any) => ({
        quality: row.quality,
        language: row.language,
        url: row.url,
        episode: row.episode,
        season: row.season,
        title: row.title
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
        Toast.show("Error in loading seasons", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
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
        Toast.show("Error in loading episodes", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
        return []
    }
}

async function loadQualities(title: string, season: string, episode: string) {
    const db = await initDB()
    try {
        const rows = await db.getAllAsync(
            "SELECT DISTINCT quality, language, url FROM files WHERE title LIKE ? AND season = ? AND episode = ? AND format = 'video'",
            [`%${title}%`, +(season) as number, +(episode) as number]
        )
        
        return parseQualities(rows)
    }
    catch (error) {
        Toast.show("Error in loading qualities", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
        return []
    }
}

async function loadQualityByUrl(url:string) {
    const db = await initDB()
    try {
        const row = await db.getAllAsync(
            "SELECT * FROM files WHERE url=? LIMIT 1",
            [url]
        )
        
        return parseFullRow(row)[0]
    }
    catch (error) {
        Toast.show("Error in loading full row by url", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
        return parseFullRow([])[0]
    }
}

export { loadEpisodes, loadQualities, loadQualityByUrl, loadSeasons };

