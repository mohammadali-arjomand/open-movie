import { loadNumberOfEpisodes, loadSeasons } from "@/services/load-movie-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SeasonsContinueWatching = Record<number, number[]>

type TitlesContinueWatching = Record<string, SeasonsContinueWatching>

type ContinueWatchingContextType = {
    titles: TitlesContinueWatching,
    isWatched: (title: string, season: number, episode: number) => boolean,
    markAsWatched: (title: string, season: number, episode: number) => void,
    getFirstUnwatched: (title: string, episodesList: Record<number, number>) => {season: number, episode: number} | null,
    isWatchedCompletely: (title: string) => Promise<boolean>,
}

const ContinueWatchingContext = createContext<ContinueWatchingContextType>({
    titles: {},
    isWatched: () => false,
    markAsWatched: () => {},
    getFirstUnwatched: () => null,
    isWatchedCompletely: async () => false
})

export function ContinueWatchingProvider({children}: {children: ReactNode}) {
    const [titles, setTitles] = useState<TitlesContinueWatching>({})

    useEffect(() => {
        AsyncStorage.getItem("continue-watching").then(value => {
            if (value !== null) {
                const json = JSON.parse(value)
                setTitles(json)
            }
        })
    }, [])

    useEffect(() => {
        AsyncStorage.setItem("continue-watching", JSON.stringify(titles))
    }, [titles])

    function isWatched(title: string, season: number, episode: number) {
        return titles[title]?.[season]?.includes(episode) ?? false
    }

    function markAsWatched(title: string, season: number, episode: number) {      
        setTitles(prev => {
            const titleObj = prev[title] ?? {}
            const seasonArr = titleObj[season] ?? []

            if (seasonArr.includes(episode)) {
                return prev
            }

            return {
                ...prev,
                [title]: {
                    ...titleObj,
                    [season]: [...seasonArr, episode]
                }
            }
        })
    }

    function getFirstUnwatched(title: string, episodesList: Record<number, number>): {season: number, episode: number} | null {
        const seasons = Object.keys(episodesList).map(Number).sort((a, b) => a - b);

        for (const season of seasons) {

            const episodes = Array(episodesList[season]).fill(0).map((_,i) => i+1)
            for (const episode of episodes) {
                if (!titles[title]?.[season]?.includes(episode)) {
                    return { season, episode };
                }
            }
        }

        return null;
    }

    async function isWatchedCompletely(title: string): Promise<boolean> {
        const titleObj = titles[title];
        if (!titleObj) return false; // اگر عنوان اصلاً دیده نشده

        // گرفتن فصل‌ها با loadSeasons
        const seasonsList = await loadSeasons(title); // [{season: "1"}, {season: "2"}, ...]

        for (const seasonObj of seasonsList) {
            const seasonNum = Number(seasonObj.season); // تبدیل رشته به عدد
            const totalEpisodes = await loadNumberOfEpisodes(title, seasonNum);
            const seenEpisodes = titleObj[seasonNum] ?? [];

            if (seenEpisodes.length < (totalEpisodes ?? 0)) {
                return false; // هنوز همه اپیزودها دیده نشده
            }
        }

        return true; // همه فصل‌ها کامل دیده شده
    }



    return (
        <ContinueWatchingContext.Provider value={{titles, isWatched, markAsWatched, getFirstUnwatched, isWatchedCompletely}}>
            {children}
        </ContinueWatchingContext.Provider>
    )
}

export const useContinueWatching = () => useContext(ContinueWatchingContext)