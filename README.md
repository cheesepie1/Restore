# Restore

Restore is a full-stack e-commerce web application built with **ASP.NET Core Web API** and **React + TypeScript**.  
The project is designed as a **portfolio project** to demonstrate real-world full-stack development practices.

---

## Overview

The application provides common e-commerce functionality such as product browsing, basket management, checkout, orders, and user accounts.  
It follows a clean backend architecture and a feature-based frontend structure.

---

## Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- AutoMapper
- Pagination and filtering
- Cloudinary integration for image handling

### Frontend
- React
- TypeScript
- Vite
- Feature-based project structure

### Tooling
- Docker & Docker Compose
- GitHub Actions
- ESLint

---

## Architecture

- RESTful API design with domain-based controllers
- Thin controllers with business logic handled in services
- DTO-based data transfer to isolate domain models
- Centralized pagination and error handling
- Feature-based React architecture for scalability

---

## Features

### Backend
- Product catalog with filtering and pagination
- Basket management
- Order creation and order history
- Payment intent handling
- User account endpoints
- Admin product management
- Centralized exception handling

### Frontend
- Product listing and product details
- Shopping basket flow
- Checkout process
- Order history
- Account management pages
- Admin management interface

---

## Getting Started

### Prerequisites
- .NET SDK
- Node.js & npm
- Docker (optional)

---

### Run Backend

```bash
cd API
dotnet restore
dotnet run


### Run Frontend

```bash
cd client
npm install
npm run dev


### Run with Docker

```bash
docker compose up --build


### What This Project Demonstrates
- Full-stack application development
- Clean REST API design
- Scalable frontend architecture
- Frontend and backend integration
- Real-world e-commerce workflows


### Future Improvements
- Authentication and authorization hardening
- Automated testing
- Performance optimizations and caching
- Deployment configuration



