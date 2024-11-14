# Use a stable Python version
FROM python:3.11-slim

ENV PYTHONUNBUFFERED 1
WORKDIR /backend

# Install necessary system dependencies, including zlib1g-dev
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    libc-dev \
    zlib1g-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /backend/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of your application code
COPY . /backend/

# Command to run your application
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
