#  EcoBite — AI-Powered Food Rescue Platform

EcoBite is a full-stack **MERN food rescue and surplus-food marketplace** designed to help food vendors sell surplus food before it goes to waste while allowing consumers to discover affordable food nearby.

The platform combines **AI-powered food analysis, real-time order management, cloud-based image storage, secure authentication, and online payments** into a modern end-to-end web application.

---

##  Overview

Food businesses often have perfectly usable food left unsold at the end of the day. EcoBite provides a digital platform where vendors can list this surplus food at discounted prices and consumers can discover and purchase it.

EcoBite goes beyond a traditional marketplace by using **Google Gemini AI** to analyze food images and assist vendors with intelligent food insights and pricing recommendations.

The application supports separate consumer and vendor workflows, real-time order updates, image management through Cloudinary, and Razorpay payment integration.

---

##  Key Features

###  Authentication & Authorization

- Secure user registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected backend routes
- Role-based access for consumers and vendors

###  Consumer Experience

- Browse available surplus food
- Explore food listings
- View detailed food information
- Save preferred food items
- Add food items to cart
- Place orders
- View order history
- Track order status
- Submit reviews and feedback
- Manage user profile

###  Vendor Dashboard

- Vendor-specific protected functionality
- Add surplus food listings
- Upload food images
- AI-assisted food analysis
- Manage available food
- Receive customer orders
- Update order status
- Real-time order workflow

###  AI-Powered Food Analysis

EcoBite integrates **Google Gemini AI** to analyze uploaded food images.

The AI pipeline can assist with:

- Food image analysis
- Food quality/risk insights
- Recommended pricing
- Suggested discounts
- Structured AI-generated food information

The backend communicates with the Gemini API securely, keeping API credentials outside the frontend application.

###  Cloud Image Management

Food images are uploaded and stored using **Cloudinary**.

This provides:

- Cloud-based image storage
- Secure image URLs
- Scalable media delivery
- Centralized food-image management

###  Real-Time Order Updates

EcoBite uses **Socket.IO** for real-time communication between consumers and vendors.

This enables the application to provide live order updates without requiring users to manually refresh the page.

###  Payment Integration

The backend integrates **Razorpay** for payment processing.

Payment credentials are maintained securely through backend environment variables and are never exposed directly in frontend source code.

---

##  Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Socket.IO Client
- Lucide React
- React Hot Toast
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Socket.IO

### External Services

- Google Gemini API — AI food analysis
- Cloudinary — image storage and delivery
- Razorpay — payment processing
- MongoDB Atlas — cloud database

---

##  Application Architecture

```text
                         ┌──────────────────────┐
                         │       Consumer       │
                         └──────────┬───────────┘
                                    │
                                    │
                         ┌──────────▼───────────┐
                         │     React + Vite     │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                              REST API / Socket.IO
                                    │
                         ┌──────────▼───────────┐
                         │   Node.js + Express  │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        ┌───────────┐        ┌─────────────┐       ┌────────────┐
        │ MongoDB   │        │ Gemini API  │       │ Cloudinary │
        │ Database  │        │ AI Analysis │       │   Images   │
        └───────────┘        └─────────────┘       └────────────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │  Razorpay   │
                             │  Payments   │
                             └─────────────┘
```

---

##  Project Structure

```text
EcoBite/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── socket.ts
│   │   └── types.ts
│   │
│   ├── styles/
│   └── main.tsx
│
├── Backend/
│   ├── AI/
│   │   └── geminiService.js
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── Middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── Models/
│   │   ├── Food.js
│   │   ├── Order.js
│   │   └── user.js
│   │
│   ├── Services/
│   │   └── cloudinaryService.js
│   │
│   ├── Server.js
│   ├── package.json
│   └── .env.example
│
├── public/
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

> The exact structure may evolve as the application is extended.

---

##  AI Analysis Workflow

When a vendor uploads a food image, EcoBite processes it through the following pipeline:

```text
Vendor uploads food image
          │
          ▼
React Frontend
          │
          ▼
Express API
          │
          ├──────────────► Gemini AI
          │                  │
          │                  ▼
          │            Food Analysis
          │
          ├──────────────► Cloudinary
          │                  │
          │                  ▼
          │             Image Upload
          │
          ▼
Combine AI Analysis + Image URL
          │
          ▼
Return Structured Response
          │
          ▼
Vendor Dashboard
```

This architecture keeps AI and cloud-service credentials completely on the server side.

---

##  Real-Time Order Workflow

```text
Consumer
   │
   │ Places Order
   ▼
Express Backend
   │
   ├────────────► MongoDB
   │
   └────────────► Socket.IO Event
                        │
                        ▼
                     Vendor
                        │
                  Updates Status
                        │
                        ▼
                  Express Backend
                        │
                  Socket.IO Event
                        │
                        ▼
                    Consumer
