# 🚀 Развертывание Jira Tinder на любом компьютере

## 📦 Подготовленные файлы

У вас есть следующие tar файлы с Docker образами:

- **`jira-tinder-production.tar`** (48MB) - Production версия с оптимизацией
- **`jira-tinder-latest.tar`** (48MB) - Development версия

## 🔧 Быстрое развертывание

### 1. Автоматическое развертывание (рекомендуется)

```bash
# Запустить на порту 8080
./deploy-anywhere.sh -p 8080

# Запустить на порту 9000
./deploy-anywhere.sh -p 9000

# Запустить с переменными окружения и volume для логов
./deploy-anywhere.sh -p 8080 -e -v

# Запустить с кастомным именем контейнера
./deploy-anywhere.sh -p 8080 -n my-jira-app
```

### 2. Ручное развертывание

#### **Загрузка образа:**
```bash
# Production версия
docker load -i jira-tinder-production.tar

# Development версия
docker load -i jira-tinder-latest.tar
```

#### **Запуск на любом порту:**
```bash
# На порту 8080
docker run -d -p 8080:3001 --name jira-tinder-8080 jira-tinder:production

# На порту 9000
docker run -d -p 9000:3001 --name jira-tinder-9000 jira-tinder:production

# На любом свободном порту
docker run -d -P --name jira-tinder-auto jira-tinder:production
```

## 📋 Полный пример развертывания

### Шаг 1: Копирование файла
```bash
# На новом компьютере
scp jira-tinder-production.tar user@new-server:/tmp/
```

### Шаг 2: Загрузка и запуск
```bash
# Перейти в директорию с файлом
cd /tmp

# Загрузить образ
docker load -i jira-tinder-production.tar

# Запустить на нужном порту
docker run -d -p 8080:3001 --name jira-tinder-app jira-tinder:production

# Проверить статус
docker ps

# Открыть в браузере
# http://localhost:8080
```

## 🎯 Варианты запуска

### **Базовый запуск:**
```bash
docker run -d -p 8080:3001 --name jira-tinder-app jira-tinder:production
```

### **С переменными окружения:**
```bash
docker run -d \
  -p 8080:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  --name jira-tinder-app \
  jira-tinder:production
```

### **С volume для логов:**
```bash
docker run -d \
  -p 8080:3001 \
  -v $(pwd)/logs:/app/logs \
  --name jira-tinder-app \
  jira-tinder:production
```

### **С ограничением ресурсов:**
```bash
docker run -d \
  -p 8080:3001 \
  --memory=512m \
  --cpus=0.5 \
  --name jira-tinder-app \
  jira-tinder:production
```

## 🔍 Управление контейнером

```bash
# Остановить
docker stop jira-tinder-app

# Запустить
docker start jira-tinder-app

# Перезапустить
docker restart jira-tinder-app

# Удалить
docker rm -f jira-tinder-app

# Логи
docker logs -f jira-tinder-app

# Войти в контейнер
docker exec -it jira-tinder-app sh

# Статус
docker ps -f name=jira-tinder-app
```

## 🌐 Проверка работоспособности

```bash
# Проверить health check
curl http://localhost:8080/api/health

# Проверить главную страницу
curl http://localhost:8080

# Проверить доступность API
curl http://localhost:8080/api/tasks
```

## 🚨 Решение проблем

### **Порт занят:**
```bash
# Найти процесс
lsof -i :8080

# Остановить контейнер
docker stop jira-tinder-app
```

### **Образ не загружается:**
```bash
# Проверить файл
ls -lh jira-tinder-production.tar

# Попробовать загрузить снова
docker load -i jira-tinder-production.tar
```

### **Контейнер не запускается:**
```bash
# Проверить логи
docker logs jira-tinder-app

# Проверить статус
docker ps -a
```

## 📊 Мониторинг

### **Статус контейнеров:**
```bash
# Все контейнеры
docker ps

# Контейнеры с именем jira-tinder
docker ps -f name=jira-tinder
```

### **Использование ресурсов:**
```bash
# Статистика контейнера
docker stats jira-tinder-app

# Детальная информация
docker inspect jira-tinder-app
```

## 🔄 Обновление

### **Обновление образа:**
```bash
# Остановить контейнер
docker stop jira-tinder-app

# Удалить старый образ
docker rmi jira-tinder:production

# Загрузить новый образ
docker load -i jira-tinder-production.tar

# Запустить новый контейнер
docker run -d -p 8080:3001 --name jira-tinder-app jira-tinder:production
```

## 📚 Дополнительные команды

### **Скрипт deploy-anywhere.sh:**
```bash
# Показать справку
./deploy-anywhere.sh -h

# Запустить на порту 8080
./deploy-anywhere.sh -p 8080

# Запустить с volume и env
./deploy-anywhere.sh -p 8080 -e -v

# Кастомное имя контейнера
./deploy-anywhere.sh -p 8080 -n my-app
```

### **Прямые Docker команды:**
```bash
# Запуск нескольких экземпляров
docker run -d -p 8080:3001 --name jira-tinder-1 jira-tinder:production
docker run -d -p 8081:3001 --name jira-tinder-2 jira-tinder:production

# Запуск в фоновом режиме
nohup docker run -d -p 8080:3001 --name jira-tinder-app jira-tinder:production &
```

## 🎉 Готово!

После успешного развертывания:

1. ✅ Docker образ загружен
2. ✅ Контейнер запущен
3. ✅ Приложение доступно на указанном порту
4. ✅ Health check проходит успешно

**Откройте браузер и перейдите по адресу:**
- http://localhost:8080 (или другому указанному порту)

**Настройте Jira:**
1. Нажмите "⚙️ Настройки"
2. Введите URL вашего Jira сервера
3. Введите API токен
4. Установите лимит задач
5. Сохраните настройки
