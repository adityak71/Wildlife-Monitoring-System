<div align="center">


  # 🌿 Wildlife Monitoring & Management System

  **A comprehensive, full-stack ecosystem for verifiable wildlife monitoring, anti-poaching patrol logging, and ecological research.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](#)

  **[(Click Here To View Live Demo)](https://forest-mystery.vercel.app/)**

  **[(Click Here To Watch Video Demo)](https://www.linkedin.com/posts/aditya-kumar-lpu_reallifeproject-ashokmittal-raghavchadda-ugcPost-7454243558280155137-Ec8I?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEUALCcBk9rsO7Mt6tzcCBFb-jPKwcm6FBc)**

  **[Click here to read the Complete Technical Architecture & Working Guide](./documentation.md)**
</div>

---

## 🌎 Revolutionizing Conservation Data

Our planet's most vulnerable ecosystems are drowning in fragmented data. When field rangers spot a wounded rhino or uncover an illegal poaching camp, that data often dies on paper logs or gets lost in unverified messaging apps. For researchers studying these environments, relying on outdated or unauthenticated data can set critical conservation efforts back by years.

The **Wildlife Monitoring System** is built to solve this. 

It is a beautifully designed, highly secure, fully digital ecosystem built on the modern MERN/PostgreSQL stack. It puts an intuitive tracking tool directly into the hands of boots-on-the-ground rangers, allowing them to snap GPS-tagged photos of incidents in seconds. That data is blasted instantly to a central Administration Dashboard via WebSockets, where chief wardens can verify the sightings to maintain 100% data purity. Once verified, independent biologists and academic researchers are granted read-only access to this pristine database, empowering them to plot migration trends, monitor population health, and publish studies based on undeniable truths.

### ✨ Key Features

- **🛡️ Strict Role-Based Access Control (RBAC):** Distinct, unbreachable workflows for Admins, Conservationists, and read-only Researchers.
- **📸 Async Media Cloud Uploads:** Rapid incident reporting utilizing Multer and Cloudinary edge CDNs for heavy media.
- **📍 Geolocated Incident Mapping:** Track the exact Latitude/Longitude of patrols, poached traps, and animal migrations.
- **🔐 Prisma ORM & End-to-End Validation:** Zod schema validation combined with Prisma query engines ensures 0% SQL injection vulnerability.
- **⚡ Real-Time Socket.io Overlays:** Instant WebSocket notifications blast to field operatives the moment an Administration verifies their incident.
- **📊 Dynamic Analytics Dashboard:** Recharts aggregates heavy PostgreSQL metric data into beautiful, visual, actionable UI cards.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TailwindCSS, Recharts |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database & ORM** | PostgreSQL (Neon), Prisma ORM |
| **Cloud Media** | Cloudinary API |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs, Helmet, Zod |
| **Real-Time Comm.** | Socket.io |

---

## 🚀 Getting Started

Follow these steps to run the application perfectly on your local machine.

### Prerequisites
- Node.js (v18+)
- A [Neon.tech](https://neon.tech/) PostgreSQL Database
- A [Cloudinary](https://cloudinary.com/) Account

### 1. Clone the Repository
```bash
git clone https://github.com/adityak71/Wildlife-Monitoring-System.git
cd Wildlife-Monitoring-System
```

### 2. Environment Setup
Create a `.env` file in the `Wildlife-Backend` directory:
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database & Authentication
DATABASE_URL="postgresql://[paste your Neon connection string]"
JWT_SECRET="[paste a secure random string]"

# Cloudinary
CLOUDINARY_CLOUD_NAME="[paste your cloud name]"
CLOUDINARY_API_KEY="[paste your api key]"
CLOUDINARY_API_SECRET="[paste your api secret]"
```

### 3. Install Dependencies & Initialize Database
```bash
# Initialize the Backend
cd Wildlife-Backend
npm install
npx prisma db push

# Initialize the Frontend
cd ../Wildlife-frontend
npm install
```

### 4. Run the Application
Open two terminal windows to run both servers concurrently:

**Terminal 1 (Backend):**
```bash
cd Wildlife-Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Wildlife-frontend
npm run dev
```
Navigate to `http://localhost:5173` to view the app!

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License.

---

## 📚 Technical & Architecture Documentation

Curious about how the multi-part photo uploads work without stalling the server? Or how we utilized Prisma's Cascading Deletes to keep the database clean?

---
<div align="center">
  <b style="font-size: 25px; color: green;">Developed thoughtfully by</b>
  <br>
  <b>Sachin Kumar (Github: devSachinkr)</b>
  <br>
  <b>Aditya Kumar (Github: adityak71)</b>
  <br>
  <b>Nitish Kumar (Github: nitishkumarvis8-wq)</b>
  
</div>
