#!/bin/bash

echo "🐳 Запуск Jira Tinder в Docker..."

# Проверяем, что Docker установлен
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем, что Docker Compose установлен
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Проверяем, что .env файл существует
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаю из примера..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Файл .env создан. Отредактируйте его с вашими данными Jira."
        echo "   Затем запустите скрипт снова."
        exit 1
    else
        echo "❌ Файл env.example не найден."
        exit 1
    fi
fi

echo "🔧 Сборка и запуск контейнеров..."
docker-compose up --build -d

echo "⏳ Ожидание запуска приложения..."
sleep 10

# Проверяем статус
if docker-compose ps | grep -q "Up"; then
    echo "✅ Приложение успешно запущено в Docker!"
    echo "   🌍 URL: http://localhost:3001"
    echo ""
    echo "Полезные команды:"
    echo "   📊 Статус: docker-compose ps"
    echo "   📝 Логи: docker-compose logs -f"
    echo "   🛑 Остановка: docker-compose down"
    echo "   🔄 Перезапуск: docker-compose restart"
else
    echo "❌ Ошибка запуска приложения. Проверьте логи:"
    echo "   docker-compose logs"
    exit 1
fi
