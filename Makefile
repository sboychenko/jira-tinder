# Jira Tinder Makefile
# Provides convenient commands for building and managing the application

.PHONY: help build build-prod start start-prod stop stop-prod restart restart-prod status logs logs-prod clean clean-prod test health

# Default target
help:
	@echo "Jira Tinder - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  build        Build development Docker image"
	@echo "  start        Start development environment"
	@echo "  stop         Stop development environment"
	@echo "  restart      Restart development environment"
	@echo "  logs         Show development logs"
	@echo ""
	@echo "Production:"
	@echo "  build-prod   Build production Docker image"
	@echo "  start-prod   Start production environment"
	@echo "  stop-prod    Stop production environment"
	@echo "  restart-prod Restart production environment"
	@echo "  logs-prod    Show production logs"
	@echo ""
	@echo "Utility:"
	@echo "  status       Show container status"
	@echo "  health       Check application health"
	@echo "  clean        Clean up development containers and images"
	@echo "  clean-prod   Clean up production containers and images"
	@echo "  test         Run tests"
	@echo ""

# Development commands
build:
	@echo "Building development Docker image..."
	docker-compose build

start:
	@echo "Starting development environment..."
	docker-compose up -d

stop:
	@echo "Stopping development environment..."
	docker-compose down

restart: stop start
	@echo "Development environment restarted"

logs:
	@echo "Showing development logs..."
	docker-compose logs -f

# Production commands
build-prod:
	@echo "Building production Docker image..."
	./build-prod.sh build

start-prod:
	@echo "Starting production environment..."
	./build-prod.sh start

stop-prod:
	@echo "Stopping production environment..."
	./build-prod.sh stop

restart-prod:
	@echo "Restarting production environment..."
	./build-prod.sh restart

logs-prod:
	@echo "Showing production logs..."
	./build-prod.sh logs

# Utility commands
status:
	@echo "Development containers:"
	@docker-compose ps
	@echo ""
	@echo "Production containers:"
	@docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "No production containers running"

health:
	@echo "Checking application health..."
	@curl -s http://localhost:3001/api/health || echo "Application not responding"

clean:
	@echo "Cleaning up development environment..."
	docker-compose down --remove-orphans --volumes
	docker rmi jira-tinder:latest 2>/dev/null || true

clean-prod:
	@echo "Cleaning up production environment..."
	./build-prod.sh clean

# Test commands
test:
	@echo "Running tests..."
	@echo "No tests configured yet"

# Docker image management
images:
	@echo "Available Docker images:"
	@docker images | grep jira-tinder || echo "No jira-tinder images found"

prune:
	@echo "Pruning Docker system..."
	docker system prune -f

# Development setup
dev-setup:
	@echo "Setting up development environment..."
	npm install
	cd client && npm install
	@echo "Development environment setup complete"

# Production setup
prod-setup:
	@echo "Setting up production environment..."
	mkdir -p logs logs/nginx uploads ssl
	@echo "Production directories created"

# Full production deployment
deploy: prod-setup build-prod start-prod
	@echo "Production deployment complete!"

# Quick start for development
quick-start: dev-setup build start
	@echo "Development environment started!"
	@echo "Access the application at: http://localhost:3001"
