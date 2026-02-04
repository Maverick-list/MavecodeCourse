import requests
import os

key = "AIzaSyCq8miG9PoEJblr7HdkwJKRs_1dq4rhMxU"
models = [
    "gemini-2.0-flash",
    "gemini-2.0-pro-exp-02-05", # Some newer ones
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-flash-latest",
    "gemini-2.5-flash", # As seen in trace
]

for m in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
    try:
        r = requests.post(url, json={"contents": [{"parts": [{"text": "hi"}]}]}, timeout=10)
        print(f"Model: {m} | Status: {r.status_code}")
        if r.status_code == 200:
            print(f"Success with {m}!")
            break
        else:
            print(f"Response: {r.text[:200]}")
    except Exception as e:
        print(f"Error with {m}: {e}")
