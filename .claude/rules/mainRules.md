---
trigger: always_on
---

# Правила Next.js

## Створення

- Перший проєкт створюй без TS, Tailwind, лінтера: `npx create-next-app@latest назва --no-typescript --no-tailwind --no-eslint`
- Використовуй `src/` та App Router.

## Роутинг

- Сторінка: `app/назва/page.jsx`
- Навігація: `import Link from 'next/link'` (не `<a>`)
- Динамічний маршрут: `app/users/[id]/page.jsx`
- Отримання параметра: `const { id } = await params` (обов'язково `await`)

## Компоненти

- За замовчуванням – серверні. Для клієнтських додай `'use client'` (потрібно для хуків, onClick, browser API).
- `error.jsx` – обов'язково клієнтський.

## API та дані

- **Не роби `fetch` із серверного компонента у власний API (app/api/) – антипаттерн.**
- Спільну логіку винось у `lib/` та імпортуй напряму.

## Зображення

- Використовуй `next/image` замість `<img>`.
- Обов'язкові `width`, `height`, `alt`.
- Для зовнішніх картинок налаштуй `remotePatterns` у `next.config.js`.

## Спеціальні файли

- `loading.jsx` – завантаження
- `not-found.jsx` – кастомна 404
- `error.jsx` – клієнтський компонент помилки

## SEO

- `export const metadata = { title, description }` у серверному компоненті.

## Шрифти

- Google Fonts через `next/font/google`, додавай змінну до `className` на `<html>`.

## Деплой

- Перед деплоєм обов'язково `npm run build`.
- ENV змінні: `.env.local` (локально), на Vercel – у налаштуваннях + redeploy.
