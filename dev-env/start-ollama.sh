#!/bin/bash


set -e

echo "Starting Ollama server..."
ollama serve &

echo "Waiting for Ollama to start..."
while ! curl -s http://localhost:11434 > /dev/null; do
  sleep 1
done

echo "Pulling model..."
ollama pull gemma3:1b
ollama run gemma3:1b

echo "Ollama is ready."
wait
