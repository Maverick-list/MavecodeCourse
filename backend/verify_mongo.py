
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

# Credentials from .env
MONGO_URL = "mongodb+srv://Mavecode:m7F6559R78PBvXV3@cluster0.uviruhc.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

async def check_connection():
    print(f"Testing connection to: {MONGO_URL.split('@')[1]}") # Hide password in logs
    try:
        client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
        # Force a call to the server
        await client.admin.command('ping')
        print("SUCCESS: Connection verified!")
    except Exception as e:
        print(f"FAILURE: {e}")
        # Check for auth error specifically
        if "Authentication failed" in str(e):
            print("DIAGNOSIS: Wrong Username or Password")
        elif "SSL" in str(e):
             print("DIAGNOSIS: SSL/Network Blocked (Still occurring locally)")

if __name__ == "__main__":
    asyncio.run(check_connection())
