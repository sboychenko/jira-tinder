# Docker Guide for Jira Tinder

Это руководство описывает, как собрать и запустить приложение Jira Tinder в Docker.

## 🐳 Быстрый старт

### 1. Сборка и запуск (разработка)
```bash
# Собрать и запустить
make quick-start

# Или пошагово
make build
make start
```

### 2. Сборка и запуск (продакшн)
```bash
# Полная сборка и запуск
make deploy

# Или пошагово
make build-prod
make start-prod
```

## 📁 Структура Docker файлов

```
jira-tinder/
├── Dockerfile                 # Основной Dockerfile
├── docker-compose.yml         # Конфигурация для разработки
├── docker-compose.prod.yml    # Конфигурация для продакшна
├── nginx.conf                 # Конфигурация Nginx
├── .dockerignore              # Исключения для Docker build
├── build-prod.sh              # Скрипт для продакшн сборки
└── Makefile                   # Команды для управления
```

## 🔧 Доступные команды

### Makefile команды

#### Разработка
```bash
make build        # Собрать Docker образ
make start        # Запустить контейнеры
make stop         # Остановить контейнеры
make restart      # Перезапустить
make logs         # Показать логи
make status       # Статус контейнеров
```

#### Продакшн
```bash
make build-prod   # Собрать продакшн образ
make start-prod   # Запустить продакшн
make stop-prod    # Остановить продакшн
make restart-prod # Перезапустить продакшн
make logs-prod    # Логи продакшна
```

#### Утилиты
```bash
make clean        # Очистить разработку
make clean-prod   # Очистить продакшн
make health       # Проверить здоровье
make images       # Показать образы
make prune        # Очистить Docker
```

### Скрипт build-prod.sh

```bash
./build-prod.sh build      # Только сборка
./build-prod.sh start      # Только запуск
./build-prod.sh stop       # Остановка
./build-prod.sh restart    # Перезапуск
./build-prod.sh status     # Статус
./build-prod.sh logs       # Логи
./build-prod.sh clean      # Очистка
./build-prod.sh help       # Помощь
```

## 🚀 Сборка Docker образа

### 1. Простая сборка
```bash
docker build -t jira-tinder .
```

### 2. Сборка с тегами
```bash
docker build -t jira-tinder:latest -t jira-tinder:v1.0.0 .
```

### 3. Сборка через docker-compose
```bash
# Разработка
docker-compose build

# Продакшн
docker-compose -f docker-compose.prod.yml build
```

## 🏃‍♂️ Запуск контейнеров

### 1. Разработка
```bash
docker-compose up -d
```

### 2. Продакшн
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Прямой запуск
```bash
docker run -d -p 3001:3001 --name jira-tinder-app jira-tinder
```

## 📊 Мониторинг

### Статус контейнеров
```bash
# Все контейнеры
docker ps

# Конкретный сервис
docker-compose ps
docker-compose -f docker-compose.prod.yml ps
```

### Логи
```bash
# Логи в реальном времени
docker-compose logs -f
docker-compose -f docker-compose.prod.yml logs -f

# Логи конкретного контейнера
docker logs -f jira-tinder-app
```

### Здоровье приложения
```bash
# Проверка health check
make health

# Прямая проверка
curl http://localhost:3001/api/health
```

## 🔒 Продакшн настройки

### 1. Nginx Reverse Proxy
- Порт 80 (HTTP)
- Порт 443 (HTTPS) - требует SSL сертификаты
- Rate limiting для API
- Gzip сжатие
- Кэширование статических файлов

### 2. SSL сертификаты
Создайте директорию `ssl/` и поместите туда:
- `cert.pem` - SSL сертификат
- `key.pem` - приватный ключ

### 3. Переменные окружения
```bash
# Создайте .env файл
NODE_ENV=production
PORT=3001
```

## 🧹 Очистка

### Остановка и удаление контейнеров
```bash
# Разработка
make clean

# Продакшн
make clean-prod

# Все
docker system prune -f
```

### Удаление образов
```bash
docker rmi jira-tinder:latest
docker rmi jira-tinder:production
```

## 🐛 Отладка

### Проблемы с портами
```bash
# Проверить занятые порты
lsof -i :3001
lsof -i :80

# Остановить процессы
pkill -f "node server.js"
```

### Проблемы с Docker
```bash
# Проверить статус Docker
docker info

# Перезапустить Docker
# (зависит от вашей ОС)
```

### Проблемы с приложением
```bash
# Проверить логи
make logs

# Проверить здоровье
make health

# Перезапустить
make restart
```

## 📈 Производительность

### Ограничения ресурсов
Продакшн контейнеры имеют ограничения:
- **Jira Tinder**: 512MB RAM, 0.5 CPU
- **Nginx**: 128MB RAM, 0.2 CPU

### Масштабирование
```bash
# Запуск нескольких экземпляров
docker-compose -f docker-compose.prod.yml up -d --scale jira-tinder=3
```

## 🔄 CI/CD

### GitHub Actions пример
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t jira-tinder .
      - name: Push to registry
        run: |
          docker tag jira-tinder:latest ${{ secrets.REGISTRY }}/jira-tinder:latest
          docker push ${{ secrets.REGISTRY }}/jira-tinder:latest
```

## 📚 Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи: `make logs`
2. Проверьте статус: `make status`
3. Проверьте здоровье: `make health`
4. Перезапустите: `make restart`

Для продакшн проблем используйте соответствующие команды с суффиксом `-prod`.
