# 📊 Client Management Dashboard

A modern, full-stack application designed to help businesses efficiently manage client data, track project statuses, and maintain client communication history. This dashboard provides a centralized and intuitive interface for client relationship management (CRM) tailored for small to medium-sized teams.

---

## 🛠️ Tech Stack Used

This project is built using a modern MERN stack architecture, ensuring a fast, scalable, and responsive application.

| Area | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React** (with **Vite**) | A JavaScript library for building user interfaces, utilized for a dynamic and single-page application experience. |
| **Styling** | **Tailwind CSS** | A utility-first CSS framework for rapidly styling the application with a responsive and clean design. |
| **Backend** | **Node.js** & **Express** | A JavaScript runtime environment and a fast, unopinionated web framework for the server-side logic and RESTful API. |
| **Database** | **MongoDB** | A NoSQL database used for flexible and scalable data storage, including client profiles and project details. |

---

## ⚙️ Installation Steps

Follow these steps to get a local copy of the project running on your machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (version 16+)
* [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
* [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a connection string for a cloud-hosted service (e.g., MongoDB Atlas).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/arpantech11/clientManagementDashboard.git](https://github.com/arpantech11/clientManagementDashboard.git)
    cd clientManagementDashboard
    ```

2.  **Install dependencies (Frontend & Backend):**

    * Install Server dependencies:
        ```bash
        npm install
        # or cd server && npm install if your project has separate folders
        ```
    * Install Client dependencies:
        ```bash
        cd client
        npm install
        cd ..
        ```

3.  **Configure Environment Variables:**

    * Create a file named `.env` in the root directory (and potentially another in the `client` directory if needed).
    * Add your configuration. At minimum, you will need the database connection string:
        ```
        # .env (in root directory)
        PORT=5000
        MONGO_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
        JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY"
        ```

4.  **Run the application:**

    * Start the backend server (from the root directory):
        ```bash
        npm run server
        ```
    * In a new terminal, start the frontend client (from the root directory or `client` folder):
        ```bash
        npm run client
        ```

The application should now be running on [http://localhost:3000](http://localhost:3000) (or the port specified in your client configuration).

---

## 🖼️ Screenshots 
<img width="1438" height="820" alt="Screenshot 2025-11-04 at 10 23 15 AM" src="https://github.com/user-attachments/assets/fc2e8287-4cc0-404e-8d16-6b8a48e26f13" />

<img width="1440" height="818" alt="Screenshot 2025-11-04 at 10 23 37 AM" src="https://github.com/user-attachments/assets/52d6d633-958f-4f54-8926-30dd50566716" />


| Dashboard Overview | Client Profile View |
| :---: | :---: |
|  |  |
| **Example Dashboard View** | **Example Client Details Page** |

---
