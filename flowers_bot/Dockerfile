FROM python:3.10-slim

# Set working directory
WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
# Install dependencies and run migrations

RUN pip install --no-cache-dir -r requirements.txt
# Copy application code
COPY . .

# Run FastAPI app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
