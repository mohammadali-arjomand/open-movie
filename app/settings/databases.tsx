import { activeDbName } from "@/services/database"
import { getDocumentAsync } from 'expo-document-picker'
import { copyAsync, deleteAsync, documentDirectory, getInfoAsync, makeDirectoryAsync } from "expo-file-system"
import { router, Stack } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function databasesSettings() {

    const [fullDb, setFullDb] = useState<boolean>(false)

    activeDbName().then(dbName => setFullDb(dbName == "movies.db"))

    const importDatabase = async () => {
        try {
            const result = await getDocumentAsync({
                type: ['application/octet-stream', 'application/x-sqlite3', '*/*'],
                copyToCacheDirectory: true,
            })
            if (!result.canceled) {
                const dbName = "movies.db"
                const dbDir = documentDirectory + "SQLite/"
                const dbPath = dbDir + dbName
                await makeDirectoryAsync(dbDir, {intermediates: true})

                await copyAsync({
                    from: result.assets[0].uri,
                    to: dbPath
                })
                Alert.alert("Imported!", "New database imported successfully!")
                router.back()
            }
            else {
                Alert.alert("Error", "Error in loading database")
            }
        }
        catch (err) {
            console.error(err);
            
        }
    }

    const removeDatabase = () => {
        Alert.alert(
            'Confirm Remove',
            'Are you sure that you want to remove your imported database? after removing this database, default database activates',
            [
                {
                    text: "Cancel",
                    style: 'cancel'
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const dbName = "movies.db"
                            const dbDir = documentDirectory + "SQLite/"
                            const dbPath = dbDir + dbName
                            const fileInfo = await getInfoAsync(dbPath)
                            if (fileInfo.exists) {
                                await deleteAsync(dbPath)
                                Alert.alert("Removed", "Imported database removed successfully")
                                router.back()
                            }
                            else {
                                Alert.alert("Not Found", "Database not found!")
                            }
                        }
                        catch (err) {
                            console.error(err);
                        }
                    }
                }
            ]
        )
    }


    return (
        <ScrollView>
            <Stack.Screen options={{headerTitle:"Databases"}}/>
            {!fullDb ?
            <View>
                <Text style={styles.warnText}>WARNING: You're using demo edition of database! Please import full edition</Text>
                <TouchableOpacity onPress={importDatabase}>
                    <Text style={styles.importBtn}>Import Full Movies Database</Text>
                </TouchableOpacity>
            </View>
            :
            <View>
                <Text style={styles.successText}>Congratulations! You're using your imported database! You can remove it, if you want</Text>
                <TouchableOpacity onPress={removeDatabase}>
                    <Text style={styles.removeBtn}>Remove Imported Database</Text>
                </TouchableOpacity>
            </View>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    warnText: {
        padding: 8,
        fontSize: 20,
        color: '#ffb300ff'
    },
    successText: {
        padding: 8,
        fontSize: 20,
        color: '#1a8f00ff'
    },
    importBtn: {
        backgroundColor: "#007BFF",
        color: 'white',
        padding: 8,
        fontSize: 20,
        borderRadius: 8,
        margin: 10,
        textAlign: 'center'
    },
    removeBtn: {
        backgroundColor: "#ff0000ff",
        color: 'white',
        padding: 8,
        fontSize: 20,
        borderRadius: 8,
        margin: 10,
        textAlign: 'center'
    }
})