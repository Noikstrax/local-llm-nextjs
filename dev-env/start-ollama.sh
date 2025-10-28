#!/bin/bash
set -e

echo "Starting Ollama server..."
ollama serve &

echo "Waiting for Ollama to start..."
while ! nc -z localhost 11434; do
  sleep 1
done

echo "Pulling model..."
ollama pull gemma3:1b

echo "Ollama is ready."
wait
