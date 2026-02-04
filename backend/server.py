from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
print("--- STARTING MAVECODE BACKEND (REDEPLOY ATTEMPT 2026-01-30_0017) ---")
print(f"DEBUG: MONGO_URL configured: {bool(os.environ.get('MONGO_URL'))}")

from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection - CRASH PROOF WRAPPER
try:
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'mavecode_db') # Default to avoid crash
    
    if not mongo_url:
        print("WARNING: MONGO_URL is missing! App will start in Maintenance Mode.")
        db = None
    else:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        print(f"SUCCESS: Connected to DB {db_name}")
except Exception as e:
    print(f"CRITICAL DB ERROR: {e}")
    db = None

# JWT config
JWT_SECRET = os.environ.get('JWT_SECRET', 'mavecode-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Admin credentials
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'Mavecode07')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Mavecode07')

app = FastAPI(title="Mavecode API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============ Models ============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    token: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    is_premium: bool = False
    created_at: str

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class AdminTokenResponse(BaseModel):
    token: str
    is_admin: bool = True

class CourseCreate(BaseModel):
    title: str
    description: str
    thumbnail: Optional[str] = None
    price: float = 0
    is_free: bool = True
    category: str
    level: str = "beginner"
    duration_hours: int = 0
    instructor: str = "Firza Ilmi"

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: Optional[str] = None
    price: float
    is_free: bool
    category: str
    level: str
    duration_hours: int
    instructor: str
    created_at: str
    updated_at: str

class VideoCreate(BaseModel):
    course_id: str
    title: str
    description: Optional[str] = None
    video_url: str
    duration_minutes: int = 0
    order: int = 0
    is_preview: bool = False
    type: str = "video"

class VideoResponse(BaseModel):
    id: str
    course_id: str
    title: str
    description: Optional[str] = None
    video_url: str
    duration_minutes: int
    order: int
    is_preview: bool
    type: str = "video"
    created_at: str

class ArticleCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    thumbnail: Optional[str] = None
    category: str
    tags: List[str] = []
    author: str = "Firza Ilmi"

class ArticleResponse(BaseModel):
    id: str
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    thumbnail: Optional[str] = None
    category: str
    tags: List[str]
    author: str
    views: int
    created_at: str
    updated_at: str

class SubscriptionPlan(BaseModel):
    id: str
    name: str
    price_monthly: float
    price_yearly: float
    features: List[str]
    is_popular: bool = False

class LiveClassCreate(BaseModel):
    title: str
    description: Optional[str] = None
    instructor: str = "Firza Ilmi"
    scheduled_at: str
    duration_minutes: int = 60
    meeting_url: Optional[str] = None
    max_participants: int = 100

class LiveClassResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    instructor: str
    scheduled_at: str
    duration_minutes: int
    meeting_url: Optional[str] = None
    max_participants: int
    participants_count: int
    created_at: str

class FAQCreate(BaseModel):
    question: str
    answer: str
    category: str = "general"
    order: int = 0

class FAQResponse(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    order: int

class CreateOrder(BaseModel):
    course_id: str
    payment_method: str  # 'bca', 'gopay', etc.

class OrderResponse(BaseModel):
    id: str
    user_id: str
    course_id: str
    amount: float
    status: str  # 'pending', 'paid', 'failed'
    payment_method: str
    va_number: Optional[str] = None  # Simulated VA Number
    created_at: str

class HeroContentUpdate(BaseModel):
    title: str
    subtitle: str
    cta_text: str
    background_image: Optional[str] = None

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class UserProgress(BaseModel):
    user_id: str
    course_id: str
    video_id: str
    completed: bool = False
    progress_percent: int = 0

# ============ Helper Functions ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, is_admin: bool = False) -> str:
    payload = {
        'user_id': user_id,
        'is_admin': is_admin,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    if payload.get('is_admin'):
        return {'id': 'admin', 'is_admin': True}
    user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    if not payload.get('is_admin'):
        raise HTTPException(status_code=403, detail="Admin access required")
    return {'id': 'admin', 'is_admin': True}

def slugify(text: str) -> str:
    import re
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

# ============ Auth Routes ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    existing = await db.users.find_one({'email': data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        'id': user_id,
        'email': data.email,
        'password': hash_password(data.password),
        'name': data.name,
        'phone': data.phone,
        'is_premium': False,
        'created_at': now
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id)
    user_response = UserResponse(
        id=user_id, email=data.email, name=data.name, 
        phone=data.phone, is_premium=False, created_at=now
    )
    return TokenResponse(token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({'email': data.email}, {'_id': 0})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_token(user['id'])
    return TokenResponse(token=token, user=UserResponse(**user))

@api_router.post("/auth/google", response_model=TokenResponse)
async def google_login(data: GoogleLoginRequest):
    logger.info(f"DEBUG: Received Google Token (first 50 chars): {data.token[:50]}...")
    try:
        # Decode token without signature verification for demo purposes
        # In production, verifying against Google's public keys is required
        
        # PyJWT 2.0+ uses options={'verify_signature': False}
        # Older versions used verify=False. We'll try the modern way first.
        try:
             payload = jwt.decode(data.token, options={"verify_signature": False})
        except TypeError:
             # Fallback for older interface if somehow loaded
             payload = jwt.decode(data.token, verify=False)
             
        logger.info(f"DEBUG: Decoded Payload: {payload}")
        
        email = payload.get('email')
        name = payload.get('name', 'Google User')
        
        if not email:
            logger.error("ERROR: No email in payload")
            raise HTTPException(status_code=400, detail="Invalid Google Token: Email missing")
            
    except Exception as e:
        logger.error(f"CRITICAL ERROR in google_login: {str(e)}")
        # import traceback
        # traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Token validation error: {str(e)}")

    user = await db.users.find_one({'email': email}, {'_id': 0})
    now = datetime.now(timezone.utc).isoformat()

    if not user:
        # Register new user
        user_id = str(uuid.uuid4())
        user_doc = {
            'id': user_id,
            'email': email,
            'password': hash_password(str(uuid.uuid4())), # Random password
            'name': name,
            'phone': None,
            'is_premium': False,
            'created_at': now
        }
        await db.users.insert_one(user_doc)
        user = user_doc
    
    token = create_token(user['id'])
    return TokenResponse(token=token, user=UserResponse(**user))

@api_router.post("/auth/admin", response_model=AdminTokenResponse)
async def admin_login(data: AdminLogin):
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = create_token('admin', is_admin=True)
    return AdminTokenResponse(token=token, is_admin=True)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    if user.get('is_admin'):
        return UserResponse(id='admin', email='admin@mavecode.id', name='Admin', is_premium=True, created_at=datetime.now(timezone.utc).isoformat())
    return UserResponse(**{k: v for k, v in user.items() if k != 'password'})

# ============ Course Routes ============

@api_router.get("/courses", response_model=List[CourseResponse])
async def get_courses(category: Optional[str] = None, is_free: Optional[bool] = None):
    query = {}
    if category:
        query['category'] = category
    if is_free is not None:
        query['is_free'] = is_free
    courses = await db.courses.find(query, {'_id': 0}).to_list(100)
    return courses

@api_router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str):
    course = await db.courses.find_one({'id': course_id}, {'_id': 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@api_router.post("/courses", response_model=CourseResponse)
async def create_course(data: CourseCreate, admin: dict = Depends(get_admin_user)):
    course_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    course_doc = {
        'id': course_id,
        **data.model_dump(),
        'created_at': now,
        'updated_at': now
    }
    await db.courses.insert_one(course_doc)
    return CourseResponse(**course_doc)

@api_router.put("/courses/{course_id}", response_model=CourseResponse)
async def update_course(course_id: str, data: CourseCreate, admin: dict = Depends(get_admin_user)):
    now = datetime.now(timezone.utc).isoformat()
    result = await db.courses.update_one(
        {'id': course_id},
        {'$set': {**data.model_dump(), 'updated_at': now}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    course = await db.courses.find_one({'id': course_id}, {'_id': 0})
    return CourseResponse(**course)

@api_router.delete("/courses/{course_id}")
async def delete_course(course_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.courses.delete_one({'id': course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    await db.videos.delete_many({'course_id': course_id})
    return {"message": "Course deleted"}

# ============ Video Routes ============

@api_router.get("/courses/{course_id}/videos", response_model=List[VideoResponse])
async def get_course_videos(course_id: str):
    videos = await db.videos.find({'course_id': course_id}, {'_id': 0}).sort('order', 1).to_list(100)
    return videos

@api_router.post("/videos", response_model=VideoResponse)
async def create_video(data: VideoCreate, admin: dict = Depends(get_admin_user)):
    video_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    video_doc = {
        'id': video_id,
        **data.model_dump(),
        'created_at': now
    }
    await db.videos.insert_one(video_doc)
    return VideoResponse(**video_doc)

@api_router.put("/videos/{video_id}", response_model=VideoResponse)
async def update_video(video_id: str, data: VideoCreate, admin: dict = Depends(get_admin_user)):
    result = await db.videos.update_one({'id': video_id}, {'$set': data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    video = await db.videos.find_one({'id': video_id}, {'_id': 0})
    return VideoResponse(**video)

@api_router.delete("/videos/{video_id}")
async def delete_video(video_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.videos.delete_one({'id': video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted"}

# ============ Article Routes ============

@api_router.get("/articles", response_model=List[ArticleResponse])
async def get_articles(category: Optional[str] = None, tag: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    if tag:
        query['tags'] = tag
    articles = await db.articles.find(query, {'_id': 0}).sort('created_at', -1).to_list(100)
    return articles

@api_router.get("/articles/{slug}", response_model=ArticleResponse)
async def get_article(slug: str):
    article = await db.articles.find_one({'slug': slug}, {'_id': 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.articles.update_one({'slug': slug}, {'$inc': {'views': 1}})
    article['views'] = article.get('views', 0) + 1
    return article

@api_router.post("/articles", response_model=ArticleResponse)
async def create_article(data: ArticleCreate, admin: dict = Depends(get_admin_user)):
    article_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    slug = slugify(data.title) + '-' + article_id[:8]
    article_doc = {
        'id': article_id,
        'slug': slug,
        **data.model_dump(),
        'views': 0,
        'created_at': now,
        'updated_at': now
    }
    await db.articles.insert_one(article_doc)
    return ArticleResponse(**article_doc)

@api_router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(article_id: str, data: ArticleCreate, admin: dict = Depends(get_admin_user)):
    now = datetime.now(timezone.utc).isoformat()
    result = await db.articles.update_one(
        {'id': article_id},
        {'$set': {**data.model_dump(), 'updated_at': now}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    article = await db.articles.find_one({'id': article_id}, {'_id': 0})
    return ArticleResponse(**article)

@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.articles.delete_one({'id': article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted"}

# ============ Subscription Plans ============

@api_router.get("/subscriptions", response_model=List[SubscriptionPlan])
async def get_subscription_plans():
    return [
        SubscriptionPlan(
            id="basic",
            name="Basic",
            price_monthly=99000,
            price_yearly=999000,
            features=["Akses semua kursus gratis", "Sertifikat digital", "Forum komunitas", "Dukungan email"],
            is_popular=False
        ),
        SubscriptionPlan(
            id="pro",
            name="Pro",
            price_monthly=199000,
            price_yearly=1999000,
            features=["Semua fitur Basic", "Akses kursus premium", "Live class mingguan", "Mentoring 1-on-1", "Project review"],
            is_popular=True
        ),
        SubscriptionPlan(
            id="enterprise",
            name="Enterprise",
            price_monthly=499000,
            price_yearly=4999000,
            features=["Semua fitur Pro", "Tim unlimited", "Custom learning path", "Priority support 24/7", "API access", "White-label option"],
            is_popular=False
        )
    ]

# ============ Live Class Routes ============

@api_router.get("/live-classes", response_model=List[LiveClassResponse])
async def get_live_classes():
    classes = await db.live_classes.find({}, {'_id': 0}).sort('scheduled_at', 1).to_list(100)
    return classes

@api_router.post("/live-classes", response_model=LiveClassResponse)
async def create_live_class(data: LiveClassCreate, admin: dict = Depends(get_admin_user)):
    class_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    class_doc = {
        'id': class_id,
        **data.model_dump(),
        'participants_count': 0,
        'created_at': now
    }
    await db.live_classes.insert_one(class_doc)
    return LiveClassResponse(**class_doc)

@api_router.post("/live-classes/{class_id}/join")
async def join_live_class(class_id: str, user: dict = Depends(get_current_user)):
    live_class = await db.live_classes.find_one({'id': class_id}, {'_id': 0})
    if not live_class:
        raise HTTPException(status_code=404, detail="Live class not found")
    await db.live_classes.update_one({'id': class_id}, {'$inc': {'participants_count': 1}})
    return {"message": "Joined successfully", "meeting_url": live_class.get('meeting_url')}

@api_router.delete("/live-classes/{class_id}")
async def delete_live_class(class_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.live_classes.delete_one({'id': class_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Live class not found")
    return {"message": "Live class deleted"}

# ============ FAQ Routes ============

@api_router.get("/faqs", response_model=List[FAQResponse])
async def get_faqs(category: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    faqs = await db.faqs.find(query, {'_id': 0}).sort('order', 1).to_list(100)
    return faqs

@api_router.post("/faqs", response_model=FAQResponse)
async def create_faq(data: FAQCreate, admin: dict = Depends(get_admin_user)):
    faq_id = str(uuid.uuid4())
    faq_doc = {'id': faq_id, **data.model_dump()}
    await db.faqs.insert_one(faq_doc)
    return FAQResponse(**faq_doc)

# ============ Payment & Orders ============

@api_router.post("/orders", response_model=OrderResponse)
async def create_order(data: CreateOrder, user: dict = Depends(get_current_user)):
    course = await db.courses.find_one({'id': data.course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already purchased
    # (Simplified: In real app check transaction history)
    
    order_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Simulate VA Number generation based on method
    va_number = None
    if data.payment_method in ['bca', 'mandiri', 'bni', 'bri']:
        va_number = f"88{random.randint(10000000, 99999999)}"
    
    order_doc = {
        'id': order_id,
        'user_id': user['id'],
        'course_id': data.course_id,
        'amount': course['price'],
        'status': 'pending',
        'payment_method': data.payment_method,
        'va_number': va_number,
        'created_at': now
    }
    
    await db.orders.insert_one(order_doc)
    return OrderResponse(**order_doc)

@api_router.post("/orders/{order_id}/pay")
async def pay_order(order_id: str, user: dict = Depends(get_current_user)):
    # Simulate payment success
    result = await db.orders.update_one(
        {'id': order_id, 'user_id': user['id']},
        {'$set': {'status': 'paid'}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # GRANT ACCESS: For now, buying any course grants Premium status (Subscription Model)
    # In a full system, we would add to a 'purchased_courses' list or 'subscriptions' collection.
    await db.users.update_one(
        {'id': user['id']}, 
        {'$set': {'is_premium': True}}
    )
    
    return {"message": "Payment successful", "status": "paid"}

@api_router.put("/faqs/{faq_id}", response_model=FAQResponse)
async def update_faq(faq_id: str, data: FAQCreate, admin: dict = Depends(get_admin_user)):
    result = await db.faqs.update_one({'id': faq_id}, {'$set': data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    faq = await db.faqs.find_one({'id': faq_id}, {'_id': 0})
    return FAQResponse(**faq)

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.faqs.delete_one({'id': faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}

# ============ Hero Content ============

@api_router.get("/hero")
async def get_hero_content():
    hero = await db.settings.find_one({'type': 'hero'}, {'_id': 0})
    if not hero:
        return {
            'title': 'Mulai Karir Codingmu Sekarang',
            'subtitle': 'Belajar coding dari nol hingga mahir bersama mentor berpengalaman. Dapatkan skill yang dibutuhkan industri teknologi.',
            'cta_text': 'Mulai Belajar Coding',
            'background_image': 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?crop=entropy&cs=srgb&fm=jpg&q=85'
        }
    return hero

@api_router.put("/hero")
async def update_hero_content(data: HeroContentUpdate, admin: dict = Depends(get_admin_user)):
    await db.settings.update_one(
        {'type': 'hero'},
        {'$set': {**data.model_dump(), 'type': 'hero'}},
        upsert=True
    )
    return {"message": "Hero content updated"}

# ============ Contact ============

@api_router.post("/contact")
async def send_contact(data: ContactMessage):
    message_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    message_doc = {
        'id': message_id,
        **data.model_dump(),
        'created_at': now,
        'read': False
    }
    await db.contact_messages.insert_one(message_doc)
    return {"message": "Message sent successfully", "id": message_id}

@api_router.get("/contact/messages")
async def get_contact_messages(admin: dict = Depends(get_admin_user)):
    messages = await db.contact_messages.find({}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return messages

# ============ User Progress ============

@api_router.post("/progress")
async def update_progress(data: UserProgress, user: dict = Depends(get_current_user)):
    await db.progress.update_one(
        {'user_id': user['id'], 'course_id': data.course_id, 'video_id': data.video_id},
        {'$set': {'completed': data.completed, 'progress_percent': data.progress_percent}},
        upsert=True
    )
    return {"message": "Progress updated"}

@api_router.get("/progress/{course_id}")
async def get_progress(course_id: str, user: dict = Depends(get_current_user)):
    progress = await db.progress.find(
        {'user_id': user['id'], 'course_id': course_id}, 
        {'_id': 0}
    ).to_list(100)
    return progress

# ============ AI Chatbot ============

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(data: ChatMessage):
    session_id = data.session_id or str(uuid.uuid4())
    
    # Temporary fallback while AI library is being fixed
    return ChatResponse(
        response="Maaf, fitur AI sedang dalam pemeliharaan. Silakan hubungi kami via WhatsApp: +62 851 9176 9521",
        session_id=session_id
    )

# ============ Categories ============

@api_router.get("/categories")
async def get_categories():
    return [
        {"id": "web", "name": "Web Development", "icon": "Globe"},
        {"id": "mobile", "name": "Mobile Development", "icon": "Smartphone"},
        {"id": "backend", "name": "Backend", "icon": "Server"},
        {"id": "frontend", "name": "Frontend", "icon": "Layout"},
        {"id": "data", "name": "Data Science", "icon": "BarChart"},
        {"id": "devops", "name": "DevOps", "icon": "Cloud"},
    ]

# ============ Stats ============

@api_router.get("/stats")
async def get_stats():
    courses_count = await db.courses.count_documents({})
    users_count = await db.users.count_documents({})
    articles_count = await db.articles.count_documents({})
    return {
        "courses": courses_count + 50,
        "students": users_count + 1000,
        "articles": articles_count + 10,
        "mentors": 5
    }

# ============ Seed Data ============

@api_router.post("/seed")
async def seed_data():
    """Seed initial data for the platform"""
    now = datetime.now(timezone.utc).isoformat()
    
    # Seed courses
    # Course IDs
    js_id = str(uuid.uuid4())
    react_id = str(uuid.uuid4())
    python_id = str(uuid.uuid4())
    node_id = str(uuid.uuid4())
    html_id = str(uuid.uuid4())
    flutter_id = str(uuid.uuid4())

    # Seed courses
    courses = [
        {
            'id': js_id, 'title': 'JavaScript Fundamentals', 'description': 'Pelajari dasar-dasar JavaScript dari variabel hingga async/await. Cocok untuk pemula yang ingin memulai karir sebagai web developer.',
            'thumbnail': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', 'price': 0, 'is_free': True, 'category': 'backend', 'level': 'beginner', 'duration_hours': 10, 'instructor': 'Firza Ilmi', 'created_at': now, 'updated_at': now
        },
        {
            'id': react_id, 'title': 'React.js Mastery', 'description': 'Bangun aplikasi web modern dengan React.js. Dari komponen dasar hingga state management dengan Redux.',
            'thumbnail': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 'price': 199000, 'is_free': False, 'category': 'frontend', 'level': 'intermediate', 'duration_hours': 20, 'instructor': 'Firza Ilmi', 'created_at': now, 'updated_at': now
        },
        {
            'id': python_id, 'title': 'Python untuk Data Science', 'description': 'Kuasai Python dan library populer seperti Pandas, NumPy, dan Matplotlib untuk analisis data.',
            'thumbnail': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', 'price': 299000, 'is_free': False, 'category': 'data', 'level': 'intermediate', 'duration_hours': 25, 'instructor': 'Firza Ilmi', 'created_at': now, 'updated_at': now
        },
        {
            'id': node_id, 'title': 'Node.js Backend Development', 'description': 'Buat REST API dan backend scalable dengan Node.js, Express, dan MongoDB.',
            'thumbnail': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 'price': 249000, 'is_free': False, 'category': 'backend', 'level': 'intermediate', 'duration_hours': 18, 'instructor': 'Firza Ilmi', 'created_at': now, 'updated_at': now
        },
        {
            'id': html_id, 'title': 'HTML & CSS untuk Pemula', 'description': 'Langkah pertama menjadi web developer. Pelajari cara membuat website dari nol.',
            'thumbnail': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400', 'price': 0, 'is_free': True, 'category': 'web', 'level': 'beginner', 'duration_hours': 8, 'instructor': 'Firza Ilmi', 'created_at': now, 'updated_at': now
        },
        {
            'id': flutter_id, 'title': 'Flutter Mobile App Development', 'description': 'Buat aplikasi mobile cross-platform dengan satu codebase menggunakan Flutter dan Dart.',
            'thumbnail': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 'price': 349000, 'is_free': False, 'category': 'mobile', 'level': 'intermediate', 'duration_hours': 30, 'instructor': 'Firza Ilmi', 'created_at': now, 'updated_at': now
        }
    ]

    # Seed Videos (Curriculum)
    videos = []
    
    # JS Videos
    videos.extend([
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': 'Pengenalan JavaScript', 'video_url': 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration_minutes': 15, 'is_preview': True, 'order': 1, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': 'Variables & Data Types', 'video_url': 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration_minutes': 25, 'is_preview': False, 'order': 2, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': 'Kuis: Dasar JavaScript', 'video_url': 'quiz', 'duration_minutes': 10, 'is_preview': False, 'order': 3, 'type': 'quiz', 'created_at': now}
    ])

    # React Videos
    videos.extend([
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'Intro to React', 'video_url': 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'duration_minutes': 20, 'is_preview': True, 'order': 1, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'JSX & Virtual DOM', 'video_url': 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'duration_minutes': 25, 'is_preview': False, 'order': 2, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'Components & Props', 'video_url': 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'duration_minutes': 35, 'is_preview': False, 'order': 3, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'State & Lifecycle', 'video_url': 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'duration_minutes': 40, 'is_preview': False, 'order': 4, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'Kuis: React Fundamental', 'video_url': 'quiz', 'duration_minutes': 15, 'is_preview': False, 'order': 5, 'type': 'quiz', 'created_at': now},
    ])

    # Python Videos
    videos.extend([
        {'id': str(uuid.uuid4()), 'course_id': python_id, 'title': 'Pengenalan Python & Setup', 'video_url': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 'duration_minutes': 15, 'is_preview': True, 'order': 1, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': python_id, 'title': 'Data Types in Python', 'video_url': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 'duration_minutes': 30, 'is_preview': False, 'order': 2, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': python_id, 'title': 'List, Tuple, & Dictionary', 'video_url': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 'duration_minutes': 45, 'is_preview': False, 'order': 3, 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': python_id, 'title': 'Kuis: Python Dasar', 'video_url': 'quiz', 'duration_minutes': 20, 'is_preview': False, 'order': 4, 'type': 'quiz', 'created_at': now},
    ])

    await db.courses.delete_many({})
    await db.courses.insert_many(courses)
    
    await db.videos.delete_many({})
    if videos:
        await db.videos.insert_many(videos)
    
    # Seed articles
    articles = [
        {
            'id': str(uuid.uuid4()), 'slug': 'masa-depan-ai-2025', 'title': 'Masa Depan Artificial Intelligence di Tahun 2025',
            'content': 'Generative AI telah mengubah cara kita bekerja. Di tahun 2025, kita akan melihat integrasi AI yang lebih dalam di setiap aspek pengembangan software. Agen AI akan menjadi rekan kerja standar bagi para developer...',
            'excerpt': 'Bagaimana AI akan berevolusi dan apa dampaknya bagi para pengembang di masa depan?',
            'thumbnail': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
            'category': 'teknologi', 'tags': ['AI', 'Future', 'Tech'], 'author': 'Firza Ilmi', 'views': 3450, 'created_at': now, 'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 'slug': 'belajar-prompt-engineering', 'title': 'Panduan Lengkap Prompt Engineering untuk Developer',
            'content': 'Menguasai cara berkomunikasi dengan Model Bahasa Besar (LLM) adalah skill krusial saat ini. Berikut adalah teknik-teknik fundamental dalam prompt engineering...',
            'excerpt': 'Tingkatkan efektivitas penggunaan AI Anda dengan penguasaan Prompt Engineering.',
            'thumbnail': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=400',
            'category': 'tutorial', 'tags': ['AI', 'Prompting', 'Productivity'], 'author': 'Firza Ilmi', 'views': 2100, 'created_at': now, 'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 'slug': 'tips-belajar-coding-efektif', 'title': '10 Tips Belajar Coding yang Efektif untuk Pemula',
            'content': 'Belajar coding bisa terasa overwhelming di awal. Berikut 10 tips yang bisa membantu perjalanan coding kamu...',
            'excerpt': 'Temukan cara belajar coding yang efektif dengan 10 tips praktis ini.',
            'thumbnail': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
            'category': 'tips', 'tags': ['coding', 'pemula', 'tips'], 'author': 'Firza Ilmi', 'views': 1250, 'created_at': now, 'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 'slug': 'trend-teknologi-2025', 'title': 'Trend Teknologi yang Wajib Dipelajari di 2025',
            'content': 'Teknologi terus berkembang pesat. Berikut trend yang perlu kamu perhatikan di tahun 2025...',
            'excerpt': 'Ketahui skill teknologi yang paling dicari di tahun 2025.',
            'thumbnail': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
            'category': 'teknologi', 'tags': ['trend', 'karir', '2025'], 'author': 'Firza Ilmi', 'views': 890, 'created_at': now, 'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 'slug': 'cara-membuat-portfolio-developer', 'title': 'Cara Membuat Portfolio Developer yang Menarik',
            'content': 'Portfolio adalah kunci untuk mendapatkan pekerjaan sebagai developer. Pelajari cara membuatnya...',
            'excerpt': 'Panduan lengkap membuat portfolio yang menarik perhatian recruiter.',
            'thumbnail': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400',
            'category': 'karir', 'tags': ['portfolio', 'karir', 'tips'], 'author': 'Firza Ilmi', 'views': 2100, 'created_at': now, 'updated_at': now
        }
    ]
    
    # Seed FAQs
    faqs = [
        {'id': str(uuid.uuid4()), 'question': 'Apakah saya perlu pengalaman coding sebelumnya?', 'answer': 'Tidak! Kursus kami dirancang untuk pemula. Kamu bisa mulai dari nol dan belajar step by step.', 'category': 'general', 'order': 1},
        {'id': str(uuid.uuid4()), 'question': 'Bagaimana cara mengakses kursus premium?', 'answer': 'Kamu bisa berlangganan paket Pro atau Enterprise untuk mengakses semua kursus premium, live class, dan fitur eksklusif lainnya.', 'category': 'subscription', 'order': 2},
        {'id': str(uuid.uuid4()), 'question': 'Apakah ada sertifikat setelah menyelesaikan kursus?', 'answer': 'Ya! Setiap kursus yang diselesaikan akan mendapatkan sertifikat digital yang bisa kamu bagikan di LinkedIn atau CV.', 'category': 'certificate', 'order': 3},
        {'id': str(uuid.uuid4()), 'question': 'Berapa lama akses kursus berlaku?', 'answer': 'Untuk kursus yang sudah dibeli atau selama berlangganan aktif, kamu bisa mengakses materi selamanya tanpa batas waktu.', 'category': 'subscription', 'order': 4},
        {'id': str(uuid.uuid4()), 'question': 'Bagaimana jika saya stuck atau butuh bantuan?', 'answer': 'Kamu bisa bertanya di forum komunitas, menggunakan fitur AI chatbot, atau hubungi mentor langsung via live class (untuk member Pro/Enterprise).', 'category': 'support', 'order': 5}
    ]
    
    # Seed live classes
    live_classes = [
        {
            'id': str(uuid.uuid4()), 'title': 'Live Coding: Build Todo App with React',
            'description': 'Belajar membuat aplikasi Todo dari nol menggunakan React.js dan hooks.',
            'instructor': 'Firza Ilmi', 'scheduled_at': (datetime.now(timezone.utc) + timedelta(days=3)).isoformat(),
            'duration_minutes': 90, 'meeting_url': 'https://meet.google.com/abc-defg-hij',
            'max_participants': 100, 'participants_count': 45, 'created_at': now
        },
        {
            'id': str(uuid.uuid4()), 'title': 'Q&A Session: Karir sebagai Developer',
            'description': 'Sesi tanya jawab seputar persiapan karir, interview, dan tips sukses sebagai developer.',
            'instructor': 'Firza Ilmi', 'scheduled_at': (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            'duration_minutes': 60, 'meeting_url': 'https://meet.google.com/xyz-uvwx-rst',
            'max_participants': 200, 'participants_count': 78, 'created_at': now
        }
    ]
    
    # Insert data
    await db.courses.delete_many({})
    await db.articles.delete_many({})
    await db.faqs.delete_many({})
    await db.live_classes.delete_many({})
    
    await db.courses.insert_many(courses)
    await db.articles.insert_many(articles)
    await db.faqs.insert_many(faqs)
    await db.live_classes.insert_many(live_classes)
    
    return {"message": "Seed data created successfully"}

# ============ Root ============

@api_router.get("/")
async def root():
    return {"message": "Mavecode API v1.0", "status": "running"}

# Include router and middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
