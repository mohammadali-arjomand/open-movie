import { extractPoster } from "@/services/imdb-poster"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

export default function usePoster(name: string) {
    const [imageUrl, setImageUrl] = useState<string>("https://s34.picofile.com/file/8486872134/poster_placeholder.png")
    const [score, setScore] = useState<string>("0")
    const [genres, setGenres] = useState<string>("")
    const [id, setId] = useState<string>("")

    const loadData = () => {
        extractPoster(name).then(data => {
            AsyncStorage.setItem(`poster-${btoa(name)}`, data.image as string)
            setImageUrl(data.image as string)
            const scoreRegex = /\d\.\d/
            const imdbScore = scoreRegex.exec(data.description as string)?.[0]
            AsyncStorage.setItem(`score-${btoa(name)}`, imdbScore as string)
            setScore(imdbScore as string)
            AsyncStorage.setItem(`genres-${btoa(name)}`, data.description?.split("|")[1].trim() as string)
            setGenres(data.description?.split("|")[1].trim() as string)
            AsyncStorage.setItem(`imdb-id-${btoa(name)}`, data.id as string)
            setGenres(data.id as string)
        })
    }

    useEffect(() => {
        var posterLoaded = false
        var scoreLoaded = false
        var genresLoaded = false
        var idLoaded = false
        AsyncStorage.getItem(`poster-${btoa(name)}`).then(value => {
            if (value !== null) {
                setImageUrl(value)
                posterLoaded = true
            }
        })
        AsyncStorage.getItem(`score-${btoa(name)}`).then(value => {
            if (value !== null) {
                setScore(value)
                scoreLoaded = true
            }
        })
        AsyncStorage.getItem(`genres-${btoa(name)}`).then(value => {
            if (value !== null) {
                setGenres(value)
                genresLoaded = true
            }
        })
        AsyncStorage.getItem(`imdb-id-${btoa(name)}`).then(value => {
            if (value !== null) {
                setId(value)
                idLoaded = true
            }
        })
        if (!posterLoaded || !scoreLoaded || !genresLoaded) {
            loadData()
        }
    })

    return {imageUrl, score, genres, id}
}
