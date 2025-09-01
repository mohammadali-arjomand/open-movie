import { Asset } from "expo-asset";
import { copyAsync, documentDirectory, getInfoAsync, makeDirectoryAsync } from "expo-file-system";
import { openDatabaseAsync } from "expo-sqlite";

async function initDB() {
    const dbName = "movies-mini.db";
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
    const db = await openDatabaseAsync(dbName);
    return db;
}

export { initDB };
