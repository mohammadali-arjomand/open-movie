import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// const [isBookmark, setIsBookmark] = useState<boolean>(false);

const [bookmarks, setBookmarks] = useState<string[]>([])
    useEffect(() => {
        AsyncStorage.getItem("bookmarks").then((data: string | null) => {
            console.log(data);
            
            if (data !== null) {
                setBookmarks(data.split("(@)"))
            }
        })
    }, [AsyncStorage])    

const isBookmarked = (title: string) => {
    return bookmarks.includes(title)
}


const toggleBookmark = (title: string) => {
    if (isBookmarked(title)) {
        AsyncStorage.getItem("bookmarks").then((data: string | null) => {
        let newData = data?.replace(title as string + "(@)", "") || ""
        newData = newData.replace(title as string, "")
        AsyncStorage.setItem("bookmarks", newData)
        const newBookmarks = bookmarks
        newBookmarks.push(title)
        setBookmarks(newBookmarks)
    })
    }
    else {
        AsyncStorage.getItem("bookmarks").then((data: string | null) => {
        if (data === null || data.length === 0) {
            AsyncStorage.setItem("bookmarks", title as string)
        }
        else {
            AsyncStorage.setItem("bookmarks", data + "(@)" + title as string)
        }
        })
        const newBookmarks = bookmarks
        newBookmarks.filter(item => item !== title)
        setBookmarks(newBookmarks)
    }
}

export { bookmarks, isBookmarked, setBookmarks, toggleBookmark };
