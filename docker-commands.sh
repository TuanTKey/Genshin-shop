#!/bin/bash

# ===================================
# GENSHIN SHOP - DOCKER COMMANDS
# ===================================

# Build images
build() {
    echo "🏗️  Building Docker images..."
    docker-compose build --no-cache
}

# Start all services
start() {
    echo "🚀 Starting all services..."
    docker-compose up -d
    echo "✅ Services started!"
    echo "Frontend: http://localhost"
    echo "Backend: http://localhost:5000"
}

# Stop all services
stop() {
    echo "🛑 Stopping all services..."
    docker-compose down
}

# Restart all services
restart() {
    echo "🔄 Restarting services..."
    docker-compose restart
}

# View logs
logs() {
    echo "📋 Viewing logs..."
    docker-compose logs -f --tail=100
}

# Check status
status() {
    echo "📊 Services status:"
    docker-compose ps
}

# Clean everything
clean() {
    echo "🧹 Cleaning up..."
    docker-compose down -v
    docker system prune -af
    echo "✅ Cleanup complete!"
}

# Seed database
seed() {
    echo "🌱 Seeding database..."
    docker-compose exec backend node seedAdmin.js
    docker-compose exec backend node seed.js
    echo "✅ Database seeded!"
}

# Backup database
backup() {
    echo "💾 Backing up database..."
    docker-compose exec mongodb mongodump --out=/data/backup
    docker cp genshin-mongodb:/data/backup ./backup_$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup completed!"
}

# Show help
help() {
    echo "Available commands:"
    echo "  build   - Build Docker images"
    echo "  start   - Start all services"
    echo "  stop    - Stop all services"
    echo "  restart - Restart all services"
    echo "  logs    - View logs"
    echo "  status  - Check services status"
    echo "  clean   - Clean up everything"
    echo "  seed    - Seed database with sample data"
    echo "  backup  - Backup MongoDB database"
    echo "  help    - Show this help"
}

# Main
case "$1" in
    build) build ;;
    start) start ;;
    stop) stop ;;
    restart) restart ;;
    logs) logs ;;
    status) status ;;
    clean) clean ;;
    seed) seed ;;
    backup) backup ;;
    help) help ;;
    *) 
        echo "Usage: $0 {build|start|stop|restart|logs|status|clean|seed|backup|help}"
        exit 1
        ;;
esac