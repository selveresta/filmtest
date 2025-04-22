# 🎬 FilmTest API

A RESTful Node.js + TypeScript backend for managing movies, actors, and user sessions.  
Uses Express, Sequelize (with SQLite), and session‑based auth via Passport.js.

---

## 📋 Prerequisites

-   **Node.js** ≥ 16
-   **npm** ≥ 8
-   **Docker** & **Docker Compose** (optional, but recommended)

---

## Command to start

`docker run --name movies -p 7000:7000 selveresta/movies:latest`

---

## Github

`https://github.com/selveresta/filmtest`

---

## ⚙️ Environment

1. Copy the example env file:
    ```bash
    cp .env.example .env
    ```
2. Edit `.env` and fill in values:
    ```ini
    APP_PORT=8000
    SESSION_SECRET=your_session_secret_here
    NODE_ENV=production
    ```

> By default, the SQLite database lives in `./db/database.sqlite`.

---

## 🚀 Running Locally

1. **Install dependencies**
    ```bash
    npm ci
    ```
2. **Build TypeScript**
    ```bash
    npm run build
    ```
3. **Start server**
    ```bash
    npm start
    ```
4. **Browse**  
   The API is available at `http://localhost:8000/api/v1`

---

## 🛠️ Development Mode

For live‑reload + debugging:

```bash
npm run dev
```

This runs `ts-node` + `nodemon` on `src/app.ts`, so file changes restart the server automatically.

---

## 🐳 Docker

Build and run via Docker Compose:

```bash
docker-compose up --build
```

-   **App** listens on `localhost:8000`
-   The host folder `./db` is mounted as `/app/db`, so your SQLite file persists.

To stop and remove containers:

```bash
docker-compose down
```

---

## 📂 Project Structure

```
.
├── src                # TypeScript source
│   ├── controllers/   # Express route handlers
│   ├── middlewares/   # auth & error handlers
│   ├── models/        # Sequelize models
│   ├── services/      # business logic
│   ├── router/        # route definitions
│   ├── dtos/          # api DTO
│   ├── exceptions/    # heplers for exceptions
│   ├── config/        # Passport, etc.
│   ├── db.ts          # Sequelize init
│   └── app.ts         # Express app bootstrap
├── types/             # custom TypeScript types
├── db/                # SQLite database file
├── dist/              # compiled output (ignored in Git)
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔑 Authentication

-   **Register**  
    `POST /api/v1/users`  
    Body: `{ email, name, password, confirmPassword }`

-   **Login**  
    `POST /api/v1/sessions`  
    Body: `{ email, password }`  
    → sets a session cookie

-   **Protected routes**  
    Include the session cookie in subsequent requests to `/api/v1/movies`, etc.

-   **Logout**  
    `DELETE /api/v1/sessions`

---

## 🎥 Movies API

-   **List**: `GET    /api/v1/movies?title=&actor=&sort=&order=&limit=&offset=`
-   **Create**: `POST   /api/v1/movies`  
    Body: `{ title, year, format, actors: string[] }`
-   **Get**: `GET    /api/v1/movies/:id`
-   **Update**: `PATCH  /api/v1/movies/:id`
-   **Delete**: `DELETE /api/v1/movies/:id`
-   **Import**: `POST   /api/v1/movies/import`  
    Upload a multipart file field named `movies`.

---

## 📝 Notes

-   On startup, Sequelize runs `sequelize.sync({ alter: true })`, so no manual migrations are needed.
-   To change the DB path, edit the `storage` option in `src/db.ts`.

---

Happy coding! 🎉
