PYTHON ?= uv run python

.PHONY: init seed test smoke llm-status clean demo

init: ## create the SQLite schema (idempotent)
	$(PYTHON) -m sales_engine init

seed: ## load synthetic demo data (clears existing data first)
	$(PYTHON) -m sales_engine seed --reset

test: ## run the test suite (offline, no keys needed)
	uv run pytest -q

demo: ## full offline smoke: seed -> qualify -> outreach -> analytics
	$(PYTHON) -m sales_engine seed --reset
	$(PYTHON) -m sales_engine qualify --all
	$(PYTHON) -m sales_engine outreach --opportunity 1 --channel linkedin
	$(PYTHON) -m sales_engine analytics

smoke: demo ## alias for the offline smoke demo

llm-status: ## show local-LLM / OpenAI-compatible endpoint configuration
	$(PYTHON) -m sales_engine llm-status

clean: ## remove venv, database, caches
	rm -rf .venv data __pycache__ .pytest_cache
