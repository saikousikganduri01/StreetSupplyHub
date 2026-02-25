# StreetSupply Hub

A B2B grocery marketplace web app for suppliers and vendors. It supports OTP-based login, a vendor marketplace with search and trends, supplier inventory management, bargaining, group orders, and support/chat.

## Features
- Vendor marketplace with product search, category filtering, and price trends.
- Supplier dashboard for inventory management, bargains, and customer insights.
- OTP-based registration and login for vendors and suppliers.
- Group orders and bargaining flows.
- Support/chat interface.

## Tech Stack
- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: Node.js (Express) + MySQL
- Optional AI chat service: Flask (Python) + Gemini API

## Project Structure
- `index.html` - Main UI
- `style.css` - Styling
- `script.js` - Frontend behavior
- `server.js` - Express API server
- `app1.py` - Optional chat backend
- `data.sql` - Database schema and seed data

## Prerequisites
- Node.js 18+
- MySQL 8+
- Python 3.10+ (optional, only for the chat service)

## Setup
1. Install dependencies
- `npm install`
- Optional (chat service): `pip install -r requirements.txt`

2. Configure environment variables
Create a `.env` file in the project root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=ProjectX
CHATBOT_BACKEND_URL=http://127.0.0.1:5001/chat
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
CHATBOT_PORT=5001
```

3. Initialize the database
- Import `data.sql` into MySQL.

4. Run the app
- API server: `node server.js`
- Optional chat server: `python app1.py`

5. Open the app
- `http://localhost:5000`

## License
Private/internal use.
