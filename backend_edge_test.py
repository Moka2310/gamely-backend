#!/usr/bin/env python3
"""
GamerSwipe Backend API Edge Case Testing
Tests error scenarios and edge cases
"""

import requests
import json

BASE_URL = "https://gamerswipe-1.preview.emergentagent.com/api"

def test_edge_cases():
    print("🔍 Testing Edge Cases and Error Scenarios")
    print("=" * 50)
    
    # Test 1: Duplicate email registration
    print("Test 1: Duplicate email registration")
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "player1@test.com",  # Already exists
        "password": "test123",
        "nickname": "DuplicateUser"
    })
    if response.status_code == 400:
        print("✅ PASS - Correctly rejected duplicate email")
    else:
        print(f"❌ FAIL - Expected 400, got {response.status_code}")
    
    # Test 2: Duplicate nickname registration
    print("\nTest 2: Duplicate nickname registration")
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "unique@test.com",
        "password": "test123",
        "nickname": "GamerPro1"  # Already exists
    })
    if response.status_code == 400:
        print("✅ PASS - Correctly rejected duplicate nickname")
    else:
        print(f"❌ FAIL - Expected 400, got {response.status_code}")
    
    # Test 3: Invalid login credentials
    print("\nTest 3: Invalid login credentials")
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "nonexistent@test.com",
        "password": "wrongpassword"
    })
    if response.status_code == 401:
        print("✅ PASS - Correctly rejected invalid credentials")
    else:
        print(f"❌ FAIL - Expected 401, got {response.status_code}")
    
    # Test 4: Unauthorized access without token
    print("\nTest 4: Unauthorized access without token")
    response = requests.get(f"{BASE_URL}/auth/me")
    if response.status_code == 403:
        print("✅ PASS - Correctly rejected request without token")
    else:
        print(f"❌ FAIL - Expected 403, got {response.status_code}")
    
    # Test 5: Invalid token
    print("\nTest 5: Invalid token")
    headers = {"Authorization": "Bearer invalid_token_here"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if response.status_code == 401:
        print("✅ PASS - Correctly rejected invalid token")
    else:
        print(f"❌ FAIL - Expected 401, got {response.status_code}")
    
    # Test 6: Health check endpoint
    print("\nTest 6: Health check endpoint")
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        result = response.json()
        if "status" in result and result["status"] == "healthy":
            print("✅ PASS - Health check working")
        else:
            print("❌ FAIL - Health check response invalid")
    else:
        print(f"❌ FAIL - Expected 200, got {response.status_code}")
    
    print("\n" + "=" * 50)
    print("Edge case testing completed")

if __name__ == "__main__":
    test_edge_cases()