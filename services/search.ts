import Toast from "react-native-root-toast";
import { initDB } from "./database";

type Movie = {
    title: string,
}

function parseMovies(rows: unknown[]): Movie[] {
    return rows.map((row: any) => ({
        title: row.title,
    }))
}

export async function search(query: string) {
    if (query.length < 2) return [];
    const db = await initDB()
    try {
        const rows = db.getAllAsync(
            "SELECT DISTINCT title FROM files WHERE title LIKE ?",
            [`%${query.trim()}%`]
        )
        return parseMovies(await rows);
    }
    catch (error) {
        Toast.show("Error in loading results", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
    }
    
}