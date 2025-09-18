import DropOption from "@/components/DropOption"
import { useThemeColor } from "@/hooks/useThemeColor"
import { activeDbName } from "@/services/database"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getDocumentAsync } from 'expo-document-picker'
import { copyAsync, deleteAsync, documentDirectory, getInfoAsync, makeDirectoryAsync } from "expo-file-system/legacy"
import { router, Stack } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Toast from "react-native-root-toast"

export default function databasesSettings() {

    const [fullDb, setFullDb] = useState<boolean>(false)
    const [imdb, setImdb] = useState<string>("yes")

    activeDbName().then(dbName => setFullDb(dbName == "movies.db"))

    const styles = StyleSheet.create({
        warnText: {
            padding: 8,
            fontSize: 20,
            color: useThemeColor("warning"),
        },
        successText: {
            padding: 8,
            fontSize: 20,
            color: useThemeColor("success")
        },
        importBtn: {
            backgroundColor: useThemeColor("primary"),
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
        },
        container: {
            backgroundColor: useThemeColor("background")
        },
        header: {
            backgroundColor: useThemeColor("background2"),
        }
    })

    const importDatabase = async () => {
        AsyncStorage.setItem("remove-help", "true")
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
                Toast.show("New database imported successfully!", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
                router.back()
            }
            else {
                Toast.show("Error in loading database", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
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
                                Toast.show("Imported database removed successfully", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
                                router.back()
                            }
                            else {
                                Toast.show("Database not found!", {duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM})
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

    useEffect(() => {
        AsyncStorage.getItem("imdb").then(value => {
            if (value !== null) {
                setImdb(value as string)
            }
        })
    }, [])

    const changeImdbState = (value: string) => {
        setImdb(value)
        AsyncStorage.setItem("imdb", value)
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{headerTitle:"Databases", headerBackTitle: "Settings", headerStyle: styles.header, headerTintColor: useThemeColor("text")}}/>
            <DropOption
                label="Connect to IMDb"
                options={[{label: "Yes", value: "yes"}, {label: "No", value: "no"}]}
                value={imdb}
                onSelect={changeImdbState}
            />
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