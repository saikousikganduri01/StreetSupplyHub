from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Initialize the Gemini 3 client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_db_connection():
    """
    Creates and returns a connection to the MySQL database.
    Update the credentials to match your local VS Code MySQL setup.
    """
    return mysql.connector.connect(
        host="localhost",
        user="your_username",      # Change to your MySQL username
        password="your_password",  # Change to your MySQL password
        database="supply_hub"      # Matches the name in market_data.sql
    )

def get_latest_market_data():
    """
    Fetches dynamic data from your MySQL tables and converts it to JSON format.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch all vendors
        cursor.execute("SELECT * FROM vendors")
        vendors = cursor.fetchall()

        # Fetch all listings joined with product info for better context
        query = """
        SELECT l.*, p.commodity_name 
        FROM listings l 
        JOIN products p ON l.product_id = p.product_id
        """
        cursor.execute(query)
        listings = cursor.fetchall()

        cursor.close()
        conn.close()

        return {
            "vendors": vendors,
            "listings": listings
        }
    except Exception as e:
        print(f"Database Error: {e}")
        return {"vendors": [], "listings": []}

def handle_request(user_input):
    # Fetch real-time data from MySQL
    market_data = get_latest_market_data()
    
    # SYSTEM INSTRUCTION: Sets the "brain" of the chatbot using DB data
    system_prompt = f"""
    You are an AI assistant for a grocery supply chain in Andhra Pradesh.
    
    KNOWLEDGE BASE FROM MYSQL:
    {json.dumps(market_data, indent=2, default=str)}
    
    RULES:
    1. PRIORITIZE DB: Use exact numbers from the 'listings' and 'vendors' data above.
    2. GENERAL KNOWLEDGE: If asked about locations not in the DB (like Vijayawada), use your internal knowledge.
    3. BE TRANSPARENT: State if info is from the "Local Database" or "General Market Trends."
    4. NO STARS: Use HTML <b> tags for bolding. Do NOT use markdown stars (**).
    5. HIGHEST SCORE: Compare 'trust_score' or 'rating' in the data to answer who is best.
    """

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                thinking_config=types.ThinkingConfig(
                    thinking_level=types.ThinkingLevel.LOW
                )
            ),
            contents=user_input
        )
        return response.text
    except Exception as e:
        return f"❌ Model Error: {str(e)}"

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    user_msg = request.json.get('message')
    bot_reply = handle_request(user_msg)
    return jsonify({"reply": bot_reply})

if __name__ == '__main__':
    print("🚀 Gemini 3 Backend Connected to MySQL on Port 5000")
    app.run(port=5000)