import { DownloadResumable } from "expo-file-system/legacy";

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
    resumable: DownloadResumable | null
}