import { showPage } from '../utils/dom'
import { selectedRepoName } from './pagegit3'
import { renderDistortionMeter } from './pageresult'

export function setupPage4(): void {
  const toPage5Btn = document.getElementById('toPage5Btn')
  const toPage3Btn = document.getElementById('toPage4BackBtn')

  toPage5Btn?.addEventListener('click', async () => {
    // 崩壊度メーターを描画してからページ遷移
    await renderDistortionMeter(selectedRepoName)
    showPage('pageresult')
  })

  toPage3Btn?.addEventListener('click', () => {
    showPage('pagegit3')
  })
}