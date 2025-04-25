# Use a lightweight Python image
FROM python:3.12-alpine

# Set working directory
WORKDIR /app

# Copy requirements file first for caching
COPY requirements.txt .

# Install dependencies
RUN python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt

# Copy the rest of the application
COPY . /app/

# Ensure the application is importable
ENV PYTHONPATH=/app

# Set Python output to be unbuffered (better logging)
ENV PYTHONUNBUFFERED=1

# Expose the fastapi application port
EXPOSE 8000