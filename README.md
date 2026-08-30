# Plug Point — Full-Stack Retail Analytics Demo

A course project that combines a React storefront, a Flask REST API, MySQL transaction data, and retail analytics dashboards. It demonstrates full-stack integration and SQL analysis across products, inventory, orders, and customer behavior.

## Highlights

- Product browsing, cart, checkout, pickup, and delivery workflows
- Customer and store-manager views
- Inventory and order-management endpoints
- Sales, retention, segmentation, lifetime-value, and product-trend queries
- React/Bootstrap interface with Chart.js and Recharts
- Parameterized MySQL queries in the Flask API

## Security improvements

The active branch has been hardened for portfolio use:

- MySQL credentials come from environment variables.
- New passwords are stored with Werkzeug password hashing.
- Public signup always creates a customer and cannot self-assign a privileged role.
- CORS defaults to the local React origin and can be configured explicitly.
- The checkout demo accepts a payment-provider token/reference and stores only the final four digits; it must never collect or store a full card number.
- Debug mode is disabled unless explicitly enabled.

This remains an educational application. It does not implement production authentication, authorization middleware, CSRF protection, a real payment processor, PCI compliance, or deployment hardening.

## Run locally

### Backend

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Create the MySQL schema before starting the API. Use a dedicated least-privilege database account rather than a root account.

### Frontend

```bash
cd Frontend
npm ci
npm start
```

The frontend runs at `http://localhost:3000`; the API defaults to `http://localhost:3001`.

## Data model

The checked-in CSV files contain synthetic demonstration records for products, orders, locations, and users. Do not replace them with personal, credential, or payment data. The `CustomerOrder.creditCardNo` legacy column should be interpreted as last-four display data only; a future migration should rename it to `card_last4`.

## Recommended production extensions

- Add session or token authentication plus role-based authorization on every privileged route.
- Move schema changes into migrations.
- Use a payment provider's hosted fields and tokens.
- Wrap multi-item order writes in one database transaction.
- Add API integration tests against an isolated test database.
- Configure secrets through a managed secret store.

## License

[MIT](LICENSE)
