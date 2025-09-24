# Makefile for marksheet-api development

up:
	docker compose -f docker-compose.dev.yaml up --build -d

down:
	docker compose -f docker-compose.dev.yaml down

logs:
	docker compose -f docker-compose.dev.yaml logs -f

ps:
	docker compose -f docker-compose.dev.yaml ps

restart:
	docker compose -f docker-compose.dev.yaml restart

api:
	docker compose -f docker-compose.dev.yaml exec api sh

postgres:
	docker compose -f docker-compose.dev.yaml exec postgres sh

prune:
	docker volume prune -f

db-reset:
	docker compose -f docker-compose.dev.yaml down -v && docker compose -f docker-compose.dev.yaml up --build

migrate:
	docker compose -f docker-compose.dev.yaml exec api npx drizzle-kit push

