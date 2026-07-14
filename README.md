# Campus OLX

Campus OLX is a secure, college-exclusive online marketplace designed for student-to-student transactions of semester-specific academic resources. The platform allows verified students to list, browse, search, and exchange academic items such as textbooks, calculators, engineering drafters, lab coats, and other essentials within their campus community.

---

## 1. Project Overview

Campus OLX addresses the friction of peer-to-peer commerce in university environments. In a typical academic cycle, students purchase materials that are only needed for a single semester. Once the semester ends, these assets gather dust, while the incoming cohort of junior students pays full price for the same items. 

By restricting registration to verified institutional emails, Campus OLX provides a trusted, closed-loop environment where students can securely buy and sell items directly on campus. This peer-to-peer exchange reduces academic expenses, promotes sustainability, and eliminates the safety concerns and logistics overhead associated with public marketplaces.

---

## 2. Problem Statement

* **Temporary Resource Utility:** Academic resources (textbooks, calculators, lab equipment) are expensive and often utilized for only a 4-to-5-month semester.
* **Economic Inefficiency:** Sellers have no efficient way to liquidate their unused academic assets, while buyers struggle to find affordable, pre-owned alternatives.
* **Unstructured Informal Channels:** Existing workarounds, such as unofficial WhatsApp groups or bulletin boards, are unstructured, unsearchable, and lack transactional security or user verification.
* **Lack of Trust & Verification:** Open marketplaces present safety risks and logistical hurdles, requiring a verified, campus-only user directory to guarantee trust.

---

## 3. Key Features

* **Verified Institutional Registration** 
* **Two-Step Email Verification** 
* **JWT-Based Authentication**
* **Product Listing & Management**
* **Cloud-based Image Storage**
* **Targeted Search & Filters**
* **Direct Seller Contact & Inbox**
* **Real-Time Bidirectional Messaging**
* **Interactive Profile Management**
* **Seller Authorization Protections** 
---

## 4. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Single Page Application (SPA) user interface development |
| **Frontend Router** | React Router DOM | Declarative client-side routing and route guarding |
| **Frontend Styling** | TailwindCSS | Utility-first CSS styling and responsive layout designs |
| **HTTP Client** | Axios | Async HTTP requests, response handling, and header interception |
| **Real-Time Client** | Socket.io-client | Event-driven WebSocket client for instant messaging |
| **Backend Runtime** | Node.js | Server-side runtime environment |
| **Web Framework** | Express.js | REST API routing, controllers, and middleware configuration |
| **Real-Time Server** | Socket.IO | Persistent full-duplex communication and room management |
| **Database** | MongoDB | Document database for highly flexible, document-oriented storage |
| **Object Modeling** | Mongoose ODM | Schema enforcement, data validation, and model relationships |
| **Authentication** | JSON Web Tokens (JWT) | Stateless session authorization tokens |
| **Password Security** | Bcryptjs | Salting and hashing credentials before database storage |
| **File Upload** | Multer | Multipart/form-data middleware for handling file uploads |
| **Media Storage** | Cloudinary | Cloud-based media storage and image optimization API |
| **Email Gateway** | Nodemailer | SMTP client engine for sending registration verification OTPs |

---

## 5. System Architecture

```mermaid
flowchart TD
    subgraph Client Layer [Frontend Client - React & Vite]
        UI[Tailwind UI Components]
        AxiosClient[Axios API Client]
        SocketClient[Socket.IO Client]
    end

    subgraph API Layer [Backend Server - Express & Node.js]
        Server[Express Server]
        AuthMW[Auth Middleware]
        SellerMW[Seller Verification Middleware]
        UploadMW[Multer Upload Middleware]
        SocketServer[Socket.IO Server]
        Controllers[Controller Logic]
    end

    subgraph Data & Storage Layer
        DB[(MongoDB Database)]
        CloudinaryService[Cloudinary API]
        SMTP[Nodemailer SMTP Server]
    end

    UI --> AxiosClient
    UI <--> SocketClient
    
    AxiosClient -->|HTTPS REST Request| Server
    SocketClient <-->|WebSocket Events| SocketServer
    
    Server --> AuthMW
    Server --> SellerMW
    Server --> UploadMW
    
    AuthMW --> Controllers
    SellerMW --> Controllers
    UploadMW --> CloudinaryService
    
    Controllers --> Mongoose[Mongoose ODM]
    Mongoose <--> DB
    Controllers --> SMTP
```

