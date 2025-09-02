#!/bin/bash

echo "🚀 Запуск Jira Tinder в режиме разработки..."

# Проверяем, что Node.js установлен
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+ и попробуйте снова."
    exit 1
fi

# Проверяем, что npm установлен
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Установите npm и попробуйте снова."
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

echo "📦 Установка зависимостей..."
npm run install:all

echo "🔧 Запуск сервера в фоне..."
npm run dev &
SERVER_PID=$!

echo "⏳ Ожидание запуска сервера..."
sleep 3

echo "🌐 Запуск клиента..."
cd client && npm start &
CLIENT_PID=$!

echo "✅ Приложение запущено!"
echo "   🌍 Сервер: http://localhost:3001"
echo "   🎨 Клиент: http://localhost:3000"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Функция для корректного завершения
cleanup() {
    echo ""
    echo "🛑 Остановка приложения..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo "✅ Приложение остановлено."
    exit 0
}

# Перехватываем сигнал завершения
trap cleanup SIGINT SIGTERM

# Ждем завершения
wait
