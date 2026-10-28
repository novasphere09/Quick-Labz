const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8001;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'dev_secret_key_123';

app.use(cors());
app.use(express.json());

// Internal Service Isolation Middleware (Zero Trust)
app.use((req, res, next) => {
  const secret = req.headers['x-internal-gateway-secret'];
  if (secret !== INTERNAL_SECRET) {
    console.warn('Blocked unauthorized direct access to microservice');
    return res.status(403).json({ error: 'Forbidden: Access must go through API Gateway' });
  }
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Catalog Service is running', timestamp: new Date() });
});

// Get all Test Categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.testCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all Tests (with optional filters)
app.get('/tests', async (req, res) => {
  try {
    const { categoryId, q, fasting } = req.query;
    const filter = { active: true };
    
    if (categoryId) filter.categoryId = categoryId;
    
    if (q) {
      filter.OR = [
        { name: { contains: q } },
        { description: { contains: q } }
      ];
    }
    
    if (fasting === 'true') filter.fastingRequired = true;
    if (fasting === 'false') filter.fastingRequired = false;

    const tests = await prisma.test.findMany({
      where: filter,
      include: { category: true },
      orderBy: { popular: 'desc' }
    });
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all Health Packages
app.get('/packages', async (req, res) => {
  try {
    const packages = await prisma.healthPackage.findMany({
      where: { active: true },
      include: { packageTests: { include: { test: true } } },
      orderBy: { popular: 'desc' }
    });
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`📦 Catalog Service running on port ${PORT}`);
});
