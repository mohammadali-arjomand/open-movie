import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
    status: DownloadStatus,
    resumable: FileSystem.DownloadResumable | null
}

interface DownloadContextProps {
    downloads: DownloadItem[],
    addDownload: (url: string, filename: string) => void,
    pauseDownload: (id: string) => void,
    resumeDownload: (id: string) => void,
    cancelDownload: (id: string) => void,
}

const DownloadContext = createContext<DownloadContextProps | undefined>(undefined)

const STORAGE_KEY = "downloads"

export const DownloadProvider = ({children}: {children: ReactNode}) => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([])

    useEffect(() => {
        const loadDownloads = async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY)
            if (saved) {
                const parsed: DownloadItem[] = JSON.parse(saved)
                const updated: DownloadItem[] = parsed.map(d => d.status === "downloading" ? {...d, status: "paused"} : d)
                const readyToResume: DownloadItem[] = updated.map(item => {
                    if (item.status === "paused") {
                        const resumable = FileSystem.createDownloadResumable(
                            item.url,
                            item.fileUri,
                            {},
                            (downloadProgress) => {
                                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
                                setDownloads(prev => prev.map(d => d.id === item.id ? {...d, progress} : d))
                            }
                        )
                        return {...item, resumable}
                    }
                    return item
                })
                setDownloads(readyToResume as DownloadItem[])

            }
        }
        loadDownloads()
    }, [])

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(downloads))
    }, [downloads])

    const addDownload = (url: string, filename: string) => {
        const fileUri = FileSystem.documentDirectory + filename

        const DownloadResumable = FileSystem.createDownloadResumable(url, fileUri, {}, (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
            setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, progress} : d))
        })

        const newItem: DownloadItem = {
            id: Date.now().toString(),
            url, 
            fileUri,
            progress: 0,
            status: "downloading",
            resumable: DownloadResumable
        }

        setDownloads(prev => [...prev, newItem])

        DownloadResumable.downloadAsync()
            .then(() => setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, status: "completed"} : d)))
            .catch(() => setDownloads(prev => prev.map(d => d.id === newItem.id ? {...d, status: "canceled"} : d)))
    }

    const pauseDownload = (id: string) => {
        const item = downloads.find(d => d.id === id)
        if (item?.resumable && item.status === "downloading") {
            item.resumable.pauseAsync()
            setDownloads(prev => prev.map(d => d.id === id ? {...d, status: "paused"} : d))
        }
    }

    const resumeDownload = (id: string) => {
        const item = downloads.find(d => d.id === id)
        if (item?.resumable && item.status === "paused") {
            item.resumable.resumeAsync()
            setDownloads(prev => prev.map(d => d.id === id ? {...d, status: "downloading"} : d))
        }
    }

    const cancelDownload = (id: string) => {
        const item = downloads.find(d => d.id === id)
        if (item?.resumable) {
            item.resumable.pauseAsync()
            setDownloads(prev => prev.map(d => d.id === id ? {...d, status: "canceled"} : d))
        }
    }

    return (
        <DownloadContext.Provider value={{downloads, addDownload, pauseDownload, resumeDownload, cancelDownload}}>
            {children}
        </DownloadContext.Provider>
    )
}

export const useDownload = (): DownloadContextProps => {
    const context = useContext(DownloadContext)
    if (!context) throw new Error("useDownload must be used within DownloadProvider")
    return context
}