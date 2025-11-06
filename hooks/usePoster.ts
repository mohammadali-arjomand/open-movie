import { extractPoster } from "@/services/imdb-poster"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

let promises = new Map<string, Promise<any>>()

export default function usePoster(name: string, force: boolean = false) {
    const [imageUrl, setImageUrl] = useState<string>("https://s34.picofile.com/file/8486872134/poster_placeholder.png")
    const [score, setScore] = useState<string>("?")
    const [genres, setGenres] = useState<string>("")
    const [id, setId] = useState<string>("")

    const loadData = () => {
        AsyncStorage.getItem("imdb").then(value => {
            if (value === "no" && !force) return
            if (!promises.has(name)) {
                promises.set(name, extractPoster(name))
                console.log("Loading " + name + " from IMDb ...");
            }
            promises.get(name)?.then(data => {
                AsyncStorage.setItem(`poster-${btoa(name)}`, data.image as string || "https://s34.picofile.com/file/8486872134/poster_placeholder.png")
                setImageUrl(data.image as string || "https://s34.picofile.com/file/8486872134/poster_placeholder.png")
                const scoreRegex = /\d\.\d/
                const imdbScore = scoreRegex.exec(data.description as string)?.[0]
                AsyncStorage.setItem(`score-${btoa(name)}`, imdbScore as string || "?")
                setScore(imdbScore as string || "?")
                AsyncStorage.setItem(`genres-${btoa(name)}`, data.description?.split("|")[1].trim() as string || "")
                setGenres(data.description?.split("|")[1].trim() as string || "")
                AsyncStorage.setItem(`imdb-id-${btoa(name)}`, data.id as string || "")
                setId(data.id as string || "")
            })
        })
    }

    useEffect(() => {
        AsyncStorage.getItem(`poster-${btoa(name)}`).then(value => {
            if (value !== null) {
                setImageUrl(value)
            }
            else {
                loadData()
            }
        })
        AsyncStorage.getItem(`score-${btoa(name)}`).then(value => {
            if (value !== null) {
                setScore(value)
            }
            else {
                loadData()
            }
        })
        AsyncStorage.getItem(`genres-${btoa(name)}`).then(value => {
            if (value !== null) {
                setGenres(value)
            }
            else {
                loadData()
            }
        })
        AsyncStorage.getItem(`imdb-id-${btoa(name)}`).then(value => {
            if (value !== null) {
                setId(value)
            }
            else {
                loadData()
            }
        })
    }, [force])

    return {imageUrl, score, genres, id}
}
