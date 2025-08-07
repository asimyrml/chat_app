# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# sistem bağımlılıkları (ör. Pillow)
RUN apt-get update && apt-get install -y build-essential libjpeg-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY chat_project/ .

# collectstatic ve migrate’i entrypoint’te hallederiz
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "chat_project.asgi:application"]
