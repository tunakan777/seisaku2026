import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // ─── GitHub認証系 ────────────────────────────────
  getToken: (): Promise<string | null> => ipcRenderer.invoke('auth:getToken'),
  login: (): Promise<{ userCode: string; verificationUri: string }> => ipcRenderer.invoke('auth:login'),
  poll: (): Promise<string> => ipcRenderer.invoke('auth:poll'),
  logout: (): Promise<void> => ipcRenderer.invoke('auth:logout'),

  // ─── リポジトリ管理系 ──────────────────────────────
  getAllRepos: (): Promise<{ name: string; full_name: string }[]> => ipcRenderer.invoke('repos:getAll'),
  loadRepos: (): Promise<{ name: string; full_name: string; added_at: string }[]> => ipcRenderer.invoke('repos:load'),
  addRepo: (repo: { name: string; full_name: string }): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('repos:add', repo),
  removeRepo: (fullName: string): Promise<void> => ipcRenderer.invoke('repos:remove', fullName),

  // ─── データ取得系 ──────────────────────────────────
  fetchData: (selectedRepos: string[]): Promise<string> => ipcRenderer.invoke('github:fetch', selectedRepos),
  calculateDistortion: (repoName: string): Promise<{
    scores: Record<string, number>
    avgScore: number
    stdDev: number
    distortion: number
  }> => ipcRenderer.invoke('github:calculateDistortion', repoName),

  // ─── Discord系 ────────────────────────────────────
  discord: {
    // 認証系（トークン自体はmainプロセスのみ保持、rendererには絶対渡さない）
    getUser: (): Promise<{ id: string; username: string } | null> =>
      ipcRenderer.invoke('discord:getUser'),
    login: (): Promise<{ id: string; username: string }> =>
      ipcRenderer.invoke('discord:login'),
    logout: (): Promise<void> =>
      ipcRenderer.invoke('discord:logout'),

    // 自分が参加 かつ Botがいるサーバーのみ返す
    getMyAvailableServers: (): Promise<{ guild_id: string; guild_name: string; message_count: number }[]> =>
      ipcRenderer.invoke('discord:getMyAvailableServers'),
    openBotInvite: (): Promise<void> => ipcRenderer.invoke('discord:openBotInvite'),

    // DB操作系（サーバー設定はリポジトリ単位で管理）
    getSettings: (repoFullName: string): Promise<{ guild_id: string; guild_name: string; bot_registered: boolean } | null> =>
      ipcRenderer.invoke('discord:getSettings', repoFullName),
    saveServer: (repoFullName: string, guildId: string, guildName: string): Promise<void> =>
      ipcRenderer.invoke('discord:saveServer', repoFullName, guildId, guildName),
    setBotRegistered: (repoFullName: string, guildId: string): Promise<void> =>
      ipcRenderer.invoke('discord:setBotRegistered', repoFullName, guildId),
    getDiscordUsers: (guildId: string): Promise<{ author_id: string; author_name: string; message_count: number }[]> =>
      ipcRenderer.invoke('discord:getDiscordUsers', guildId),
    getAccountLinks: (repoFullName: string): Promise<{ github_username: string; discord_user_id: string | null; discord_user_name: string | null }[]> =>
      ipcRenderer.invoke('discord:getAccountLinks', repoFullName),
    saveAccountLink: (githubUsername: string, discordUserId: string, discordUserName: string, repoFullName: string): Promise<void> =>
      ipcRenderer.invoke('discord:saveAccountLink', githubUsername, discordUserId, discordUserName, repoFullName),
    saveGithubUsers: (repoFullName: string, githubUsernames: string[]): Promise<void> =>
      ipcRenderer.invoke('discord:saveGithubUsers', repoFullName, githubUsernames),
    calcScores: (guildId: string): Promise<
      {
        author_id: string
        author_name: string
        score: number
        breakdown: {
          messageCount: number
          activeDays: number
          channelCount: number
          replyCount: number
          avgContentLength: number
        }
      }[]
    > => ipcRenderer.invoke('discord:calcScores', guildId),
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
