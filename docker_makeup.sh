#!/bin/bash

set -e

server_up() {
    echo "Server up..."
    docker-compose pull
    docker stop makeup_container || true
    docker rm makeup_container || true
    docker stop makeup_client_container || true
    docker rm makeup_client_container || true
    docker-compose up -d
}

start_containers() {
    echo "Containers start..."
    docker-compose up -d
}

stop_containers() {
    echo "Containers stop..."
    docker stop makeup_container || true
    docker rm makeup_container || true
    docker stop makeup_client_container || true
    docker rm makeup_client_container || true
}

restart_containers() {
    echo "Containers restart..."
    docker stop makeup_container || true
    docker rm makeup_container || true
    docker stop makeup_client_container || true
    docker rm makeup_client_container || true
    docker-compose up -d
}

echo "Choose action:"
echo "1. Server up"
echo "2. Containers start"
echo "3. Containers stop"
echo "4. Containers restart"
read -p "Enter action number: " action

case $action in
    1)
        server_up
        ;;
    2)
        start_containers
        ;;
    3)
        stop_containers
        ;;
    4)
        restart_containers
        ;;
    *)
        echo "Invalid action number!"
        exit 1
        ;;
esac
