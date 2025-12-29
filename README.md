# Full Stack Open — Solutions (FSO)

Solutions and notes for the **Full Stack Open** course (University of Helsinki).  
This repo organizes the exercises by part, with frontend and backend projects.

---

## 🎯 Goal

- Complete the course and consolidate fundamentals of **React + Node/Express + TypeScript + Testing + CI/CD**
- Keep a clear history of progress and technical decisions
- Have a “navigable” repository to show real work (commits + structure)

---

## 🧩 Contents

```
.
├── part0/
├── ...
```

### Progress
- [ ] Part 0 — Fundamentals of Web apps
- [ ] Part 1 — Introduction to React
- [ ] Part 2 — Communicating with server
- [ ] Part 3 — Programming a server with NodeJS and Express
- [ ] Part 4 — Testing Express servers, user administration
- [ ] Part 5 — Testing React apps
- [ ] Part 6 — Advanced state management
- [ ] Part 7 — React router, custom hooks, styling, webpack
- [ ] Part 8 — GraphQL
- [ ] Part 9 — TypeScript
- [ ] Part 10 — React Native
- [ ] Part 11 — CI/CD
- [ ] Part 12 — Containers
- [ ] Part 13 — Using relational databases

---

## 🛠️ Stack

- **Frontend**: React, Vite/CRA (depending on the exercise), React Query/Redux (depending on the part)
- **Backend**: Node.js, Express
- **DB**: MongoDB / PostgreSQL (depending on the part)
- **Testing**: Jest, Testing Library, Cypress, Supertest
- **Quality**: ESLint, Prettier
- **DevOps**: Docker, GitHub Actions (depending on the part)

---

## ✅ Requirements

- Node.js (recommended: LTS)
- npm / pnpm / yarn (use whatever is configured per project)
- (Optional) Docker
- (Optional) MongoDB or PostgreSQL depending on the exercise

> If each subproject has its own `package.json`, `cd` into that folder before installing.

---

## 🚀 How to run an exercise

### 1) Frontend (typical example)
```bash
cd part2/phonebook
npm install
npm run dev
```

### 2) Backend (typical example)
```bash
cd part3/phonebook-backend
npm install
npm run dev
```

---

## 🔐 Environment variables (example)

Create a `.env` in the project that needs it:

```env
PORT=3001
MONGODB_URI=your_mongodb_uri
TEST_MONGODB_URI=your_test_mongodb_uri
SECRET=your_jwt_secret
```

> Each part/project can require different variables. Check the local README if present, or the code.

---

## 🧪 Tests (project-dependent)

```bash
npm test
# or
npm run test
```

E2E (if applicable):

```bash
npm run cypress:open
# or
npm run test:e2e
```

---

## 🧹 Lint / Format

```bash
npm run lint
npm run format
```

---

## 🧭 Repo status

This repo is a work in progress.  
If something doesn’t run “out of the box”, it’s usually due to:
- differences between course/exercise versions
- missing `.env`
- updated dependencies vs. the original material

---

## 🙌 Credits

- Course: **Full Stack Open**, University of Helsinki  
  (materials and exercise statements belong to their authors)

---

## 📄 License

Student code: MIT (or your preferred license).  
Course materials/exercise statements: see the course license.
