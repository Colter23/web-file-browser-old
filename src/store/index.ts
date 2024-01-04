import { defineStore } from 'pinia'
import { FileInfo } from "../class.ts";


export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editFileList: [] as FileInfo[],
        }
    },
})

