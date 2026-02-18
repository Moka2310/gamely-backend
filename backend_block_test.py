#!/usr/bin/env python3
"""
Test Block User API functionality
"""

import requests
import json

BASE_URL = "https://gamermatch-5.preview.emergentagent.com/api"

def test_block_functionality():
    print("🚫 Testing Block User Functionality")
    print("=" * 40)
    
    # First, create two test users for blocking
    print("Setting up test users...")
    
    # Register blocker user
    blocker_response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "blocker@test.com",
        "password": "test123",
        "nickname": "BlockerUser"
    })
    
    if blocker_response.status_code != 200:
        print("❌ Failed to create blocker user")
        return
    
    blocker_data = blocker_response.json()
    blocker_token = blocker_data["token"]
    blocker_id = blocker_data["user"]["id"]
    
    # Register blocked user
    blocked_response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "blocked@test.com",
        "password": "test123",
        "nickname": "BlockedUser"
    })
    
    if blocked_response.status_code != 200:
        print("❌ Failed to create blocked user")
        return
    
    blocked_data = blocked_response.json()
    blocked_id = blocked_data["user"]["id"]
    
    print(f"✅ Created test users: {blocker_id} and {blocked_id}")
    
    # Test 1: Block a user
    print("\nTest 1: Block a user")
    headers = {"Authorization": f"Bearer {blocker_token}"}
    block_response = requests.post(f"{BASE_URL}/block", 
                                 json={"user_id": blocked_id}, 
                                 headers=headers)
    
    if block_response.status_code == 200:
        result = block_response.json()
        if result.get("success"):
            print("✅ PASS - Successfully blocked user")
        else:
            print("❌ FAIL - Block response indicates failure")
    else:
        print(f"❌ FAIL - Expected 200, got {block_response.status_code}")
        print(f"Response: {block_response.text}")
    
    # Test 2: Try to block same user again (should fail)
    print("\nTest 2: Try to block same user again")
    duplicate_block = requests.post(f"{BASE_URL}/block", 
                                  json={"user_id": blocked_id}, 
                                  headers=headers)
    
    if duplicate_block.status_code == 400:
        print("✅ PASS - Correctly rejected duplicate block")
    else:
        print(f"❌ FAIL - Expected 400, got {duplicate_block.status_code}")
    
    # Test 3: Try to block self (should fail)
    print("\nTest 3: Try to block self")
    self_block = requests.post(f"{BASE_URL}/block", 
                             json={"user_id": blocker_id}, 
                             headers=headers)
    
    if self_block.status_code == 400:
        print("✅ PASS - Correctly rejected self-block")
    else:
        print(f"❌ FAIL - Expected 400, got {self_block.status_code}")
    
    # Test 4: Unblock user
    print("\nTest 4: Unblock user")
    unblock_response = requests.delete(f"{BASE_URL}/block/{blocked_id}", 
                                     headers=headers)
    
    if unblock_response.status_code == 200:
        result = unblock_response.json()
        if result.get("success"):
            print("✅ PASS - Successfully unblocked user")
        else:
            print("❌ FAIL - Unblock response indicates failure")
    else:
        print(f"❌ FAIL - Expected 200, got {unblock_response.status_code}")
    
    # Test 5: Try to unblock non-blocked user (should fail)
    print("\nTest 5: Try to unblock non-blocked user")
    invalid_unblock = requests.delete(f"{BASE_URL}/block/{blocked_id}", 
                                    headers=headers)
    
    if invalid_unblock.status_code == 404:
        print("✅ PASS - Correctly rejected unblock of non-blocked user")
    else:
        print(f"❌ FAIL - Expected 404, got {invalid_unblock.status_code}")
    
    print("\n" + "=" * 40)
    print("Block functionality testing completed")

if __name__ == "__main__":
    test_block_functionality()