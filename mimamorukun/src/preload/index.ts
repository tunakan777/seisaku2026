import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 保存済みトークンを取得
  getToken: (): Promise<string | null> => ipcRenderer.invoke('auth:getToken'),
  // OAuth認証フローを開始
  login: (): Promise<string> => ipcRenderer.invoke('auth:login'),
  // ログアウト
  logout: (): Promise<void> => ipcRenderer.invoke('auth:logout')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}