---

## 6. Application Data Flow

1. **User Interaction:** A user interacts with the React frontend (e.g., searches for a textbook, updates a profile, or posts a new item).
2. **API Request (REST):** The client dispatches an HTTP request via Axios. For protected paths, an interceptor automatically appends the user's JWT from `localStorage` into the `Authorization` header as `Bearer <token>`.
3. **Server Route Entry:** The request hits the Express application.
4. **Middleware Processing:** 
   * **Authentication Guard (`authMiddleware.js`):** Checks for the token, verifies it against the server secret, extracts the user ID, and attaches it to `req.user`.
   * **Ownership Guard (`isSeller.js`):** Intercepts modifications on specific items, checks MongoDB to verify that `req.user` matches the item's `seller` ID, and loads the item into `req.item` if valid.
   * **File Processing (`uploadMiddleware.js`):** Uploads incoming images directly to Cloudinary and passes the resulting image URLs inside the request object.
5. **Controller Execution:** The matching controller retrieves the parsed inputs, validates them, and queries the database via Mongoose models.
6. **Mongoose Transactions:** Documents are fetched, updated, or inserted inside MongoDB.
7. **JSON Response Transmission:** The backend responds with a JSON payload and HTTP status code.
8. **UI State Update:** The React frontend receives the response, updates the React context/state variables, and re-renders the UI to display the new data.

---

## 7. Authentication and Authorization

### User Verification and Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Client
    participant API as Express API
    participant DB as MongoDB
    participant SMTP as Nodemailer SMTP

    Student->>API: POST /api/auth/register (Credentials + CVR Email)
    Note over API: Verify email domain ends with @cvr.ac.in
    API->>API: Generate Hashed Password & 6-Digit OTP
    API->>DB: Save Temp Registration info to Otp Schema
    API->>SMTP: Dispatch verification code email
    API-->>Student: Success response (OTP sent)
    
    Student->>API: POST /api/auth/verify-otp (Email + Code)
    API->>DB: Find active Otp Record
    Note over API: Validate OTP code & expiration window
    API->>DB: Create verified User Document & Delete Otp Record
    API-->>Student: Success message (Registration complete)

    Student->>API: POST /api/auth/login (Email + Password)
    API->>DB: Retrieve User document by email
    API->>API: Compare password hashes via bcrypt
    API->>API: Generate JWT containing user ID
    API-->>Student: Return JWT token
