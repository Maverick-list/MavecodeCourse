#!/usr/bin/env python3
"""
Seed script for MongoDB Atlas - MavecodeCourse
Run this script to populate your cloud database with initial data.

Usage: python seed_cloud.py
"""

import asyncio
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path
import uuid

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'mavecode_db')

if not MONGO_URL:
    print("❌ Error: MONGO_URL not found in .env file")
    exit(1)


async def seed_database():
    """Seed the MongoDB Atlas database with initial data"""
    print(f"🔗 Connecting to MongoDB Atlas...")
    print(f"   Database: {DB_NAME}")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    now = datetime.now(timezone.utc).isoformat()
    
    # ============ Seed Courses ============
    print("\n📚 Seeding courses...")
    courses = [
        {
            'id': str(uuid.uuid4()), 
            'title': 'JavaScript Fundamentals', 
            'description': 'Pelajari dasar-dasar JavaScript dari variabel hingga async/await. Cocok untuk pemula yang ingin memulai karir sebagai web developer.',
            'thumbnail': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', 
            'price': 0, 
            'is_free': True, 
            'category': 'web', 
            'level': 'beginner', 
            'duration_hours': 10, 
            'instructor': 'Firza Ilmi', 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'title': 'React.js Mastery', 
            'description': 'Bangun aplikasi web modern dengan React.js. Dari komponen dasar hingga state management dengan Redux.',
            'thumbnail': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 
            'price': 199000, 
            'is_free': False, 
            'category': 'frontend', 
            'level': 'intermediate', 
            'duration_hours': 20, 
            'instructor': 'Firza Ilmi', 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'title': 'Python untuk Data Science', 
            'description': 'Kuasai Python dan library populer seperti Pandas, NumPy, dan Matplotlib untuk analisis data.',
            'thumbnail': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', 
            'price': 299000, 
            'is_free': False, 
            'category': 'data', 
            'level': 'intermediate', 
            'duration_hours': 25, 
            'instructor': 'Firza Ilmi', 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'title': 'Node.js Backend Development', 
            'description': 'Buat REST API dan backend scalable dengan Node.js, Express, dan MongoDB.',
            'thumbnail': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 
            'price': 249000, 
            'is_free': False, 
            'category': 'backend', 
            'level': 'intermediate', 
            'duration_hours': 18, 
            'instructor': 'Firza Ilmi', 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'title': 'HTML & CSS untuk Pemula', 
            'description': 'Langkah pertama menjadi web developer. Pelajari cara membuat website dari nol.',
            'thumbnail': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400', 
            'price': 0, 
            'is_free': True, 
            'category': 'web', 
            'level': 'beginner', 
            'duration_hours': 8, 
            'instructor': 'Firza Ilmi', 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'title': 'Flutter Mobile App Development', 
            'description': 'Buat aplikasi mobile cross-platform dengan satu codebase menggunakan Flutter dan Dart.',
            'thumbnail': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 
            'price': 349000, 
            'is_free': False, 
            'category': 'mobile', 
            'level': 'intermediate', 
            'duration_hours': 30, 
            'instructor': 'Firza Ilmi', 
            'created_at': now, 
            'updated_at': now
        }
    ]
    
    await db.courses.delete_many({})
    await db.courses.insert_many(courses)
    print(f"   ✅ Inserted {len(courses)} courses")
    
    # ============ Seed Articles ============
    print("\n📝 Seeding articles...")
    articles = [
        {
            'id': str(uuid.uuid4()), 
            'slug': 'tips-belajar-coding-efektif', 
            'title': '10 Tips Belajar Coding yang Efektif untuk Pemula',
            'content': 'Belajar coding bisa terasa overwhelming di awal. Berikut 10 tips yang bisa membantu perjalanan coding kamu:\n\n1. Mulai dari dasar\n2. Praktik setiap hari\n3. Bangun project nyata\n4. Jangan takut error\n5. Bergabung dengan komunitas\n6. Baca dokumentasi\n7. Review code orang lain\n8. Istirahat yang cukup\n9. Set goal yang realistis\n10. Nikmati prosesnya',
            'excerpt': 'Temukan cara belajar coding yang efektif dengan 10 tips praktis ini.',
            'thumbnail': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
            'category': 'tips', 
            'tags': ['coding', 'pemula', 'tips'], 
            'author': 'Firza Ilmi', 
            'views': 1250, 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'slug': 'trend-teknologi-2025', 
            'title': 'Trend Teknologi yang Wajib Dipelajari di 2025',
            'content': 'Teknologi terus berkembang pesat. Berikut trend yang perlu kamu perhatikan:\n\n- AI dan Machine Learning\n- Cloud Computing\n- Cybersecurity\n- Blockchain\n- IoT (Internet of Things)\n- Edge Computing\n- Low-Code/No-Code\n- Web3 Development',
            'excerpt': 'Ketahui skill teknologi yang paling dicari di tahun 2025.',
            'thumbnail': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
            'category': 'teknologi', 
            'tags': ['trend', 'karir', '2025'], 
            'author': 'Firza Ilmi', 
            'views': 890, 
            'created_at': now, 
            'updated_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'slug': 'cara-membuat-portfolio-developer', 
            'title': 'Cara Membuat Portfolio Developer yang Menarik',
            'content': 'Portfolio adalah kunci untuk mendapatkan pekerjaan sebagai developer. Berikut tips membuat portfolio yang menarik:\n\n1. Tampilkan project terbaik\n2. Gunakan desain yang clean\n3. Sertakan link GitHub\n4. Tulis deskripsi yang jelas\n5. Tambahkan testimonial\n6. Optimalkan untuk mobile',
            'excerpt': 'Panduan lengkap membuat portfolio yang menarik perhatian recruiter.',
            'thumbnail': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400',
            'category': 'karir', 
            'tags': ['portfolio', 'karir', 'tips'], 
            'author': 'Firza Ilmi', 
            'views': 2100, 
            'created_at': now, 
            'updated_at': now
        }
    ]
    
    await db.articles.delete_many({})
    await db.articles.insert_many(articles)
    print(f"   ✅ Inserted {len(articles)} articles")
    
    # ============ Seed FAQs ============
    print("\n❓ Seeding FAQs...")
    faqs = [
        {'id': str(uuid.uuid4()), 'question': 'Apakah saya perlu pengalaman coding sebelumnya?', 'answer': 'Tidak! Kursus kami dirancang untuk pemula. Kamu bisa mulai dari nol dan belajar step by step.', 'category': 'general', 'order': 1},
        {'id': str(uuid.uuid4()), 'question': 'Bagaimana cara mengakses kursus premium?', 'answer': 'Kamu bisa berlangganan paket Pro atau Enterprise untuk mengakses semua kursus premium, live class, dan fitur eksklusif lainnya.', 'category': 'subscription', 'order': 2},
        {'id': str(uuid.uuid4()), 'question': 'Apakah ada sertifikat setelah menyelesaikan kursus?', 'answer': 'Ya! Setiap kursus yang diselesaikan akan mendapatkan sertifikat digital yang bisa kamu bagikan di LinkedIn atau CV.', 'category': 'certificate', 'order': 3},
        {'id': str(uuid.uuid4()), 'question': 'Berapa lama akses kursus berlaku?', 'answer': 'Untuk kursus yang sudah dibeli atau selama berlangganan aktif, kamu bisa mengakses materi selamanya tanpa batas waktu.', 'category': 'subscription', 'order': 4},
        {'id': str(uuid.uuid4()), 'question': 'Bagaimana jika saya stuck atau butuh bantuan?', 'answer': 'Kamu bisa bertanya di forum komunitas, menggunakan fitur AI chatbot, atau hubungi mentor langsung via live class (untuk member Pro/Enterprise).', 'category': 'support', 'order': 5}
    ]
    
    await db.faqs.delete_many({})
    await db.faqs.insert_many(faqs)
    print(f"   ✅ Inserted {len(faqs)} FAQs")
    
    # ============ Seed Live Classes ============
    print("\n🎥 Seeding live classes...")
    live_classes = [
        {
            'id': str(uuid.uuid4()), 
            'title': 'Live Coding: Build Todo App with React',
            'description': 'Belajar membuat aplikasi Todo dari nol menggunakan React.js dan hooks.',
            'instructor': 'Firza Ilmi', 
            'scheduled_at': (datetime.now(timezone.utc) + timedelta(days=3)).isoformat(),
            'duration_minutes': 90, 
            'meeting_url': 'https://meet.google.com/abc-defg-hij',
            'max_participants': 100, 
            'participants_count': 45, 
            'created_at': now
        },
        {
            'id': str(uuid.uuid4()), 
            'title': 'Q&A Session: Karir sebagai Developer',
            'description': 'Sesi tanya jawab seputar persiapan karir, interview, dan tips sukses sebagai developer.',
            'instructor': 'Firza Ilmi', 
            'scheduled_at': (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            'duration_minutes': 60, 
            'meeting_url': 'https://meet.google.com/xyz-uvwx-rst',
            'max_participants': 200, 
            'participants_count': 78, 
            'created_at': now
        }
    ]
    
    await db.live_classes.delete_many({})
    await db.live_classes.insert_many(live_classes)
    print(f"   ✅ Inserted {len(live_classes)} live classes")
    
    # ============ Summary ============
    print("\n" + "=" * 50)
    print("✅ Database seeding completed successfully!")
    print("=" * 50)
    print(f"\n📊 Summary:")
    print(f"   - Courses: {len(courses)}")
    print(f"   - Articles: {len(articles)}")
    print(f"   - FAQs: {len(faqs)}")
    print(f"   - Live Classes: {len(live_classes)}")
    print(f"\n🔗 Database: {DB_NAME}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