```

---

##  Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLIENT_URL=http://localhost:5173
```

### Security

Never commit `.env` files or production credentials to Git.

Your `.gitignore` should include:

```gitignore
.env
.env.*
!.env.example

node_modules/
dist/
*.log
```

Use `.env.example` to document required variables without exposing actual credentials.

---

##  Local Development Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MongoDB or a MongoDB Atlas account

You will also need credentials for the external services you intend to use:

- Google Gemini API
- Cloudinary
- Razorpay

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Enter the project directory:

```bash
cd EcoBite-Food-Rescue
```

---

### 2. Install Frontend Dependencies

From the frontend/root directory:

```bash
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd Backend
npm install
```

---

### 4. Configure Backend Environment

Create:

```text
Backend/.env
```

Use `.env.example` as the template and provide your own credentials.

---

### 5. Start the Backend

Inside the `Backend` directory:

```bash
npm run dev
```

The backend runs by default on:

```text
http://localhost:5000
```

---

### 6. Start the Frontend

Open another terminal and return to the frontend directory:

```bash
npm run dev
```

The Vite development server runs by default on:

```text
http://localhost:5173
```

---

##  Core Backend Integrations

### MongoDB

MongoDB is used as the application's primary persistent database.

It stores application data such as:

- Users
- Food listings
- Orders
- Application-related metadata

Mongoose provides schema modeling and database interaction.

### Gemini AI

Gemini is called exclusively from the backend.

The general request flow is:

```text
Image
  ↓
Backend
  ↓
Gemini API
  ↓
Structured AI Response
  ↓
Validation / Processing
  ↓
Frontend
```

API keys are never sent to the browser.

### Cloudinary

Images uploaded by vendors are processed by the backend and stored in Cloudinary.

The resulting secure Cloudinary URL can then be associated with the corresponding food listing.

### Socket.IO

Socket.IO provides bidirectional communication between the backend and connected clients, enabling live order-state updates.

### Razorpay

Razorpay handles online payment functionality while sensitive provider credentials remain isolated in the backend environment.

---

##  Security Practices

EcoBite follows several important backend security practices:

- Password hashing before persistence
- JWT-based protected APIs
- Role-based authorization
- Server-side API credentials
- Environment-based configuration
- Protected vendor operations
- File upload middleware
- Cloud-based image storage
- MongoDB schema validation
- `.env` exclusion from source control

For production deployments, additional controls such as request rate limiting, stricter CORS policies, centralized validation, security headers, monitoring, structured logging, and secret-management infrastructure should also be configured.

---

##  Recommended Production Checks

Before deploying EcoBite, verify:

```text
✓ Environment secrets are not committed
✓ Production MongoDB connection is configured
✓ Frontend production URL is allowed by CORS
✓ Gemini API credentials are valid
✓ Cloudinary upload permissions are configured
✓ Razorpay production/test mode is configured correctly
✓ JWT secret is cryptographically strong
✓ Socket.IO production origin is configured
✓ Error responses do not expose secrets
✓ HTTPS is enabled
✓ Production logging is configured
```

---

##  Production Deployment

The frontend and backend can be deployed independently.

A typical production architecture is:

```text
                 Internet
                    │
                    ▼
          ┌──────────────────┐
          │ React Frontend   │
          │ Static Hosting   │
          └────────┬─────────┘
                   │ HTTPS
                   ▼
          ┌──────────────────┐
          │ Express Backend  │
          │ Node.js Runtime  │
          └────────┬─────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     MongoDB    Gemini    Cloudinary
                   │
                   ▼
                Razorpay
```

For production, configure environment variables directly through the deployment provider instead of uploading `.env` files.

---

##  Future Improvements

Potential extensions include:

- Location-based food discovery
- Advanced search and filtering
- Vendor analytics dashboard
- Push notifications
- Email notifications
- Automated expiry monitoring
- Food rescue impact analytics
- Recommendation engine
- Advanced payment lifecycle management
- Refund management
- Admin dashboard
- Automated testing
- CI/CD pipeline
- Docker-based deployment
- Centralized logging and monitoring

---

##  Project Vision

EcoBite aims to demonstrate how modern web technologies and artificial intelligence can be combined to address a practical sustainability problem.

By connecting consumers with surplus food from vendors, the platform aims to:

- Reduce avoidable food waste
- Help vendors recover value from surplus inventory
- Give consumers access to discounted food
- Encourage more sustainable consumption

---

## Author

**Sparsh Agrawal**

GitHub: [Sparshcode1312](https://github.com/Sparshcode1312)

---

## 📄 License

This project is currently maintained for educational and portfolio purposes.

If you intend to make the repository open for external contributions or commercial reuse, add an appropriate open-source license such as MIT.

---

<p align="center">
  <strong>EcoBite 🌱</strong><br/>
  Rescue Food. Save Money. Reduce Waste.
</p>
