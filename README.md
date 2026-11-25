# Hi, I'm Leo 👋

**Full-stack engineer who takes products from idea to production.**
I design, build, deploy and run them end to end: Vue or React on the front, TypeScript on the back, serverless on AWS, and a pipeline that ships on every merge.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue_3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

## 🚀 Some of the products I've been building

### 🎾 [MyRacketClub](https://www.myracketclub.com)

Club management for tennis, padel, squash, pickleball and beach tennis: box leagues, court booking, tournaments and payments. One codebase ships the web app (PWA) and the iOS and Android apps.

### ✏️ [Lupisco](https://www.lupisco.com)

A party game for the living room: a word search on the TV, a drawing pad on every phone, and an AI that tries to guess each drawing. Up to 8 players per room, 10 languages, Android and iOS apps.

### ⚖️ [Conflict Club](https://www.conflict.club)

Real interpersonal conflicts, anonymized by AI. Two sides, one question: who's right? Read both stories and vote, and the crowd decides.

### 🗓️ [Holical](https://www.holical.co.uk)

A trip and holiday planner: one full-year calendar that lines up school terms, bank holidays from any country and your leave allowance, with passwordless magic-link sign-in and sync across devices.

### 🧩 [TheoCube](https://leoolmos.github.io/theocube/)

A Rubik's Cube tutor. Every visit shuffles a brand-new cube and solves it step by step with the beginner layer method, on a 3D cube you can drag to rotate.

Source: [leoolmos/theocube](https://github.com/leoolmos/theocube)

### 🌳 [Heritree](https://www.heritree.co.uk)

A free family tree maker with photos, in 10 languages, right-to-left layouts included. No sign-up and no server: the tree lives in a file on your computer or in your own Google Drive, and exports to PDF or JPG.

### 🗺️ [Ravensbourne Place map](https://leoolmos.github.io/ravensbourne-place-bromley/)

An interactive map of a large housing planning application in Bromley, London. The architects' floor plans are georeferenced into map tiles, all 578 Phase 1 homes are clickable, and the application status refreshes itself every day.

Source: [leoolmos/ravensbourne-place-bromley](https://github.com/leoolmos/ravensbourne-place-bromley)

### ♟️ [PokéChess](https://leoolmos.github.io/pokechess/)

3D chess in the browser where the pieces are Pokémon. Full chess rules, a computer opponent with six difficulty levels, and online games with a friend through a room link.

Source: [leoolmos/pokechess](https://github.com/leoolmos/pokechess)

## 🛠️ How I build and ship

- **Infrastructure as code, always.** AWS CDK, CloudFormation and the Serverless Framework, so every environment can be rebuilt from the repository.
- **CI/CD on GitHub Actions.** Lint, type-check, unit tests and Playwright end-to-end tests run in CI, and a merge deploys the stack.
- **Keyless deploys.** The newer pipelines assume short-lived IAM roles through GitHub OIDC instead of storing AWS keys.
- **Serverless first.** Lambda behind API Gateway, static front ends on S3 and CloudFront with cache invalidation on deploy, and Docker Buildx images pushed to ECR when a container fits better.
- **Mobile from the same codebase.** Capacitor wraps the web apps, and CI compiles the Android and iOS release builds.
- **Automation beyond deploys.** Scheduled workflows take database backups and refresh data every day.

## 🧰 Toolbox

| Area | What I reach for |
| --- | --- |
| Languages | TypeScript, JavaScript, Python, SQL |
| Front end | Vue 3, React, Pinia, Vue Router, Tailwind CSS, Vite, Three.js, Leaflet, PWA |
| Mobile | Capacitor for iOS and Android |
| Back end | Node.js, Fastify, Hono, Drizzle ORM, Zod, WebSockets |
| Data | Aurora PostgreSQL, DynamoDB, S3 |
| AWS | Lambda, API Gateway (HTTP and WebSocket), CloudFront, Cognito, SQS, SNS, SES, Route 53, ACM, ECR, Secrets Manager, Bedrock |
| AI | Claude on Amazon Bedrock, the Anthropic SDK, MCP servers |
| IaC and CI/CD | AWS CDK, CloudFormation, Serverless Framework, GitHub Actions, Docker |
| Testing | Vitest, Playwright |
| Payments | Stripe |
