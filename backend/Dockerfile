FROM python:3.13.0a3-slim
ENV PYTHONUNBUFFERED 1
WORKDIR /backend
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    libc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /backend/
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . /backend/
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]