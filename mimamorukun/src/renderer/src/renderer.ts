import { showPage } from './utils/dom'
import { setupPage1 } from './pages/page1'
import { setupPage2, loadRepoOptions, renderRegisteredRepos } from './pages/page2'
import { setupPage3, renderCheckList } from './pages/page3'

async function init(): Promise<void> {
  window.addEventListener('DOMContentLoaded', async () => {
    setupPage1()
    setupPage2()
    setupPage3()

    // 起動時に保存済みトークンを確認
    const token = await window.api.getToken()
    if (token) {
      await loadRepoOptions()
      await renderRegisteredRepos()
      await renderCheckList()
      showPage('page2')
    } else {
      showPage('page1')
    }
  })
}

init()