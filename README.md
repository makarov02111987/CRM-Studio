# CRM Studio v4

Готовый стартовый проект для публикации на Cloudflare Pages.

## Что уже есть

- публичный лендинг и бриф: `index.html`
- публичная цена: только `от 10 000 ₽`
- внутренняя оценка проекта хранится в базе и видна только администратору
- генерация TXT-промта
- серверное сохранение заявок через Cloudflare Pages Functions
- SQLite-база Cloudflare D1
- админ-панель: `/admin.html`
- статусы: `Новая → Связались → КП → Договор → В работе → Завершено`
- просмотр полного промта
- резервное уведомление через текущий FormSubmit на `makarov-m-l@yandex.ru`

## Публикация без локальной разработки

1. Создай GitHub-репозиторий, например `crm-studio`.
2. Загрузи в корень все файлы из этого проекта.
3. В Cloudflare открой Workers & Pages → Create application → Pages → Connect to Git.
4. Выбери GitHub-репозиторий.
5. Production branch: `main`.
6. Build command: `exit 0`.
7. Build output directory: `/` (корень проекта).
8. Создай D1 database с именем `crm-studio-db`.
9. Выполни `schema.sql` в D1.
10. В настройках Pages добавь binding:
    - Variable name: `DB`
    - D1 database: `crm-studio-db`
11. Добавь секрет:
    - `ADMIN_PASSWORD` = придуманный длинный пароль администратора.
12. Сохрани и сделай redeploy.

После этого:
- сайт: `https://ТВОЙ-ПРОЕКТ.pages.dev/`
- админка: `https://ТВОЙ-ПРОЕКТ.pages.dev/admin.html`

## Важно по безопасности

Текущая версия предназначена как рабочий MVP. Для публичного коммерческого запуска следующим этапом стоит добавить:
- Cloudflare Turnstile от спама,
- полноценную сессию вместо передачи пароля как bearer-token,
- rate limiting,
- журнал действий администратора,
- резервное копирование D1.

Не публикуй пароль администратора в HTML или GitHub.
