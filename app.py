from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
import json
import re
import datetime
import secrets
import hashlib

# Initialize Flask app
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Secret key for sessions
CORS(app)  # Enable CORS for cross-origin requests

# In-memory user database (in production, use a real database)
users_db = {}

# User session management
logged_in_users = {}

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Adjust speech rate
engine.setProperty('volume', 0.9)  # Adjust volume

# Helper function to hash passwords
def hash_password(password):
    """Hash a password for storing."""
    salt = secrets.token_hex(16)
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('ascii'), 100000)
    return (pwdhash.hex(), salt)

# Dummy banking data
banking_data = {
    "account_balance": 15750.50,
    "account_number": "XXXX-XXXX-1234",
    "recent_transactions": [
        {"date": "2024-01-15", "description": "Salary Credit", "amount": 25000.00, "type": "credit"},
        {"date": "2024-01-12", "description": "Electricity Bill", "amount": 1200.00, "type": "debit"},
        {"date": "2024-01-10", "description": "Grocery Shopping", "amount": 2450.50, "type": "debit"},
        {"date": "2024-01-08", "description": "Mobile Recharge", "amount": 300.00, "type": "debit"},
        {"date": "2024-01-05", "description": "ATM Withdrawal", "amount": 5000.00, "type": "debit"}
    ],
    "loan_info": {
        "personal_loan": {
            "status": "Active",
            "amount": 100000.00,
            "emi": 8750.00,
            "tenure": "12 months",
            "remaining_emis": 8
        },
        "home_loan": {
            "status": "Closed",
            "amount": 1500000.00,
            "emi": 15000.00,
            "tenure": "120 months",
            "remaining_emis": 0
        }
    },
    "transfer_limits": {
        "daily_limit": 100000.00,
        "available_today": 75000.00
    }
}

def recognize_intent(text):
    """Identify user intent from speech text"""
    text = text.lower().strip()
    
    # Balance check intents
    if any(keyword in text for keyword in ['balance', 'money', 'amount', 'how much', 'remaining', 'account balance']):
        return "balance_check"
    
    # Transfer/Fund transfer intents
    elif any(keyword in text for keyword in ['transfer', 'send', 'money transfer', 'send money', 'fund transfer', 'neft', 'rtgs', 'imps']):
        return "fund_transfer"
    
    # Loan information intents
    elif any(keyword in text for keyword in ['loan', 'borrow', 'emi', 'personal loan', 'home loan', 'car loan']):
        return "loan_info"
    
    # Transaction history intents
    elif any(keyword in text for keyword in ['transaction', 'history', 'recent', 'last', 'statement', 'passbook']):
        return "transaction_history"
    
    # Help intents
    elif any(keyword in text for keyword in ['help', 'what can', 'how to', 'options', 'menu']):
        return "help"
    
    else:
        return "unknown"

def process_balance_check():
    """Process account balance check request"""
    balance = banking_data["account_balance"]
    account_number = banking_data["account_number"]
    
    response = f"Your account {account_number} has a balance of {balance} rupees."
    return response

def process_fund_transfer():
    """Process fund transfer information request"""
    available = banking_data["transfer_limits"]["available_today"]
    limit = banking_data["transfer_limits"]["daily_limit"]
    
    response = f"Your daily transfer limit is {limit} rupees. You can transfer {available} rupees today. You can transfer money using NEFT, RTGS, or IMPS."
    return response

def process_loan_info():
    """Process loan information request"""
    personal_loan = banking_data["loan_info"]["personal_loan"]
    home_loan = banking_data["loan_info"]["home_loan"]
    
    response = f"You have an active personal loan of {personal_loan['amount']} rupees with monthly EMI of {personal_loan['emi']} rupees. "
    response += f"You have {personal_loan['remaining_emis']} EMIs remaining. "
    response += f"Your home loan of {home_loan['amount']} rupees has been closed."
    return response

def process_transaction_history():
    """Process transaction history request"""
    transactions = banking_data["recent_transactions"][:3]  # Last 3 transactions
    
    response = "Your recent transactions are: "
    for i, transaction in enumerate(transactions, 1):
        amount = transaction['amount']
        description = transaction['description']
        trans_type = transaction['type']
        
        if trans_type == 'credit':
            response += f"{i}. {description}: {amount} rupees credited. "
        else:
            response += f"{i}. {description}: {amount} rupees debited. "
    
    return response

def process_help():
    """Process help request"""
    response = "I can help you with the following: Check account balance, Transfer funds information, Loan details, Transaction history. Please tell me what you want to do."
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_speech', methods=['POST'])
def process_speech():
    try:
        data = request.json
        speech_text = data.get('text', '')
        
        if not speech_text:
            return jsonify({'error': 'No speech text provided'}), 400
        
        # Recognize intent
        intent = recognize_intent(speech_text)
        
        # Process based on intent
        if intent == "balance_check":
            response_text = process_balance_check()
        elif intent == "fund_transfer":
            response_text = process_fund_transfer()
        elif intent == "loan_info":
            response_text = process_loan_info()
        elif intent == "transaction_history":
            response_text = process_transaction_history()
        elif intent == "help":
            response_text = process_help()
        else:
            response_text = "I didn't understand that. You can ask about balance, fund transfer, loans, or transaction history."
        
        return jsonify({
            'success': True,
            'intent': intent,
            'response': response_text,
            'original_text': speech_text
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        required_fields = ['username', 'password', 'email', 'firstName', 'lastName', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400
        
        username = data['username']
        password = data['password']
        email = data['email']
        
        # Check if user already exists
        if username in users_db:
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
        # Hash the password
        hashed_pwd, salt = hash_password(password)
        
        # Store user in database
        users_db[username] = {
            'password_hash': hashed_pwd,
            'salt': salt,
            'email': email,
            'firstName': data.get('firstName', ''),
            'lastName': data.get('lastName', ''),
            'phone': data.get('phone', ''),
            'created_at': str(datetime.now())
        }
        
        return jsonify({'success': True, 'message': 'User registered successfully'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required'}), 400
        
        # Check if user exists
        if username not in users_db:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 400
        
        # Verify password
        stored_hash = users_db[username]['password_hash']
        salt = users_db[username]['salt']
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('ascii'), 100000)
        
        if pwdhash.hex() != stored_hash:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 400
        
        # Create session token
        session_token = secrets.token_hex(32)
        logged_in_users[session_token] = username
        
        return jsonify({
            'success': True, 
            'message': 'Login successful',
            'token': session_token,
            'user': {
                'username': username,
                'firstName': users_db[username]['firstName'],
                'lastName': users_db[username]['lastName'],
                'email': users_db[username]['email']
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if token in logged_in_users:
            del logged_in_users[token]
            return jsonify({'success': True, 'message': 'Logged out successfully'})
        else:
            return jsonify({'success': False, 'message': 'Invalid session'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/protected/test', methods=['GET'])
def protected_test():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if token in logged_in_users:
            username = logged_in_users[token]
            return jsonify({'success': True, 'message': f'Access granted for {username}'})
        else:
            return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)