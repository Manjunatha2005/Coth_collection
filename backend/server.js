import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Increase JSON payload limit for large image uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Save order endpoint
app.post('/api/orders', (req, res) => {
  try {
    const selectedDesign = req.body.selectedDesign;
    const customerName = req.body.customerName;
    const phone = req.body.phone;
    const quantity = req.body.quantity;
    const price = req.body.price;

    if (!selectedDesign || !customerName || !phone || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ordersFile = path.join(__dirname, 'orders.json');
    let orders = [];

    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf8');
      orders = JSON.parse(data || '[]');
    }

    const newOrder = {
      id: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      designName: selectedDesign.name,
      designId: selectedDesign.id,
      customerName: customerName,
      phone: phone,
      quantity: quantity,
      price: price,
      subtotal: price * quantity,
      discount: (price * quantity) * 0.05,
      totalAmount: (price * quantity) - ((price * quantity) * 0.05)
    };

    orders.push(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf8');

    res.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Get all orders
app.get('/api/orders', (req, res) => {
  try {
    const ordersFile = path.join(__dirname, 'orders.json');
    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf8');
      res.json(JSON.parse(data || '[]'));
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// Get prices for all designs
app.get('/api/settings/prices', (req, res) => {
  try {
    const settingsFile = path.join(__dirname, 'settings.json');
    if (fs.existsSync(settingsFile)) {
      const data = fs.readFileSync(settingsFile, 'utf8');
      const settings = JSON.parse(data || '{}');
      res.json({ prices: settings.prices || {} });
    } else {
      res.json({ prices: {} });
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    res.json({ prices: {} });
  }
});

// Get price for specific design
app.get('/api/settings/prices/:designId', (req, res) => {
  try {
    const designId = req.params.designId;
    const settingsFile = path.join(__dirname, 'settings.json');
    if (fs.existsSync(settingsFile)) {
      const data = fs.readFileSync(settingsFile, 'utf8');
      const settings = JSON.parse(data || '{}');
      const priceValue = settings.prices && settings.prices[designId] ? settings.prices[designId] : 5000;
      res.json({ price: priceValue });
    } else {
      res.json({ price: 5000 });
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    res.json({ price: 5000 });
  }
});

// Update price for specific design (admin)
app.post('/api/settings/prices/:designId', (req, res) => {
  try {
    const designId = req.params.designId;
    const priceValue = req.body.price;
    const adminPassword = req.body.adminPassword;

    if (adminPassword !== 'admin123') {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    if (!priceValue || priceValue < 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const settingsFile = path.join(__dirname, 'settings.json');
    let settings = {};

    if (fs.existsSync(settingsFile)) {
      const data = fs.readFileSync(settingsFile, 'utf8');
      settings = JSON.parse(data || '{}');
    }

    if (!settings.prices) {
      settings.prices = {};
    }

    settings.prices[designId] = parseInt(priceValue);

    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf8');

    res.json({ success: true, price: settings.prices[designId] });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// Get all blouse designs
app.get('/api/blouses', (req, res) => {
  try {
    const blousesFile = path.join(__dirname, 'blouses.json');
    if (fs.existsSync(blousesFile)) {
      const data = fs.readFileSync(blousesFile, 'utf8');
      res.json(JSON.parse(data || '[]'));
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading blouses:', error);
    res.status(500).json({ error: 'Failed to read blouses' });
  }
});

// Upload blouse design (admin)
app.post('/api/blouses', (req, res) => {
  try {
    const blouseName = req.body.name;
    const blousePrice = req.body.price;
    const blouseImage = req.body.image;

    console.log('Blouse upload request received:', { name: blouseName, price: blousePrice, hasImage: !!blouseImage });

    if (!blouseName || !blousePrice || !blouseImage) {
      console.log('Missing fields:', { name: !!blouseName, price: !!blousePrice, image: !!blouseImage });
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const blousesFile = path.join(__dirname, 'blouses.json');
    let blouses = [];

    if (fs.existsSync(blousesFile)) {
      const data = fs.readFileSync(blousesFile, 'utf8');
      blouses = JSON.parse(data || '[]');
    }

    const newBlouse = {
      id: Math.floor(Math.random() * 1000000),
      name: blouseName,
      price: blousePrice,
      image: blouseImage,
      uploadedAt: new Date().toISOString()
    };

    blouses.push(newBlouse);
    fs.writeFileSync(blousesFile, JSON.stringify(blouses, null, 2), 'utf8');

    console.log('Blouse uploaded successfully:', newBlouse.id);
    res.json({ success: true, id: newBlouse.id });
  } catch (error) {
    console.error('Error uploading blouse:', error);
    res.status(500).json({ success: false, error: 'Failed to upload blouse: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log('Order server running on http://localhost:' + PORT);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
