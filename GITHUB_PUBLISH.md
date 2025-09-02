# Публикация проекта на GitHub 🚀

Этот файл содержит пошаговые инструкции по публикации проекта Jira Tinder на GitHub.

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на [GitHub](https://github.com)
2. Нажмите кнопку "New" или "+" в правом верхнем углу
3. Выберите "New repository"
4. Заполните форму:
   - **Repository name**: `jira-tinder`
   - **Description**: `Tinder-like interface for Jira tasks management`
   - **Visibility**: Public (рекомендуется) или Private
   - **Initialize with**: НЕ ставьте галочки (у нас уже есть файлы)
5. Нажмите "Create repository"

## Шаг 2: Подключение локального репозитория к GitHub

После создания репозитория на GitHub, выполните следующие команды:

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/jira-tinder.git

# Переименуйте основную ветку в main (если нужно)
git branch -M main

# Отправьте код на GitHub
git push -u origin main
```

## Шаг 3: Настройка репозитория

### Добавление описания и тегов

1. Перейдите на страницу вашего репозитория
2. В разделе "About" добавьте:
   - **Description**: `Tinder-like interface for Jira tasks management`
   - **Topics**: `jira`, `tinder`, `react`, `nodejs`, `docker`, `task-management`

### Настройка README

README файл уже создан и будет автоматически отображаться на главной странице репозитория.

## Шаг 4: Настройка GitHub Pages (опционально)

Если хотите создать демо-страницу:

1. Перейдите в Settings → Pages
2. В разделе "Source" выберите "Deploy from a branch"
3. Выберите ветку `main` и папку `/docs` или `/`
4. Нажмите "Save"

## Шаг 5: Настройка Actions (опционально)

Создайте файл `.github/workflows/ci.yml` для автоматической сборки:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm run install:all
      
    - name: Build
      run: npm run build:client
      
    - name: Test
      run: npm test
```

## Шаг 6: Настройка Issues и Projects

### Включение Issues

1. Перейдите в Settings → Features
2. Убедитесь, что Issues включены
3. Настройте шаблоны Issues (уже созданы)

### Создание Project Board

1. Перейдите на вкладку "Projects"
2. Нажмите "New project"
3. Выберите шаблон "Basic Kanban"
4. Настройте колонки: To Do, In Progress, Done

## Шаг 7: Настройка Wiki (опционально)

1. Перейдите в Settings → Features
2. Включите Wiki
3. Создайте страницы с дополнительной документацией

## Шаг 8: Настройка Releases

При создании новой версии:

1. Перейдите в Releases
2. Нажмите "Create a new release"
3. Создайте тег (например, v1.0.0)
4. Добавьте описание изменений
5. Приложите файлы сборки

## Шаг 9: Продвижение проекта

### Добавление в профиль

Добавьте проект в закрепленные репозитории вашего профиля GitHub.

### Создание демо

1. Разверните приложение на платформе (Heroku, Vercel, Netlify)
2. Добавьте ссылку на демо в README
3. Создайте скриншоты и GIF-анимации

### Социальные сети

Поделитесь проектом в:
- LinkedIn
- Twitter
- Reddit (r/webdev, r/reactjs)
- Dev.to
- Medium

## Шаг 10: Поддержка сообщества

### Мониторинг Issues

- Регулярно проверяйте новые Issues
- Отвечайте на вопросы
- Принимайте Pull Requests

### Обновления

- Регулярно обновляйте зависимости
- Исправляйте баги
- Добавляйте новые функции

## Полезные ссылки

- [GitHub Guides](https://guides.github.com/)
- [GitHub Pages](https://pages.github.com/)
- [GitHub Actions](https://github.com/features/actions)
- [GitHub Projects](https://github.com/features/project-management/)

## Команды для обновления

```bash
# Добавить изменения
git add .

# Создать коммит
git commit -m "feat: add new feature"

# Отправить на GitHub
git push origin main

# Создать новую ветку для функции
git checkout -b feature/new-feature

# Создать Pull Request (через GitHub UI)
```

## Советы

1. **Регулярные коммиты**: Делайте коммиты часто с понятными сообщениями
2. **Хорошие описания**: Пишите подробные описания для Issues и Pull Requests
3. **Документация**: Поддерживайте документацию в актуальном состоянии
4. **Тестирование**: Добавляйте тесты для новых функций
5. **Безопасность**: Регулярно обновляйте зависимости

---

**Удачи с публикацией! 🎉**
