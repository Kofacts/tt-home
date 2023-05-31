<!DOCTYPE html>
<html>
<head>
  <title>Order Tracking</title>
  <style>
    /* Add your custom styles here */
  </style>
</head>
<body>
  <div>
    <form id="emailForm">
      <label for="email">Email Address:</label>
      <input type="email" id="email" required />
      <button type="submit">Fetch Order History</button>
    </form>

    <div id="orderHistory" style="display: none;">
      <h2>Order History</h2>
      <ul id="orderList"></ul>
    </div>

    <div id="orderDetails" style="display: none;">
      <h2>Order Details</h2>
      <p id="orderNo"></p>
      <p id="status"></p>
      <!-- Display other order details -->
    </div>
  </div>

  <script>
    document.getElementById('emailForm').addEventListener('submit', function (event) {
      event.preventDefault();
      
      const email = document.getElementById('email').value;

      fetch(`/api/orders/${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
          const orderList = document.getElementById('orderList');
          orderList.innerHTML = '';

          if (data.length > 0) {
            document.getElementById('orderHistory').style.display = 'block';
            document.getElementById('orderDetails').style.display = 'none';

            data.forEach(order => {
              const listItem = document.createElement('li');
              listItem.textContent = order.orderNo;
              listItem.addEventListener('click', function () {
                fetch(`/api/orders/${encodeURIComponent(order.orderNo)}`)
                  .then(response => response.json())
                  .then(orderDetails => {
                    document.getElementById('orderNo').textContent = `Order No: ${orderDetails.orderNo}`;
                    document.getElementById('status').textContent = `Status: ${orderDetails.status}`;
                    // Update other order details

                    document.getElementById('orderHistory').style.display = 'none';
                    document.getElementById('orderDetails').style.display = 'block';
                  })
                  .catch(error => console.log(error));
              });

              orderList.appendChild(listItem);
            });
          } else {
            console.log('No orders found for the provided email address');
          }
        })
        .catch(error => console.log(error));
    });
  </script>
</body>
</html>
