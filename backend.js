const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

// Endpoint to fetch order history based on email address
app.get('/api/orders/:email', (req, res) => {
  const { email } = req.params;
  // Read and process the trackings.csv file
  const orders = [];
  fs.createReadStream('trackings.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data.email === email) {
        orders.push({
          orderNo: data.orderNo,
          tracking_number: data.tracking_number,
          // Include other relevant properties
        });
      }
    })
    .on('end', () => {
      res.json(orders);
    });
});

// Endpoint to fetch order details for a specific order
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  // Read and process the trackings.csv file
  fs.createReadStream('trackings.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data.orderNo === orderId) {
        res.json(data);
      }
    })
    .on('end', () => {
      res.status(404).json({ error: 'Order not found' });
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
