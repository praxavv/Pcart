# MyCart 🛒  
An e-commerce store built to learn and explore the MERN stack.

## 🚀 Features
- Product catalog and shopping cart
- JWT-based user authentication
- MongoDB database integration
- Modular backend API structure with Express
- React frontend via Create React App

## 🧪 Environment Setup

This project uses a `.env` file to store sensitive environment variables.  
To begin, copy the provided template:

```bash
cp .env.example .env
```

Then update the `.env` file with your values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri_here
JWT_SECRET=your_super_secret_jwt_key
```

Ensure `.env` is added to `.gitignore` and **never committed** to version control.

## 📦 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
npm start
```

### 2. Frontend Setup

```bash
cd client
npm install
npm start
```

Once running:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000) or your configured `PORT`

## 🧰 Scripts and Tools

Inside the `client/` folder you can run:

- `npm start` — Start React app
- `npm run build` — Create production build
- `npm test` — Run tests
- `npm run eject` — Customize build config (irreversible)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 📄 License

MIT License  
See [LICENSE](./LICENSE) for full details.
```
