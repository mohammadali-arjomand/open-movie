import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

export type DownloadStatus = 
    | "downloading"
    | "paused"
    | "completed"
    | "canceled";

export interface DownloadItem {
    id: string,
    url: string, 
    fileUri: string,
    progress: number,
    speed: number, // byte per second
    status: DownloadStatus,
    resumable: FileSystem.DownloadResumable | null
}

interface DownloadContextProps {
    downloads: DownloadItem[],
    setDownloads: React.Dispatch<React.SetStateAction<DownloadItem[]>>,
    addDownload: (url: string, filename: string) => void,
    pauseDownload: (id: string) => void,
    resumeDownload: (id: string) => void,
    cancelDownload: (id: string) => void,
}

const DownloadContext = createContext<DownloadContextProps | undefined>(undefined)

const STORAGE_KEY = "downloads"

export const DownloadProvider = ({children}: {children: ReactNode}) => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([])

    const speedRefs = useRef<Record<string, {lastTime: number, lastBytes: number}>>({})

    useEffect(() => {
        const loadDownloads = async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY)
            if (saved) {
                const parsed: DownloadItem[] = JSON.parse(saved)
                const updated: DownloadItem[] = parsed.map(d => d.status === "downloading" ? {...d, status: "paused", speed: 0} : d)
                const readyToResume: DownloadItem[] = updated.map(item => {
                    if (item.status === "paused") {
                        const resumable = FileSystem.createDownloadResumable(
                            item.url,
                            item.fileUri,
                            {},
                            (downloadProgress) => {
                                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
                                setDownloads(prev => prev.map(d => d.id === item.id ? {...d, progress} : d))
                                if (progress >= 1) {
                                    setDownloads(prev => prev.map(d => d.id === item.id ? {...d, status: "completed"} : d))
                                }
                            }
                        )
                        return {...item, resumable}
                    }
                    return item
                })
                setDownloads(readyToResume as DownloadItem[])
                readyToResume.forEach(d => speedRefs.current[d.id] = {lastTime: Date.now(), lastBytes: d.progress * 1e6})
            }
        }
        loadDownloads()
    }, [])

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(downloads))
    }, [downloads])

    const addDownload = (url: string, filename: string) => {
        const fileUri = FileSystem.documentDirectory + filename
        const id = Date.now().toString()

        const DownloadResumable = FileSystem.createDownloadResumable(url, fileUri, {}, (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite

            const now = Date.now()
            const last = speedRefs.current[id] || {lastTime : now, lastBytes: 0}
            var speed: number
            if (now - last.lastBytes >= 1000) {
                const deltaTime = (now - last.lastTime) / 1000 // convert to seconds
                const deltaByte = downloadProgress.totalBytesWritten - last.lastBytes
                speed = deltaTime > 0 ? deltaByte / deltaTime : 0

                speedRefs.current[id] = {lastTime : now, lastBytes: downloadProgress.totalBytesWritten}
            }

            setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, progress, status: "downloading", speed: speed || d.speed} : d))

            if (progress >= 1) {
                setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, status: "completed"} : d))
            }
        })

        const newItem: DownloadItem = {
            id: Date.now().toString(),
            url, 
            fileUri,
            progress: 0,
            speed: 0,
            status: "downloading",
            resumable: DownloadResumable
        }

        setDownloads(prev => [...prev, newItem])

        DownloadResumable.downloadAsync()
            .then(() =>{setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, status: d.progress >= 1 ? "completed" : d.status, speed: 0} : d))})
            .catch(() => setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, status: "canceled", speed: 0} : d)))
    }

    const pauseDownload = (id: string) => {
        const item = downloads.find(d => d.id === id)
        if (item?.resumable && item.status === "downloading") {
            item.resumable.pauseAsync()
            setDownloads(prev => prev.map(d => d.id === id ? {...d, status: "paused", speed: 0} : d))
        }
    }

    const resumeDownload = (id: string) => {
        const item = downloads.find(d => d.id === id)
        if (item?.resumable && item.status === "paused") {
            item.resumable.resumeAsync()
            setDownloads(prev => prev.map(d => d.id === id ? {...d, status: "downloading", speed: 0} : d))
        }
    }

    const cancelDownload = (id: string) => {
        const item = downloads.find(d => d.id === id)
        if (item?.resumable) {
            item.resumable.pauseAsync()
            setDownloads(prev => prev.map(d => d.id === id ? {...d, status: "canceled", speed: 0} : d))
        }
    }

    return (
        <DownloadContext.Provider value={{downloads, addDownload, pauseDownload, resumeDownload, cancelDownload, setDownloads}}>
            {children}
        </DownloadContext.Provider>
    )
}

export const useDownload = (): DownloadContextProps => {
    const context = useContext(DownloadContext)
    if (!context) throw new Error("useDownload must be used within DownloadProvider")
    return context
}