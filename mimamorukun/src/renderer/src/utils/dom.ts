// 画面切り替え
export function showPage(pageId: string): void {
  document.querySelectorAll('.page').forEach((page) => {
    (page as HTMLElement).style.display = 'none'
  })
  const target = document.getElementById(pageId)
  if (target) target.style.display = 'block'
}