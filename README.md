# StudySync

StudySync is a cloud-inspired academic note and skill-sharing platform built using Dockerized infrastructure, distributed storage architecture, chunk-based file uploading, and load-balanced backend services.

---

# Features

- User Authentication
- Academic Note Sharing
- Skill Showcase System
- Distributed Storage Architecture
- Chunk-Based File Uploading
- Multi-Container Backend Scaling
- NGINX Load Balancing
- Dockerized Infrastructure
- MongoDB Metadata Storage

---

# System Architecture

```text
User Browser
      ↓
Frontend (React)
      ↓
Backend Containers (Scaled)
      ↓
MongoDB
      ↓
Chunk Upload System
      ↓
CloudStorageServer
      ↓
Distributed File Storage
```

---

# How It Works

## File Upload Flow

1. User uploads a file from the dashboard.
2. Frontend splits the file into chunks.
3. Chunks are uploaded to the CloudStorageServer.
4. Storage server merges chunks into the final file.
5. StudySync backend stores metadata in MongoDB.

## File Access

- Actual files are stored separately in the storage server.
- MongoDB stores only:
  - title
  - description
  - file path
  - upload metadata

This architecture is inspired by systems like:
- Google Drive
- AWS S3
- Dropbox

---

# Technologies Used

## Frontend
- React
- TypeScript
- Tailwind CSS

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## DevOps / Cloud
- Docker
- Docker Compose
- NGINX

---

# Prerequisites

Before running the project, install:

- Docker Desktop
- Git
- Node.js (optional for local development)
- MongoDB

---

# Setup Guide

# 1. Clone Repositories

```bash
git clone https://github.com/Sinthia-11628/Project_StudySync.git
```

---

# 2. Start Cloud Storage Server

```bash
cd CloudStorageServer
docker compose up -d --build
```

Storage server runs at:

```text
http://localhost:9000
```

---

# 3. Start StudySync

```bash
cd StudySync
docker compose up -d --build --scale backend=3
```

Application runs at:

```text
http://localhost:8080
```

---

# Usage

## Register User
Create an account using the signup page.

## Upload Notes
- Open Dashboard
- Click "New Note"
- Select PDF or file
- Upload

## File Storage 
- File chunks uploaded to storage server
- Metadata saved in MongoDB

## Open Files
Uploaded files can be opened directly from the dashboard.

## Delete Notes
Deleting notes removes:
- physical file
- MongoDB metadata

---

# Docker Infrastructure

## Containers

| Service | Purpose |
|---|---|
| frontend | React frontend |
| backend | Express API |
| nginx | Reverse proxy + load balancer |
| mongo | Metadata database |
| storage-server | Distributed file storage |

---

# Backend Scaling

Scale backend containers:

```bash
docker compose up --scale backend=5
```

---

# Project Structure

## StudySync

```text
StudySync/
│
├── frontend/
├── backend/
├── nginx/
├── docker-compose.yml
├── .github/
│   └── workflows/
```

## CloudStorageServer

```text
CloudStorageServer/
│
├── chunks/
├── uploads/
├── server.js
├── docker-compose.yml
├── .github/
│   └── workflows/
```

---

# Security 

- Uploaded files are separated from the application backend.
- Metadata and file storage are isolated.
- Chunk upload system reduces upload failure risk.
- Docker containers provide environment isolation.

---

# Current Project Status

Completed:
- Distributed storage
- Chunk upload system
- Dockerized infrastructure
- Backend scaling
- NGINX load balancing
- MongoDB synchronization

Planned:
- Public VM deployment
- CI/CD pipeline
- Monitoring system
- Advanced search functionality

---

# Notes

This project is developed for educational and cloud computing infrastructure learning purposes.

The architecture intentionally demonstrates:
- distributed systems
- virtualization
- scalability
- cloud-native application design

---
