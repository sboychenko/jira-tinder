# 🚀 Настройка Jira Tinder

## ❌ Проблема: "Failed to fetch tasks from Jira"

Эта ошибка возникает по следующим причинам:

1. **Неправильные данные в `.env` файле**
2. **Jira сервер недоступен**
3. **Неправильные права доступа**

## ✅ Решение пошагово

### Шаг 1: Остановите все процессы

```bash
# Нажмите Ctrl+C во всех терминалах где запущены процессы
# Или найдите и остановите процессы:
pkill -f "node server.js"
pkill -f "react-scripts"
```

### Шаг 2: Настройте `.env` файл

Отредактируйте файл `.env` и укажите **РЕАЛЬНЫЕ** данные:

```bash
# ❌ НЕПРАВИЛЬНО (placeholder значения):
JIRA_BASE_URL=http://your-jira-instance.com
JIRA_USERNAME=your_username
JIRA_PASSWORD=your_password

# ✅ ПРАВИЛЬНО (реальные данные):
JIRA_BASE_URL=http://jira.company.com
JIRA_USERNAME=john.doe
JIRA_PASSWORD=mypassword123
```

### Шаг 3: Проверьте доступность Jira

```bash
# Проверьте, доступен ли ваш Jira сервер
curl -I "http://your-jira-server.com"

# Если используете HTTPS:
curl -I "https://your-jira-server.com"
```

### Шаг 4: Проверьте права доступа

Убедитесь, что пользователь имеет права:
- Читать задачи (Browse Projects)
- Обновлять задачи (Edit Issues)
- Добавлять лейблы "run" и "change"

### Шаг 5: Перезапустите приложение

```bash
# Вариант 1: Используйте скрипт
./start-dev.sh

# Вариант 2: Запустите вручную
# Терминал 1 (сервер):
npm run dev

# Терминал 2 (клиент):
cd client && npm start
```

## 🔍 Диагностика проблем

### Проверка логов сервера

```bash
# В терминале где запущен сервер должны быть логи:
Server running on port 3001
Jira base URL: http://your-actual-jira-server.com
```

### Проверка подключения к Jira

```bash
# Тест API напрямую
curl -u "username:password" \
  "http://your-jira-server.com/rest/api/3/myself"
```

### Проверка CORS

Если получаете CORS ошибки, добавьте в Jira:

```bash
# В Jira: Administration > System > HTTP Request Settings
# Добавьте ваш домен в CORS allowed origins
```

## 📝 Примеры правильной конфигурации

### Для локального Jira:
```bash
JIRA_BASE_URL=http://localhost:8080
JIRA_USERNAME=admin
JIRA_PASSWORD=admin
```

### Для корпоративного Jira:
```bash
JIRA_BASE_URL=https://jira.company.com
JIRA_USERNAME=john.doe@company.com
JIRA_API_TOKEN=your_api_token_here
```

### Для Jira Cloud:
```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@domain.com
JIRA_API_TOKEN=your_api_token_here
```

## 🚨 Частые ошибки

### 1. "getaddrinfo ENOTFOUND"
- **Причина**: Неправильный URL в `JIRA_BASE_URL`
- **Решение**: Проверьте URL и доступность сервера

### 2. "401 Unauthorized"
- **Причина**: Неправильные учетные данные
- **Решение**: Проверьте логин/пароль или API токен

### 3. "403 Forbidden"
- **Причина**: Недостаточно прав
- **Решение**: Проверьте права пользователя в Jira

### 4. "CORS error"
- **Причина**: Jira блокирует запросы
- **Решение**: Настройте CORS в Jira или используйте proxy

## 🔧 Альтернативные решения

### Использование API токена вместо пароля

1. В Jira: Profile > Personal Access Tokens
2. Создайте новый токен
3. В `.env` файле:
   ```bash
   JIRA_API_TOKEN=your_token_here
   # Оставьте JIRA_USERNAME и JIRA_PASSWORD пустыми
   ```

### Использование прокси

Если CORS не работает, настройте прокси в Jira или используйте nginx.

## 📞 Получение помощи

Если проблема не решается:

1. **Проверьте логи сервера** - там будет детальная информация об ошибке
2. **Проверьте логи браузера** (F12 > Console)
3. **Протестируйте Jira API** напрямую через curl
4. **Создайте Issue** с описанием проблемы и логами

---

**Успешной настройки! 🎉**
