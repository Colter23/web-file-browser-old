import {Ace} from "ace-builds";

export interface FileInfo {
    path: string,
    mode: string,
    session?: Ace.EditSession
}