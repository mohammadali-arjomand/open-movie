import { Asset } from "expo-asset";
import { copyAsync, documentDirectory, getInfoAsync, makeDirectoryAsync } from "expo-file-system/legacy";
// import { File, Paths, D } from 'expo-file-system';
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

async function activeDbName(): Promise<string> {
    const fileInfo = await getInfoAsync(documentDirectory + "SQLite/movies.db")
    if (fileInfo.exists) {
        return "movies.db"
    }
    return "movies-mini.db"
}

let db: SQLiteDatabase | null = null;
let currentDbName: string | null = null;

async function initDB() {
    const dbName = "movies-mini.db"
    const dbDir = documentDirectory + "SQLite/"
    const dbPath = dbDir + dbName

    const fileInfo = await getInfoAsync(dbPath)
    if (!fileInfo.exists) {
        const asset = Asset.fromModule(require("../assets/databases/" + dbName));
        await asset.downloadAsync();
        await makeDirectoryAsync(dbDir, { intermediates: true });
        await copyAsync({
            from: asset.localUri!,
            to: dbPath,
        })
    }
    if (db != null && currentDbName == await activeDbName()) {
        return db
    }
    else {
        currentDbName = await activeDbName()
    }
    if (await activeDbName() == "movies-mini.db") {
        db = await openDatabaseAsync(dbName)
        console.log("Connecting to database...");
        
    }
    else {
        db = await openDatabaseAsync(await activeDbName())
        console.log("Connecting to database...");
    }
    return db;
}

export { activeDbName, initDB };

