import { extractPoster } from "@/services/imdb-poster"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

export default function usePoster(name: string) {
    const [imageUrl, setImageUrl] = useState<string>("https://s34.picofile.com/file/8486872134/poster_placeholder.png")

    useEffect(() => {
        AsyncStorage.getItem(`poster-${btoa(name)}`).then(value => {
            if (value !== null) {
                setImageUrl(value)
            }
            else {
                extractPoster(name).then(url => {
                    AsyncStorage.setItem(`poster-${btoa(name)}`, url as string)
                    setImageUrl(url as string)
                })
            }
        })
    })

    return imageUrl
}
