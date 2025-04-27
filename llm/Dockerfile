# Use a lightweight Python image
FROM python:3.12

# Set working directory
WORKDIR /app

# Copy requirements file first for caching
COPY requirements.txt .

# Install dependencies
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Copy the rest of the application
COPY . /app/

# Ensure the application is importable
ENV PYTHONPATH=/app

# Set Python output to be unbuffered (better logging)
ENV PYTHONUNBUFFERED=1

# Expose the Flask application port
EXPOSE 5000

# Run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]
