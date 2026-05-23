# Finance Management Application

A full-stack finance management project built with a Java Spring Boot backend and a React + Vite frontend.

## Repository Structure

- `backend/` — Spring Boot application providing REST APIs for transactions and categories.
- `frontend/` — React application built with Vite for the user interface.

## Technologies

- Backend: Java 21, Spring Boot, Spring Data JPA, H2 database, Maven
- Frontend: React, Vite, React Router, Recharts

## Prerequisites

- Java 21 or later installed and configured in `PATH`
- Node.js 20+ installed
- npm package manager

## Setup

### Backend

1. Open a terminal in `backend/`.
2. Install dependencies and build the project:
   ```powershell
   .\mvnw.cmd clean package
   ```

### Frontend

1. Open a terminal in `frontend/`.
2. Install npm dependencies:
   ```powershell
   npm install
   ```

## Running the Application Locally

Run the backend and the frontend in separate terminals.

### Start backend

From `backend/`:
```powershell
.\mvnw.cmd spring-boot:run
```

This starts the Spring Boot API server.

### Start frontend

From `frontend/`:
```powershell
npm run dev
```

This starts the Vite development server and opens the React UI.

## Production Build

### Backend build

From `backend/`:
```powershell
.\mvnw.cmd clean package
```

The packaged JAR will be available in `backend/target/`.

### Frontend build

From `frontend/`:
```powershell
npm run build
```

The production frontend files are generated in `frontend/dist/`.

## Useful Commands

- `backend/.\mvnw.cmd spring-boot:run` — run backend in development mode
- `backend/.\mvnw.cmd clean package` — build backend artifact
- `frontend/npm run dev` — start frontend development server
- `frontend/npm run build` — create frontend production build
- `frontend/npm run preview` — preview frontend production build locally

## Notes

- The backend currently uses an embedded H2 database for runtime data storage.
- If you want to connect a different database, update `backend/src/main/resources/application.properties`.
- Keep both backend and frontend running together to use the full application.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit changes with clear messages.
4. Open a pull request describing your updates.

## License

Specify license information here if needed.