```

### Key Security Implementations:
* **Stateless Token validation:** Routes requiring verification are wrapped in the `protect` middleware. The token must be sent in the `Authorization: Bearer <token>` header.
* **Granular Owner Access:** To protect listings, the server applies `isSeller` middleware before any update, deletion, or transaction-state changes. This ensures that only the listing seller can modify their item's parameters.

---

## 8. Real-Time Chat Architecture

Real-time chat is decoupled from the typical request-response API flow by establishing a persistent full-duplex WebSocket connection.

### WebSocket Connection Management:
1. **Instantiation:** On application load, if a token is present, the frontend connects to the Socket.IO server utilizing the server's root URL.
2. **Registration (`registerUser`):** Once authenticated, the frontend emits a `registerUser` event passing the user's database ID. The server puts this socket instance into a private room named `user_<userId>` to receive targeted unread message notifications.
3. **Room Association (`joinChat`):** When a user clicks a chat, they emit `joinChat` passing the specific `chatId`. The server maps the socket to a room identifier matching the `chatId`.
4. **Message Transmission (`sendMessage`):** When a message is sent, the client emits `sendMessage` with the payload:
   ```json
   {
     "chatId": "...",
     "content": "...",
     "token": "JWT..."
   }
   ```
5. **Server Verification & Persistence:** The server catches `sendMessage`, decrypts the JWT within the payload to extract the sender's identity, saves the new message to MongoDB, and updates the parent Chat document's `latestMessage`.
6. **Broadcasting (`receiveMessage`):** The server broadcasts the populated message object back to all clients connected to the `chatId` room.
7. **Unread Notifications (`newMessageNotification`):** If a user is online but not currently active in that specific chat room, the server emits a `newMessageNotification` to the participant's specific user room (`user_<recipientId>`), triggering an increment to their unread notification badge.

---

## 9. Database Design

### Schema Model Definitions

#### 1. User
Stores member profiles.
* **Fields:** `name`, `email` (unique), `password`, `department`, `bio`, `avatarUrl`, `isVerified` (default: false), `phone`, `year`, `section`.
* **Timestamps:** Automatic creation and modification tracking.

#### 2. Item
Contains listings posted by sellers.
* **Fields:** `title`, `description`, `price`, `category`, `semester`, `department`, `images` (string array of Cloudinary URLs), `seller` (ObjectId, ref: 'User'), `status` (enum: `["active", "sold", "removed"]`, default: `active`).

#### 3. Chat
Acts as a session directory connecting buyers, sellers, and items.
* **Fields:** `item` (ObjectId, ref: 'Item', required), `users` (Array of ObjectIds, ref: 'User'), `latestMessage` (ObjectId, ref: 'Message').

#### 4. Message
Persists chat messages.
* **Fields:** `chatId` (ObjectId, ref: 'Chat', required), `sender` (ObjectId, ref: 'User', required), `content` (String, required).

#### 5. Otp
Handles temporary user registration records pending email verification.
* **Fields:** `email`, `otp`, `expiresAt` (has TTL index set to auto-expire documents on expiration), `name`, `hashedPassword`, `department`.

---


## 10. Project Folder Structure

```text
Campus-OLX/
├── backend/
│   ├── config/
│   │   └── cloudinary.js           # Cloudinary SDK credentials configuration
│   ├── controllers/
│   │   ├── authController.js       # Handles sign-up, verification, and logins
│   │   ├── itemController.js       # Manages item CRUD, filters, and uploads
│   │   └── userController.js       # Profiles fetch and updates
│   ├── middleware/
│   │   ├── authMiddleware.js       # Verifies JWT validation
│   │   ├── isSeller.js             # Validates listing ownership
│   │   └── uploadMiddleware.js     # Configures Multer storage mapping
│   ├── models/
│   │   ├── Chat.js                 # Chat model schema
│   │   ├── Item.js                 # Item model schema
│   │   ├── message.js              # Message model schema
│   │   ├── Otp.js                  # Temp verification model schema
│   │   └── user.js                 # User profile schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth route declarations
│   │   ├── chatRoutes.js           # Chat route declarations
│   │   ├── itemRoutes.js           # Item route declarations
│   │   ├── messageRoutes.js        # Message route declarations
│   │   └── userRoutes.js           # Profile route declarations
│   ├── utils/
│   │   └── sendEmail.js            # Nodemailer transport definition
│   ├── server.js                   # Server bootstrapper, routing mounts, and Socket.IO initialization
│   └── package.json                # Node script configurations and dependencies
│
├── campus-olx-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx          # Reusable customized buttons
│   │   │   ├── Footer.jsx          # Standard page footer
│   │   │   ├── ItemCard.jsx        # Grid card visualization for items
│   │   │   ├── ItemSkeleton.jsx    # Shimmer loader for lazy content
│   │   │   ├── Loader.jsx          # Spinner loader component
│   │   │   ├── Modal.jsx           # Clean confirmation modals
│   │   │   ├── Navbar.jsx          # Responsive header navigation
│   │   │   └── ProtectedRoute.jsx  # Route guard wrapper checking AuthContext
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Handles user auth states, profiles, and tokens
│   │   │   ├── ChatContext.jsx     # Manages notifications, unread badges, and socket listening
│   │   │   └── ThemeContext.jsx    # Light and Dark theme configurations
│   │   ├── pages/
│   │   │   ├── AddItem.jsx         # Form to create new item listings
│   │   │   ├── Chat.jsx            # Dynamic messaging window
│   │   │   ├── ChatInbox.jsx       # Listing page for active user chats
│   │   │   ├── EditItem.jsx        # Form to edit existing listings
│   │   │   ├── ItemDetails.jsx     # Full view of single item listings with seller contact
│   │   │   ├── Landing.jsx         # Clean call-to-action welcome screen
│   │   │   ├── Login.jsx           # User authentication form
│   │   │   ├── Marketplace.jsx     # Core dashboard with filters and search
│   │   │   ├── NotFound.jsx        # 404 page redirect
│   │   │   ├── Profile.jsx         # Profile dashboard and item listing tracker
│   │   │   ├── Register.jsx        # Registration form
│   │   │   └── VerifyEmail.jsx     # Email OTP code input page
│   │   ├── services/
│   │   │   └── api.js              # Centralized Axios setup with request interceptors
│   │   ├── App.css                 # Global stylesheets
│   │   ├── App.jsx                 # App routing declarations
│   │   ├── index.css               # Tailwind CSS integration
│   │   ├── main.jsx                # Application root rendering
│   │   └── socket.js               # Instantiates frontend Socket.IO client
│   ├── tailwind.config.js          # Tailwind theme configurations
│   ├── vite.config.js              # Vite compiler optimizations
│   └── package.json                # Project dependencies and script declarations
└── README.md                       # Current project documentation file
```

---

## 11. Environment Variables

To operate correctly, both the backend and frontend modules must be configured with separate environment variable files. 

### Backend Environment Configuration
Create a `.env` file within the `/backend` directory:

```env
# Server Network Settings
PORT=5555

