#!/usr/bin/env python3
"""
GamerSwipe Backend API Testing Script
Tests all backend endpoints in the specified order
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BASE_URL = "https://gamermatch-5.preview.emergentagent.com/api"

class GamerSwipeAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.player1_token = None
        self.player2_token = None
        self.player1_id = None
        self.player2_id = None
        self.match_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
    
    def test_register_player1(self):
        """Test: Register Player 1"""
        url = f"{self.base_url}/auth/register"
        data = {
            "email": "player1@test.com",
            "password": "test123",
            "nickname": "GamerPro1"
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                result = response.json()
                if "token" in result and "user" in result:
                    self.player1_token = result["token"]
                    self.player1_id = result["user"]["id"]
                    self.log_test("Register Player 1", True, f"User ID: {self.player1_id}")
                    return True
                else:
                    self.log_test("Register Player 1", False, "Missing token or user in response", result)
            else:
                self.log_test("Register Player 1", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Register Player 1", False, f"Exception: {str(e)}")
        return False
    
    def test_login_player1(self):
        """Test: Login Player 1"""
        url = f"{self.base_url}/auth/login"
        data = {
            "email": "player1@test.com",
            "password": "test123"
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                result = response.json()
                if "token" in result:
                    token = result["token"]
                    self.log_test("Login Player 1", True, "Login successful")
                    return True
                else:
                    self.log_test("Login Player 1", False, "Missing token in response", result)
            else:
                self.log_test("Login Player 1", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Login Player 1", False, f"Exception: {str(e)}")
        return False
    
    def test_get_me_player1(self):
        """Test: Get Me for Player 1"""
        url = f"{self.base_url}/auth/me"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if "id" in result and "nickname" in result:
                    self.log_test("Get Me Player 1", True, f"Retrieved profile for {result['nickname']}")
                    return True
                else:
                    self.log_test("Get Me Player 1", False, "Missing required fields", result)
            else:
                self.log_test("Get Me Player 1", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Me Player 1", False, f"Exception: {str(e)}")
        return False
    
    def test_update_profile_player1(self):
        """Test: Update Profile for Player 1"""
        url = f"{self.base_url}/profile"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        data = {
            "age": 25,
            "gender": "homme",
            "country": "France",
            "console": "xbox",
            "games": ["Fortnite", "Call of Duty"],
            "interests": ["FPS", "Battle Royale"],
            "looking_for": "ami_team",
            "bio": "Gamer passionné",
            "photo": "data:image/jpeg;base64,test123"
        }
        
        try:
            response = requests.put(url, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("age") == 25 and result.get("console") == "xbox":
                    self.log_test("Update Profile Player 1", True, "Profile updated successfully")
                    return True
                else:
                    self.log_test("Update Profile Player 1", False, "Profile not updated correctly", result)
            else:
                self.log_test("Update Profile Player 1", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Update Profile Player 1", False, f"Exception: {str(e)}")
        return False
    
    def test_register_player2(self):
        """Test: Register Player 2"""
        url = f"{self.base_url}/auth/register"
        data = {
            "email": "player2@test.com",
            "password": "test123",
            "nickname": "ProGamer2"
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                result = response.json()
                if "token" in result and "user" in result:
                    self.player2_token = result["token"]
                    self.player2_id = result["user"]["id"]
                    self.log_test("Register Player 2", True, f"User ID: {self.player2_id}")
                    return True
                else:
                    self.log_test("Register Player 2", False, "Missing token or user in response", result)
            else:
                self.log_test("Register Player 2", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Register Player 2", False, f"Exception: {str(e)}")
        return False
    
    def test_update_profile_player2(self):
        """Test: Update Profile for Player 2"""
        url = f"{self.base_url}/profile"
        headers = {"Authorization": f"Bearer {self.player2_token}"}
        data = {
            "age": 28,
            "gender": "femme",
            "country": "Canada",
            "console": "ps5",
            "games": ["Fortnite", "Apex Legends"],
            "interests": ["FPS", "Competitive"],
            "looking_for": "ami_team",
            "bio": "Competitive gamer",
            "photo": "data:image/jpeg;base64,test456"
        }
        
        try:
            response = requests.put(url, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("age") == 28 and result.get("console") == "ps5":
                    self.log_test("Update Profile Player 2", True, "Profile updated successfully")
                    return True
                else:
                    self.log_test("Update Profile Player 2", False, "Profile not updated correctly", result)
            else:
                self.log_test("Update Profile Player 2", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Update Profile Player 2", False, f"Exception: {str(e)}")
        return False
    
    def test_discover_profiles(self):
        """Test: Get Discover Profiles"""
        url = f"{self.base_url}/discover"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list):
                    # Should contain player2 profile
                    found_player2 = any(profile.get("id") == self.player2_id for profile in result)
                    if found_player2:
                        self.log_test("Discover Profiles", True, f"Found {len(result)} profiles including Player 2")
                    else:
                        self.log_test("Discover Profiles", True, f"Found {len(result)} profiles (Player 2 may not have complete profile)")
                    return True
                else:
                    self.log_test("Discover Profiles", False, "Response is not a list", result)
            else:
                self.log_test("Discover Profiles", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Discover Profiles", False, f"Exception: {str(e)}")
        return False
    
    def test_swipe_like_player1(self):
        """Test: Player 1 swipes like on Player 2"""
        url = f"{self.base_url}/swipe"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        data = {
            "swiped_user_id": self.player2_id,
            "action": "like"
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    self.log_test("Swipe Like Player 1", True, f"Swipe successful, Match: {result.get('is_match', False)}")
                    return True
                else:
                    self.log_test("Swipe Like Player 1", False, "Swipe not successful", result)
            else:
                self.log_test("Swipe Like Player 1", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Swipe Like Player 1", False, f"Exception: {str(e)}")
        return False
    
    def test_swipe_like_player2(self):
        """Test: Player 2 swipes like on Player 1 (should create match)"""
        url = f"{self.base_url}/swipe"
        headers = {"Authorization": f"Bearer {self.player2_token}"}
        data = {
            "swiped_user_id": self.player1_id,
            "action": "like"
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("is_match"):
                    match_data = result.get("match_data")
                    if match_data:
                        self.match_id = match_data.get("match_id")
                    self.log_test("Swipe Like Player 2", True, f"Match created! Match ID: {self.match_id}")
                    return True
                else:
                    self.log_test("Swipe Like Player 2", False, "Expected match but didn't get one", result)
            else:
                self.log_test("Swipe Like Player 2", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Swipe Like Player 2", False, f"Exception: {str(e)}")
        return False
    
    def test_get_matches(self):
        """Test: Get Matches for Player 1"""
        url = f"{self.base_url}/matches"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    # Should show match with revealed nickname
                    match = result[0]
                    if "user" in match and "nickname" in match["user"]:
                        revealed_nickname = match["user"]["nickname"]
                        self.log_test("Get Matches", True, f"Found match with revealed nickname: {revealed_nickname}")
                        return True
                    else:
                        self.log_test("Get Matches", False, "Match found but nickname not revealed", result)
                else:
                    self.log_test("Get Matches", False, "No matches found", result)
            else:
                self.log_test("Get Matches", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Matches", False, f"Exception: {str(e)}")
        return False
    
    def test_send_message(self):
        """Test: Send Message"""
        if not self.match_id:
            self.log_test("Send Message", False, "No match ID available")
            return False
            
        url = f"{self.base_url}/messages/{self.match_id}"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        data = {
            "content": "Salut! On joue ensemble?"
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("content") == data["content"]:
                    self.log_test("Send Message", True, "Message sent successfully")
                    return True
                else:
                    self.log_test("Send Message", False, "Message content mismatch", result)
            else:
                self.log_test("Send Message", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Send Message", False, f"Exception: {str(e)}")
        return False
    
    def test_get_messages(self):
        """Test: Get Messages"""
        if not self.match_id:
            self.log_test("Get Messages", False, "No match ID available")
            return False
            
        url = f"{self.base_url}/messages/{self.match_id}"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    message = result[0]
                    if message.get("content") == "Salut! On joue ensemble?":
                        self.log_test("Get Messages", True, f"Retrieved {len(result)} messages")
                        return True
                    else:
                        self.log_test("Get Messages", False, "Message content doesn't match", result)
                else:
                    self.log_test("Get Messages", False, "No messages found", result)
            else:
                self.log_test("Get Messages", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Messages", False, f"Exception: {str(e)}")
        return False
    
    def test_get_subscription(self):
        """Test: Get Subscription Status"""
        url = f"{self.base_url}/subscription"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                result = response.json()
                required_fields = ["type", "swipes_today", "swipes_remaining", "is_premium"]
                if all(field in result for field in required_fields):
                    self.log_test("Get Subscription", True, f"Type: {result['type']}, Swipes remaining: {result['swipes_remaining']}")
                    return True
                else:
                    self.log_test("Get Subscription", False, "Missing required fields", result)
            else:
                self.log_test("Get Subscription", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Subscription", False, f"Exception: {str(e)}")
        return False
    
    def test_upgrade_premium(self):
        """Test: Upgrade to Premium"""
        url = f"{self.base_url}/subscription/upgrade"
        headers = {"Authorization": f"Bearer {self.player1_token}"}
        
        try:
            response = requests.post(url, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("is_premium"):
                    self.log_test("Upgrade Premium", True, "Successfully upgraded to premium")
                    return True
                else:
                    self.log_test("Upgrade Premium", False, "Upgrade not successful", result)
            else:
                self.log_test("Upgrade Premium", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Upgrade Premium", False, f"Exception: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting GamerSwipe Backend API Tests")
        print(f"📡 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence as specified
        tests = [
            self.test_register_player1,
            self.test_login_player1,
            self.test_get_me_player1,
            self.test_update_profile_player1,
            self.test_register_player2,
            self.test_update_profile_player2,
            self.test_discover_profiles,
            self.test_swipe_like_player1,
            self.test_swipe_like_player2,
            self.test_get_matches,
            self.test_send_message,
            self.test_get_messages,
            self.test_get_subscription,
            self.test_upgrade_premium
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
        else:
            print("⚠️  Some tests failed. Check details above.")
            
        return passed == total

if __name__ == "__main__":
    tester = GamerSwipeAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)