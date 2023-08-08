#!/bin/bash

# Get the absolute path of the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if the environment file path and Docker Compose file path are provided as arguments
if [ $# -ne 1 ]; then
  echo "Usage: $0 <path_to_env_file>"
  exit 1
fi

# Read the environment file and set the required variables
if [ -f "$SCRIPT_DIR/$1" ]; then
  # Use the 'source' command or '.' depending on the shell
  if [ -n "$BASH_VERSION" ]; then
    source "$SCRIPT_DIR/$1"
  else
    . "$SCRIPT_DIR/$1"
  fi
else
  echo "Environment file not found: $SCRIPT_DIR/$1"
  exit 1
fi

# Specify the environment variables you want to use in Docker Compose
export POSTGRES_CONTAINER_NAME="$PG_CONTAINER_NAME"
export POSTGRES_APP_USER="$API_DB_USER"
export POSTGRES_PASSWORD="$API_DB_PASSWORD"
export POSTGRES_APP_DATABASE="$API_DB_NAME"
export POSTGRES_PORT="$API_DB_PORT"

DOCKER_COMPOSE_FILE="$SCRIPT_DIR/db/docker-compose.yaml"

# Run Docker Compose with the specified environment variables
docker compose -f "$DOCKER_COMPOSE_FILE" up -d
docker ps
