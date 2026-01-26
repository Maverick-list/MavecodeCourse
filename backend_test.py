import requests
import sys
import json
from datetime import datetime

class MavecodeAPITester:
    def __init__(self, base_url="https://techskill-5.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()
        self.session.timeout = 30

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if use_admin and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_basic_endpoints(self):
        """Test basic endpoints"""
        print("\n=== Testing Basic Endpoints ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test stats
        self.run_test("Get Stats", "GET", "stats", 200)
        
        # Test categories
        self.run_test("Get Categories", "GET", "categories", 200)
        
        # Test hero content
        self.run_test("Get Hero Content", "GET", "hero", 200)
        
        # Test subscription plans
        self.run_test("Get Subscription Plans", "GET", "subscriptions", 200)

    def test_courses_endpoints(self):
        """Test courses endpoints"""
        print("\n=== Testing Courses Endpoints ===")
        
        # Get all courses
        success, courses_data = self.run_test("Get All Courses", "GET", "courses", 200)
        
        # Test with filters
        self.run_test("Get Free Courses", "GET", "courses?is_free=true", 200)
        self.run_test("Get Web Courses", "GET", "courses?category=web", 200)
        
        # Test individual course if courses exist
        if success and courses_data and len(courses_data) > 0:
            course_id = courses_data[0]['id']
            self.run_test("Get Single Course", "GET", f"courses/{course_id}", 200)
            
            # Test course videos
            self.run_test("Get Course Videos", "GET", f"courses/{course_id}/videos", 200)
        
        return success, courses_data

    def test_articles_endpoints(self):
        """Test articles endpoints"""
        print("\n=== Testing Articles Endpoints ===")
        
        # Get all articles
        success, articles_data = self.run_test("Get All Articles", "GET", "articles", 200)
        
        # Test individual article if articles exist
        if success and articles_data and len(articles_data) > 0:
            article_slug = articles_data[0]['slug']
            self.run_test("Get Single Article", "GET", f"articles/{article_slug}", 200)
        
        return success, articles_data

    def test_faq_endpoints(self):
        """Test FAQ endpoints"""
        print("\n=== Testing FAQ Endpoints ===")
        
        success, faq_data = self.run_test("Get All FAQs", "GET", "faqs", 200)
        return success, faq_data

    def test_live_classes_endpoints(self):
        """Test live classes endpoints"""
        print("\n=== Testing Live Classes Endpoints ===")
        
        success, live_data = self.run_test("Get Live Classes", "GET", "live-classes", 200)
        return success, live_data

    def test_user_auth(self):
        """Test user authentication"""
        print("\n=== Testing User Authentication ===")
        
        # Test user registration
        test_user_data = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "name": "Test User",
            "phone": "+62812345678"
        }
        
        success, register_response = self.run_test(
            "User Registration", 
            "POST", 
            "auth/register", 
            200, 
            test_user_data
        )
        
        if success and 'token' in register_response:
            self.token = register_response['token']
            print(f"   User token obtained: {self.token[:20]}...")
            
            # Test get user profile
            self.run_test("Get User Profile", "GET", "auth/me", 200)
            
            # Test user login
            login_data = {
                "email": test_user_data["email"],
                "password": test_user_data["password"]
            }
            self.run_test("User Login", "POST", "auth/login", 200, login_data)
            
            return True
        
        return False

    def test_admin_auth(self):
        """Test admin authentication"""
        print("\n=== Testing Admin Authentication ===")
        
        admin_data = {
            "username": "Mavecode07",
            "password": "Mavecode07"
        }
        
        success, admin_response = self.run_test(
            "Admin Login", 
            "POST", 
            "auth/admin", 
            200, 
            admin_data
        )
        
        if success and 'token' in admin_response:
            self.admin_token = admin_response['token']
            print(f"   Admin token obtained: {self.admin_token[:20]}...")
            return True
        
        return False

    def test_admin_operations(self):
        """Test admin operations"""
        if not self.admin_token:
            print("❌ Skipping admin operations - no admin token")
            return False
            
        print("\n=== Testing Admin Operations ===")
        
        # Test creating a course
        course_data = {
            "title": "Test Course API",
            "description": "Test course created via API testing",
            "thumbnail": "https://via.placeholder.com/400",
            "price": 99000,
            "is_free": False,
            "category": "web",
            "level": "beginner",
            "duration_hours": 5,
            "instructor": "Firza Ilmi"
        }
        
        success, course_response = self.run_test(
            "Create Course (Admin)", 
            "POST", 
            "courses", 
            200, 
            course_data,
            use_admin=True
        )
        
        if success and 'id' in course_response:
            course_id = course_response['id']
            
            # Test updating the course
            updated_data = course_data.copy()
            updated_data['title'] = "Updated Test Course"
            
            self.run_test(
                "Update Course (Admin)", 
                "PUT", 
                f"courses/{course_id}", 
                200, 
                updated_data,
                use_admin=True
            )
            
            # Test deleting the course
            self.run_test(
                "Delete Course (Admin)", 
                "DELETE", 
                f"courses/{course_id}", 
                200,
                use_admin=True
            )
        
        # Test creating FAQ
        faq_data = {
            "question": "Test FAQ Question?",
            "answer": "This is a test FAQ answer.",
            "category": "general",
            "order": 999
        }
        
        success, faq_response = self.run_test(
            "Create FAQ (Admin)", 
            "POST", 
            "faqs", 
            200, 
            faq_data,
            use_admin=True
        )
        
        if success and 'id' in faq_response:
            faq_id = faq_response['id']
            self.run_test(
                "Delete FAQ (Admin)", 
                "DELETE", 
                f"faqs/{faq_id}", 
                200,
                use_admin=True
            )

    def test_contact_form(self):
        """Test contact form"""
        print("\n=== Testing Contact Form ===")
        
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is a test message from API testing."
        }
        
        self.run_test("Send Contact Message", "POST", "contact", 200, contact_data)

    def test_chatbot(self):
        """Test AI chatbot"""
        print("\n=== Testing AI Chatbot ===")
        
        chat_data = {
            "message": "Halo, apa saja kursus yang tersedia?",
            "session_id": None
        }
        
        success, chat_response = self.run_test("AI Chat", "POST", "chat", 200, chat_data)
        
        if success and 'response' in chat_response:
            print(f"   AI Response: {chat_response['response'][:100]}...")
            return True
        
        return False

    def test_seed_data(self):
        """Test seed data generation"""
        if not self.admin_token:
            print("❌ Skipping seed data test - no admin token")
            return False
            
        print("\n=== Testing Seed Data ===")
        
        self.run_test("Generate Seed Data", "POST", "seed", 200, use_admin=True)

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Mavecode API Testing...")
        print(f"Base URL: {self.base_url}")
        
        # Basic tests
        self.test_basic_endpoints()
        
        # Content tests
        self.test_courses_endpoints()
        self.test_articles_endpoints()
        self.test_faq_endpoints()
        self.test_live_classes_endpoints()
        
        # Auth tests
        user_auth_success = self.test_user_auth()
        admin_auth_success = self.test_admin_auth()
        
        # Admin operations
        if admin_auth_success:
            self.test_admin_operations()
            self.test_seed_data()
        
        # Other features
        self.test_contact_form()
        self.test_chatbot()
        
        # Print results
        print(f"\n📊 Test Results:")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
                print(f"  - {test['name']}: {error_msg}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = MavecodeAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())