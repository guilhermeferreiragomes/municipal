# 🏙️ MuniciPal: Smart City Incident Management Platform

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Quarkus](https://img.shields.io/badge/Quarkus-4695EB?style=for-the-badge&logo=quarkus&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

> A full-stack, multi-tier ecosystem designed to streamline the reporting, triage, and resolution of urban incidents, fostering a more responsive and transparent smart city environment.

---

## 📖 Overview

MuniciPal is a robust software engineering project built to bridge the gap between citizens and municipal services. It allows citizens to easily report local issues (like potholes or broken streetlights) using their smartphones, provides city administrators with a powerful web dashboard for real-time triage, and equips field technicians with a dedicated mobile app to resolve tasks efficiently using GPS navigation.

This project was developed as a Proof of Concept (PoC) for a Software Engineering academic course, focusing on a clean 3-tier architecture, scalable RESTful APIs, and cross-platform mobile development.

---

## ✨ Key Features

### 👤 For Citizens (Mobile App)
* **Real-Time Reporting:** Submit incidents with exact native GPS coordinates and categories.
* **History & Status Tracking:** Monitor previously reported tickets.
* **In-App Notifications:** Receive native alerts when the municipality successfully resolves a reported issue.

### 👨‍💻 For Administrators (Web Dashboard)
* **Centralized Analytics:** Visual data representation of city-wide incidents.
* **Dynamic Triage:** Filter, manage, and assign urgency levels (High, Medium, Low) to incoming tickets.
* **Map Integration:** View exact incident locations directly on the dashboard.

### 👷 For Technicians (Mobile App)
* **Task Management:** Receive a prioritized list of assigned incidents.
* **Native Navigation:** One-click integration with Google Maps to navigate directly to the incident site.
* **Status Updates:** Mark incidents as "Resolved" straight from the field.

---

## 🏗️ Architecture

MuniciPal implements a strict **3-Tier Client-Server Architecture**:

1. **Presentation Layer (Frontend):** * Two React Native (Expo) mobile applications (Citizen & Technician).
   * One React.js Single Page Application (SPA) for the Web Dashboard.
   * Styled cleanly with Tailwind CSS.
2. **Business Logic Layer (Backend):** * A RESTful API built with **Java** and the cloud-native **Quarkus** framework.
3. **Data Layer (Database):** * A **MongoDB** NoSQL database, integrated via the **Panache** (Active Record) pattern to eliminate boilerplate code, completely isolated inside a **Docker** container.

---

## 📸 Screenshots & Demo


| Citizen Reporting | Admin Dashboard | Technician Maps |
| :---: | :---: | :---: |
| <img src="https://i.postimg.cc/yYydw05L/b808ea7dedf.png" width="250"/> | <img src="https://i.postimg.cc/8CJTPvyb/c5930e27717.png" width="400"/> | <img src="https://i.postimg.cc/xT6Qv5Bn/b808ea7dedf-(1).png" width="250"/> |

---

---

## 👤 Author

Developed with 💛 by **Guilherme Gomes**. 

🎓 *This platform was built as a Software Engineering university project and proudly achieved a final grade of **26 out of 30**.*

If you want to know more about this or other projects, feel free to reach out via [LinkedIn](https://www.linkedin.com/in/o-teu-perfil-aqui/).
