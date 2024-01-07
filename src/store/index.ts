import { defineStore } from 'pinia'
import {EditFileInfo, EditorSession} from "../class.ts";


export const useEditorStore = defineStore('editor', {
    state: (): PiniaState => ({
        // 当前编辑文件路径
        currentFile: '' as string,
        // 编辑文件信息列表  key为文件路径
        editFileList: new Map() as Map<string, EditFileInfo>,
    }),
    actions: {
        // 获取指定编辑文件
        getEditFileInfo(key: string) {
            return this.editFileList.get(key);
        },
        // 获取当前编辑文件
        getCurrentEditFileInfo() {
            return this.editFileList.get(this.currentFile);
        },

        // 添加编辑文件
        addEditFile(key: string, info: EditFileInfo) {
            delete info.mode;
            delete info.session;
            this.editFileList.set(key, info);
        },
        // 更新文件session
        updateEditFileSession(key: string, mode?: string, session?: EditorSession) {
            const file = this.editFileList.get(key);
            if (mode) file.mode = mode;
            if (session) file.session = session;
        },
        // 更新当前文件语言
        updateCurrentEditFileMode(mode: string) {
            const file = this.editFileList.get(this.currentFile);
            file.mode = mode;
            if (file.session) {
                file.session.setMode(mode);
            }
        },
        // 删除编辑文件
        deleteEditFile(key: string): boolean {
            const deleteItem = this.editFileList.get(key);
            delete deleteItem.mode;
            delete deleteItem.session;
            this.editFileList.delete(key);
            return true
        },
        
    }
})

declare type PiniaState = {
    editFileList: Map<string, EditFileInfo>;
    currentFile: string;
}
