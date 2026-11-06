.PHONY: help setup up down restart logs ps clean dev-db db-migrate db-seed db-studio lint test build format check

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: ## First time: create .env and install npm dependencies
	@test -f .env || (cp .env.example .env && echo 'Created .env : edit the values marked CHANGE')
	cd backend && npm ci && npx prisma generate
	cd frontend && npm ci

up: ## Build and start the full stack (HTTPS)
	docker compose up --build -d
	@echo 'Application: https://localhost:8443   API docs: https://localhost:8443/api/docs'

down: ## Stop the stack
	docker compose down

restart: ## Restart the stack
	docker compose restart

logs: ## Follow the logs (all services)
	docker compose logs -f --tail=100

ps: ## List running containers
	docker compose ps

clean: ## Stop and DELETE all data (database, uploads)
	docker compose down -v

dev-db: ## Start only PostgreSQL (for local development with hot reload)
	docker compose up -d db

db-migrate: ## Create/apply a migration while developing (asks for a name)
	cd backend && npm run db:migrate

db-seed: ## Insert demo data into the local database
	cd backend && npm run db:seed

db-studio: ## Open Prisma Studio (visual database browser)
	cd backend && npm run db:studio

lint: ## Lint backend and frontend
	cd backend && npm run lint
	cd frontend && npm run lint

test: ## Run backend tests
	cd backend && npm test

build: ## Type-check and build both apps
	cd backend && npm run build
	cd frontend && npm run build

format: ## Format all code with Prettier
	cd backend && npm run format
	cd frontend && npm run format

check: lint test build ## Everything CI runs: do this before opening a pull request
