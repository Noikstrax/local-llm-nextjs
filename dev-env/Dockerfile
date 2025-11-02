FROM ollama/ollama:latest

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY start-ollama.sh /app/start-ollama.sh

RUN chmod +x /app/start-ollama.sh

ENTRYPOINT ["/app/start-ollama.sh"]