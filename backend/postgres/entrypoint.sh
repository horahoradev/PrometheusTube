#!/bin/bash
set -euo pipefail

# Run database setup after postgres starts (meaning, this runs in the background)
{
  until pg_isready -h localhost -U $POSTGRES_USER; do
    echo "Waiting for postgres to start..."
    sleep 1
  done

  # dodge the post-init restart lol
  sleep 20

  echo "Creating databases"
  # TODO(ivan): how do we want to make this so it runs only once
  psql --user=$POSTGRES_USER -a -f /postgres/create_db.sql
} &

exec docker-entrypoint.sh postgres
