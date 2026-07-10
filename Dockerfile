# Stage 1: Build the React frontend
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve with Flask backend
FROM python:3.11-slim
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
# Copy the built frontend static files to Flask's static folder
COPY --from=frontend-builder /frontend/dist ./static

# Run a self-test to verify the backend imports, initializes SQLite, and seeds successfully during build
RUN python -c "from app import app; print('Flask import & DB initialization self-test passed!')"

EXPOSE 5000
ENV FLASK_ENV=production


# Run with gunicorn, dynamically binding to the PORT environment variable (default 5000)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 app:app"]

