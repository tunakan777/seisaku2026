function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing()
    setupAuth()
  })
}

function doAThing(): void {
  const versions = window.electron.process.versions
  replaceText('.electron-version', `Electron v${versions.electron}`)
  replaceText('.chrome-version', `Chromium v${versions.chrome}`)
  replaceText('.node-version', `Node v${versions.node}`)

  const ipcHandlerBtn = document.getElementById('ipcHandler')
  ipcHandlerBtn?.addEventListener('click', () => {
    window.electron.ipcRenderer.send('ping')
  })
}

// OAuth認証の処理
async function setupAuth(): Promise<void> {
  const loginBtn = document.getElementById('loginBtn')
  const logoutBtn = document.getElementById('logoutBtn')
  const statusText = document.getElementById('authStatus')

  // 起動時に保存済みトークンを確認
  const token = await window.api.getToken()
  if (token && statusText) {
    statusText.innerText = '認証済み'
  }

  // ログインボタン
  loginBtn?.addEventListener('click', async () => {
    if (statusText) statusText.innerText = '認証中...'
    const token = await window.api.login()
    if (token && statusText) {
      statusText.innerText = '認証済み'
    }
  })

  // ログアウトボタン
  logoutBtn?.addEventListener('click', async () => {
    await window.api.logout()
    if (statusText) statusText.innerText = '未認証'
  })
}

function replaceText(selector: string, text: string): void {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) {
    element.innerText = text
  }
}

init()