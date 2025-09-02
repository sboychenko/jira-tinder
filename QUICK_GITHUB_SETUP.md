# Быстрая публикация на GitHub ⚡

## 1. Создайте репозиторий на GitHub

1. Перейдите на [GitHub](https://github.com)
2. Нажмите "New repository"
3. Название: `jira-tinder`
4. Описание: `Tinder-like interface for Jira tasks management`
5. Public/Private (на ваш выбор)
6. НЕ инициализируйте с README (у нас уже есть)

## 2. Подключите локальный репозиторий

```bash
# Замените YOUR_USERNAME на ваше имя пользователя GitHub
git remote add origin https://github.com/YOUR_USERNAME/jira-tinder.git
git branch -M main
git push -u origin main
```

## 3. Настройте репозиторий

1. Добавьте теги: `jira`, `tinder`, `react`, `nodejs`, `docker`
2. Включите Issues и Projects
3. Настройте GitHub Pages (опционально)

## 4. Готово! 🎉

Ваш проект теперь опубликован на GitHub!

## Полезные команды

```bash
# Обновить код
git add .
git commit -m "feat: add new feature"
git push origin main

# Создать новую ветку
git checkout -b feature/new-feature

# Посмотреть статус
git status
```

## Ссылки

- [Подробная инструкция](GITHUB_PUBLISH.md)
- [Документация проекта](README.md)
- [Настройка](SETUP.md)
