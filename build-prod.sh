#!/bin/bash

# Jira Tinder Production Build Script
# This script builds and runs the production version of the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if required files exist
check_files() {
    local required_files=("Dockerfile" "docker-compose.prod.yml" "nginx.conf" "server.js" "client/package.json")
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    print_success "All required files found"
}

# Function to create necessary directories
create_directories() {
    local dirs=("logs" "logs/nginx" "uploads" "ssl")
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        fi
    done
}

# Function to stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    print_success "Existing containers stopped"
}

# Function to build the application
build_app() {
    print_status "Building Jira Tinder production image..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    print_success "Production image built successfully"
}

# Function to start the application
start_app() {
    print_status "Starting Jira Tinder production application..."
    docker-compose -f docker-compose.prod.yml up -d
    print_success "Application started successfully"
}

# Function to check application health
check_health() {
    print_status "Checking application health..."
    
    # Wait for application to start
    sleep 10
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
            print_success "Application is healthy and responding on port 3001"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts: Application not ready yet, waiting..."
        sleep 5
        ((attempt++))
    done
    
    print_error "Application failed to start within expected time"
    return 1
}

# Function to show application status
show_status() {
    print_status "Application status:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    print_status "Container logs (last 20 lines):"
    docker-compose -f docker-compose.prod.yml logs --tail=20
}

# Function to show usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  build     Build the production image only"
    echo "  start     Start the application (assumes image is built)"
    echo "  stop      Stop the application"
    echo "  restart   Restart the application"
    echo "  status    Show application status"
    echo "  logs      Show application logs"
    echo "  clean     Clean up containers and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Full build and start"
    echo "  $0 build        # Build only"
    echo "  $0 start        # Start only"
    echo "  $0 status       # Show status"
}

# Function to clean up
clean_up() {
    print_status "Cleaning up containers and images..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans --volumes
    docker rmi jira-tinder:production 2>/dev/null || true
    print_success "Cleanup completed"
}

# Main script logic
main() {
    local action=${1:-full}
    
    case $action in
        "build")
            check_docker
            check_files
            create_directories
            build_app
            ;;
        "start")
            check_docker
            create_directories
            start_app
            check_health
            ;;
        "stop")
            check_docker
            stop_containers
            ;;
        "restart")
            check_docker
            stop_containers
            start_app
            check_health
            ;;
        "status")
            check_docker
            show_status
            ;;
        "logs")
            check_docker
            docker-compose -f docker-compose.prod.yml logs -f
            ;;
        "clean")
            check_docker
            clean_up
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "full")
            check_docker
            check_files
            create_directories
            stop_containers
            build_app
            start_app
            check_health
            show_status
            ;;
        *)
            print_error "Unknown action: $action"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
