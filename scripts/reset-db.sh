#!/bin/bash

echo "🗑️  Dropping all tables and schemas..."
docker exec -e PGPASSWORD=password onlineshop-postgres-1 psql -U postgres -d onlineshop -c "
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
DROP SCHEMA IF EXISTS drizzle CASCADE;
" 2>/dev/null || echo "Note: Some schemas may not exist (this is okay)"

echo "📦 Generating new migration..."
npm run db:generate

echo "🔄 Applying migration..."
# Get the latest migration file
MIGRATION_FILE=$(ls -t drizzle/*.sql 2>/dev/null | head -1)

if [ -z "$MIGRATION_FILE" ]; then
    echo "❌ No migration file found!"
    exit 1
fi

echo "📄 Using migration file: $MIGRATION_FILE"

# Remove comment lines that might cause issues
docker exec -i -e PGPASSWORD=password onlineshop-postgres-1 psql -U postgres -d onlineshop < "$MIGRATION_FILE"

# Get the migration hash from filename (e.g., 0000_sudden_paper_doll.sql -> 0000_sudden_paper_doll)
MIGRATION_HASH=$(basename "$MIGRATION_FILE" .sql)

echo "📝 Setting up Drizzle tracking..."
docker exec -e PGPASSWORD=password onlineshop-postgres-1 psql -U postgres -d onlineshop -c "
CREATE SCHEMA IF NOT EXISTS drizzle;
CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
    id SERIAL PRIMARY KEY, 
    hash text NOT NULL, 
    created_at bigint
);
INSERT INTO drizzle.__drizzle_migrations (hash, created_at) 
SELECT '$MIGRATION_HASH', extract(epoch from now())::bigint 
WHERE NOT EXISTS (SELECT 1 FROM drizzle.__drizzle_migrations WHERE hash = '$MIGRATION_HASH');
"

echo "✅ Database reset and migration complete!"

