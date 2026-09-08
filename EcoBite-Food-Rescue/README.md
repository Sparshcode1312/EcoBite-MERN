# EcoBite

EcoBite is an AI-powered full-stack food rescue marketplace that connects
vendors with consumers to sell safe surplus food at discounted prices.

## Key Features

- Consumer and vendor authentication with JWT
- Role-based protected routes
- Vendor food listing and inventory management
- AI-powered food image analysis
- Cloudinary image uploads
- Cart and quantity management
- Razorpay test payment integration
- Backend payment-signature verification
- MongoDB order history
- Real-time order notifications with Socket.IO
- Live order status tracking
- Saved food and responsive consumer interface
- Vendor statistics dashboard

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Socket.IO Client
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Razorpay
- Cloudinary
- Google Gemini API

## Application Flow

1. A vendor registers and posts surplus food.
2. AI analyses the uploaded food image.
3. A consumer discovers and adds food to the cart.
4. Razorpay handles the test payment.
5. The backend verifies the payment signature.
6. A paid order is stored in MongoDB.
7. The vendor receives a real-time notification.
8. Order-status updates appear live for the consumer.

## Environment Setup

Copy the example environment file:

```bash
cp Backend/.env.example Backend/.env
 

  