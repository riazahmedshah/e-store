3️⃣ Order Creation Logic (Inside MongoDB Transaction)
If cartId exists (Cart Checkout)

Fetch cart by cartId

Validate cart belongs to authenticated user

Extract cart items

Fetch products from Product DB using sku

Validate stock availability

Calculate totalAmount

Create Order:

status: PENDING

Store product snapshot:

productId

title

price

image

quantity

Clear cart

Commit transaction

If Direct Buy (No cartId)

Fetch products from Product DB using sku

Validate stock availability

Calculate totalAmount

Create Order:

status: PENDING

Store product snapshot

Commit transaction

4️⃣ Order Creation Response

Response:

{
  "orderId": "string",
  "totalAmount": number
}


Frontend then redirects user to payment page (dummy for now).

💳 Payment Confirmation Flow
Endpoint:

POST /orders/confirm?orderId=xyz

Inside Transaction:

Fetch order by orderId

Ensure:

Order exists

Status is PENDING

Re-fetch products from Product DB

Re-check stock availability

If stock available:

Deduct stock

Update order status → CONFIRMED

If stock not available:

Update order status → CANCELLED

Commit transaction

📦 Stock Handling Strategy

Stock is NOT deducted during order creation

Stock is deducted only after payment confirmation

Stock is re-validated during payment confirmation


<!-- MAIN LOGIN -->

### Backend Flow (Transaction)
  - Validate body
  - Fetch products by SKU

  - Validate stock availability

  - Calculate totalAmount

  - Create order with:

  - items snapshot

  - status = PENDING

  - Commit transaction

  - Return { orderId, totalAmount }