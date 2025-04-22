FROM python:3.12-alpine

WORKDIR /app

RUN pip3 install --no-cache-dir poetry

ENV POETRY_VIRTUALENVS_CREATE=false

COPY pyproject.toml poetry.lock* /app/

RUN poetry install --no-root --no-interaction --no-ansi

COPY . /app/

ENV PYTHONPATH=/app

ENV PYTHONUNBUFFERED=1

EXPOSE 8001
