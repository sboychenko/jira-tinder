#!/bin/bash

# Jira Tinder Deploy Anywhere Script
# Этот скрипт загружает и запускает Docker образ на указанном порту

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Функция показа справки
show_usage() {
    echo "Использование: $0 [ОПЦИИ]"
    echo ""
    echo "Опции:"
    echo "  -p PORT     Порт для запуска (по умолчанию: 3001)"
    echo "  -n NAME     Имя контейнера (по умолчанию: jira-tinder-\$PORT)"
    echo "  -i IMAGE    Имя образа (по умолчанию: jira-tinder:production)"
    echo "  -f FILE     Tar файл для загрузки (по умолчанию: jira-tinder-production.tar)"
    echo "  -e          Запустить с переменными окружения"
    echo "  -v          Запустить с volume для логов"
    echo "  -h          Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0 -p 8080                    # Запустить на порту 8080"
    echo "  $0 -p 9000 -n my-app          # Запустить на порту 9000 с именем my-app"
    echo "  $0 -p 8080 -e -v              # Запустить с env и volume"
    echo "  $0 -f custom-image.tar -p 8080 # Загрузить и запустить кастомный образ"
}

# Параметры по умолчанию
PORT=3001
CONTAINER_NAME=""
IMAGE_NAME="jira-tinder:production"
TAR_FILE="jira-tinder-production.tar"
USE_ENV=false
USE_VOLUME=false

# Парсинг аргументов командной строки
while getopts "p:n:i:f:evh" opt; do
    case $opt in
        p) PORT="$OPTARG" ;;
        n) CONTAINER_NAME="$OPTARG" ;;
        i) IMAGE_NAME="$OPTARG" ;;
        f) TAR_FILE="$OPTARG" ;;
        e) USE_ENV=true ;;
        v) USE_VOLUME=true ;;
        h) show_usage; exit 0 ;;
        \?) print_error "Неизвестная опция: -$OPTARG"; exit 1 ;;
    esac
done

# Генерация имени контейнера если не указано
if [[ -z "$CONTAINER_NAME" ]]; then
    CONTAINER_NAME="jira-tinder-$PORT"
fi

# Проверка Docker
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker не запущен. Запустите Docker и попробуйте снова."
        exit 1
    fi
    print_success "Docker запущен"
}

# Проверка существования tar файла
check_tar_file() {
    if [[ ! -f "$TAR_FILE" ]]; then
        print_error "Tar файл не найден: $TAR_FILE"
        exit 1
    fi
    print_success "Tar файл найден: $TAR_FILE"
}

# Загрузка образа
load_image() {
    print_status "Загрузка Docker образа из $TAR_FILE..."
    
    if docker load -i "$TAR_FILE"; then
        print_success "Образ успешно загружен"
    else
        print_error "Ошибка при загрузке образа"
        exit 1
    fi
}

# Проверка существования образа
check_image() {
    if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
        print_error "Образ $IMAGE_NAME не найден"
        exit 1
    fi
    print_success "Образ $IMAGE_NAME найден"
}

# Остановка существующего контейнера
stop_existing_container() {
    if docker ps -q -f name="^$CONTAINER_NAME$" | grep -q .; then
        print_status "Остановка существующего контейнера $CONTAINER_NAME..."
        docker stop "$CONTAINER_NAME" > /dev/null 2>&1 || true
        docker rm "$CONTAINER_NAME" > /dev/null 2>&1 || true
        print_success "Существующий контейнер остановлен и удален"
    fi
}

# Создание директории для логов
create_logs_directory() {
    if [[ "$USE_VOLUME" == true ]]; then
        mkdir -p logs
        print_status "Создана директория logs"
    fi
}

# Запуск контейнера
run_container() {
    print_status "Запуск контейнера $CONTAINER_NAME на порту $PORT..."
    
    local docker_cmd="docker run -d"
    docker_cmd="$docker_cmd -p $PORT:3001"
    docker_cmd="$docker_cmd --name $CONTAINER_NAME"
    
    if [[ "$USE_ENV" == true ]]; then
        docker_cmd="$docker_cmd -e NODE_ENV=production -e PORT=3001"
    fi
    
    if [[ "$USE_VOLUME" == true ]]; then
        docker_cmd="$docker_cmd -v $(pwd)/logs:/app/logs"
    fi
    
    docker_cmd="$docker_cmd $IMAGE_NAME"
    
    print_status "Выполняется команда: $docker_cmd"
    
    if eval "$docker_cmd"; then
        print_success "Контейнер $CONTAINER_NAME успешно запущен"
    else
        print_error "Ошибка при запуске контейнера"
        exit 1
    fi
}

# Проверка здоровья приложения
check_health() {
    print_status "Проверка здоровья приложения..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s "http://localhost:$PORT/api/health" > /dev/null 2>&1; then
            print_success "Приложение здорово и отвечает на порту $PORT"
            return 0
        fi
        
        print_status "Попытка $attempt/$max_attempts: Приложение еще не готово, ожидание..."
        sleep 5
        ((attempt++))
    done
    
    print_error "Приложение не запустилось в ожидаемое время"
    return 1
}

# Показать информацию о контейнере
show_container_info() {
    print_status "Информация о контейнере:"
    docker ps -f name="^$CONTAINER_NAME$"
    
    echo ""
    print_success "Приложение доступно по адресу: http://localhost:$PORT"
    print_status "Для просмотра логов выполните: docker logs -f $CONTAINER_NAME"
    print_status "Для остановки выполните: docker stop $CONTAINER_NAME"
}

# Основная функция
main() {
    print_status "Запуск Jira Tinder на порту $PORT..."
    
    check_docker
    check_tar_file
    load_image
    check_image
    stop_existing_container
    create_logs_directory
    run_container
    check_health
    show_container_info
    
    print_success "Развертывание завершено успешно!"
}

# Запуск основной функции
main "$@"
