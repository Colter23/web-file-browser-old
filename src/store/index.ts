import { defineStore } from 'pinia'
import { FileInfo } from "../class.ts";


export const useUserStore = defineStore('editor', {
    state: () => {
        return {
            editFileList: [] as FileInfo[],
        }
    },
})

