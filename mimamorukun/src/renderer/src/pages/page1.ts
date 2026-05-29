import { showPage } from '../utils/dom'
import { loadRepoOptions, renderRegisteredRepos } from './page2'
import { renderCheckList } from './page3'

export function setupPage1(): void {
  const loginBtn = document.getElementById('loginBtn')
  const userCodeText = document.getElementById('userCode')
  const statusText = document.getElementById('authStatus')

  loginBtn?.addEventListener('click', async () => {
    if (statusText) statusText.innerText = '認証中...'

    const { userCode } = await window.api.login()
    if (userCodeText) {
      userCodeText.innerText = `GitHubで以下のコードを入力してください: ${userCode}`
    }

    const token = await window.api.poll()
    if (token) {
      if (userCodeText) userCodeText.innerText = ''
      if (statusText) statusText.innerText = ''
      await loadRepoOptions()
      await renderRegisteredRepos()
      await renderCheckList()
      showPage('page2')
    }
  })
}