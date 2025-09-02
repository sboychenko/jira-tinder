# 🐳 Быстрый старт с Docker

## ⚡ Команды для быстрого запуска

### Разработка
```bash
# Полный запуск (сборка + запуск)
make quick-start

# Или пошагово
make build
make start
```

### Продакшн
```bash
# Полный деплой
make deploy

# Или пошагово
make build-prod
make start-prod
```

## 🚀 Основные команды

```bash
make help          # Показать все команды
make status        # Статус контейнеров
make logs          # Логи разработки
make logs-prod     # Логи продакшна
make health        # Проверить здоровье
make clean         # Очистить разработку
make clean-prod    # Очистить продакшн
```

## 🌐 Доступ к приложению

- **Разработка**: http://localhost:3001
- **Продакшн**: http://localhost:80 (через Nginx)

## 📁 Структура файлов

```
jira-tinder/
├── Dockerfile                 # Основной образ
├── docker-compose.yml         # Разработка
├── docker-compose.prod.yml    # Продакшн + Nginx
├── nginx.conf                 # Конфигурация Nginx
├── build-prod.sh              # Скрипт продакшн сборки
├── Makefile                   # Команды управления
└── DOCKER.md                  # Подробная документация
```

## 🔧 Полезные команды Docker

```bash
# Показать контейнеры
docker ps

# Показать образы
docker images | grep jira-tinder

# Логи контейнера
docker logs -f jira-tinder-app

# Войти в контейнер
docker exec -it jira-tinder-app sh

# Остановить все
docker-compose down
```

## 🆘 Решение проблем

### Порт занят
```bash
# Остановить процессы
pkill -f "node server.js"

# Или остановить контейнеры
make stop
```

### Пересборка
```bash
# Очистить и пересобрать
make clean
make build

# Или продакшн
make clean-prod
make build-prod
```

### Проверить здоровье
```bash
make health
curl http://localhost:3001/api/health
```

## 📚 Подробная документация

См. файл `DOCKER.md` для полного описания всех возможностей.
