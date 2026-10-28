const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'dev_secret_key_123';

// 1. HTTP Security Headers
app.use(helmet());

// 2. Strict CORS
const allowedOrigins = ['http://localhost:3000', 'https://quicklabz.com'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// 3. Rate Limiting (DDoS Protection)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is secure and running', timestamp: new Date() });
});

// Helper to inject internal secret into proxied requests
const injectSecret = (proxyReq, req, res) => {
  proxyReq.setHeader('x-internal-gateway-secret', INTERNAL_SECRET);
};

// 4. Proxy rules with Internal Service Isolation
app.use('/api/catalog', createProxyMiddleware({ 
  target: 'http://localhost:8001', 
  changeOrigin: true,
  pathRewrite: { '^/api/catalog': '' },
  on: {
    proxyReq: injectSecret
  }
}));

// For now, route everything else to the Next.js Monolith (apps/web)
app.use('/', createProxyMiddleware({ 
  target: 'http://localhost:3000', 
  changeOrigin: true 
}));

app.listen(PORT, () => {
  console.log(`🚀 Secure API Gateway running on port ${PORT}`);
});
 