# MongoDB Connection Configuration
MONGO_URI=mongodb://localhost:27017/your-db-name

# JWT Security Secrets
JWT_SECRET=your_jwt_signing_secret_key

# Cloudinary Integration API Keys
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Email Dispatch Server Credentials
EMAIL_USER=your_nodemailer_gmail_username@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Frontend Environment Configuration
Create a `.env` file within the `/campus-olx-frontend` directory:

```env
# API Gateway Settings
VITE_API_BASE_URL=http://localhost:5555/api
VITE_SOCKET_URL=http://localhost:5555
```

---

## 12. Local Installation and Setup

Follow these steps to run a copy of the project on your local workstation for development and testing.

### Prerequisites
* **Node.js:** Ensure that Node.js (v18+) is installed.
* **MongoDB:** Ensure that you have a local MongoDB daemon running, or a connection URI to a database server.
* **Cloudinary & Gmail SMTP Accounts:** Required to handle image uploads and OTP delivery.

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Campus-OLX
```

### Step 2: Set Up the Backend
1. Open a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Configure the local environment:
   Create a `.env` file in the `/backend` root directory using the template shown in the [Environment Variables](#11-environment-variables) section.
4. Launch the backend server:
   ```bash
   npm start
   ```
   *The server should report: `Server is running on port 5555` and `MongoDB connected`.*

### Step 3: Set Up the Frontend
1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd campus-olx-frontend
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Configure the local environment:
   Create a `.env` file in the `/campus-olx-frontend` root directory using the template shown in the [Environment Variables](#11-environment-variables) section.
4. Launch the frontend React app in development mode:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---
