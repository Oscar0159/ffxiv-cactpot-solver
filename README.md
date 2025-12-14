# FFXIV Cactpot Solver (React + TypeScript + Vite)

一個使用 React + TypeScript + Vite 建置的 FFXIV 仙人微彩（Mini Cactpot）輔助與解題工具。

## 技術

- Vite + React + TypeScript（見 [vite.config.ts](vite.config.ts), [tsconfig.json](tsconfig.json), [tsconfig.app.json](tsconfig.app.json)）
- ESLint（見 [eslint.config.js](eslint.config.js)）
- i18n（見 [src/i18n.ts](src/i18n.ts), [public/locales](public/locales/)）
- GitHub Actions 部署（見 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)）

## 安裝與啟動

1. 安裝依賴（使用 pnpm）：
   ```sh
   pnpm i
   ```
2. 開發模式啟動（含 HMR）：
   ```sh
   pnpm dev
   ```
3. 建置：
   ```sh
   pnpm build
   ```
4. 本地預覽產出：
   ```sh
   pnpm preview
   ```

可用腳本請參考 [package.json](package.json)。

## 主要程式入口

- 應用入口：[`src/main.tsx`](src/main.tsx)
- App 組件：[`src/App.tsx`](src/App.tsx)
- 全域樣式：[`src/index.css`](src/index.css)
- 靜態頁面模板：[`index.html`](index.html)

## 元件一覽

- Cactpot 求解/互動：
  - [`src/components/Cactpot.tsx`](src/components/Cactpot.tsx)
  - [`src/components/CactuarCanvas.tsx`](src/components/CactuarCanvas.tsx)
  - [`src/components/NumberPad.tsx`](src/components/NumberPad.tsx)
- 介面控制：
  - [`src/components/LanguageSwitcher.tsx`](src/components/LanguageSwitcher.tsx)
  - [`src/components/ThemeToggle.tsx`](src/components/ThemeToggle.tsx)

其他資源：

- 圖示與模型：[`public/svgs`](public/svgs/), [`public/models`](public/models/)
- 型別與工具：[`src/types`](src/types/), [`src/lib`](src/lib/)

## 國際化

- 語言資源位於 [`public/locales`](public/locales/)（en 與 zh-TW）。
- 初始化與切換邏輯見 [`src/i18n.ts`](src/i18n.ts) 與 [`src/components/LanguageSwitcher.tsx`](src/components/LanguageSwitcher.tsx)。

## 主題

- 主題切換元件見 [`src/components/ThemeToggle.tsx`](src/components/ThemeToggle.tsx)。
- 可在 [`src/theme`](src/theme/) 擴充樣式與變數。

## 開發建議

- ESLint/Prettier 設定見：
  - [`eslint.config.js`](eslint.config.js)
  - [`.prettierrc`](.prettierrc)
