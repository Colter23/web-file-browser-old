import {Ace} from "ace-builds";

// JSON Decode Data
export type FolderInfos = FolderInfo[]
export type FileInfos = FileInfo[]
export interface FolderData {
    path: string;
    folder?: FolderInfos;
    file?: FileInfos;
}

export interface FolderInfo {
    path: string;
    name: string;
    modified: string;
}

export interface FileInfo {
    path: string;
    name: string;
    size: number;
    extension: string;
    modified: string;
}


// Object
export type EditorSession = Ace.EditSession

export interface EditFileInfo extends FileInfo {
    mode?: string
    session?: EditorSession
}