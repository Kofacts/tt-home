const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

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
  const order = {
    orderNo: '',
    tracking_number: '',
    checkpoints: [],
  };
  fs.createReadStream('trackings.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data.orderNo === orderId) {
        order.orderNo = data.orderNo;
        order.tracking_number = data.tracking_number;
        // Include other relevant properties

        // Read and process the checkpoints.csv file
        fs.createReadStream('checkpoints.csv')
          .pipe(csv())
          .on('data', (checkpointData) => {
            if (checkpointData.tracking_number === order.tracking_number) {
              const checkpoint = {
                location: checkpointData.location,
                timestamp: checkpointData.timestamp,
                status: checkpointData.status,
                status_text: checkpointData.status_text,
                status_detail: checkpointData.status_detail,
              };
              order.checkpoints.push(checkpoint);
            }
          })
          .on('end', () => {
            res.json(order);
          });
      }
    })
    .on('end', () => {
      res.status(404).json({ error: 'Order not found' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
