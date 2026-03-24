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

import certifi
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import dns.resolver

# Configure DNS resolver to use Cloudflare and Google DNS
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['1.1.1.1', '8.8.8.8']

# Load environment variables
ROOT_DIR = Path(__file__).parent
if (ROOT_DIR / '.env.local').exists():
    load_dotenv(ROOT_DIR / '.env.local')
else:
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

    final_url = MONGO_URL
    if MONGO_URL.startswith("mongodb+srv://"):
        try:
            print("🔄 Attempting DoH (DNS over HTTPS) resolution for SRV...")
            import requests
            
            # Parse host from URI
            credentials_part, rest = MONGO_URL.split('://')[1].rsplit('@', 1)
            if '/' in rest:
                host, params = rest.split('/', 1)
                params = '/' + params
            else:
                host = rest
                params = '/'
            
            # Request Google DoH
            doh_url = f"https://dns.google/resolve?name=_mongodb._tcp.{host}&type=SRV"
            print(f"   Querying: {doh_url}")
            resp = requests.get(doh_url, timeout=10)
            data = resp.json()
            
            if 'Answer' not in data:
                raise Exception(f"No SRV records found in DoH response: {data}")
                
            hosts = []
            for ans in data['Answer']:
                # Format: priority weight port target
                # Example: "0 0 27017 cluster0-shard-00-00.uviruhc.mongodb.net."
                parts = ans['data'].split()
                port = parts[2]
                target = parts[3].rstrip('.')
                hosts.append(f"{target}:{port}")
            
            # Reconstruct URI
            check_sep = '&' if '?' in params else '?'
            final_url = f"mongodb://{credentials_part}@{','.join(hosts)}{params}{check_sep}ssl=true&authSource=admin"
            print(f"✅ Resolved via DoH: {final_url.split('@')[1].split('/')[0]}...") 
        except Exception as e:
            print(f"⚠️ DoH Resolution failed ({e}), trying default...")

    # Determine if we should use TLS
    use_tls = "ssl=true" in final_url.lower() or "tls=true" in final_url.lower() or final_url.startswith("mongodb+srv://")
    
    client_kwargs = {}
    if use_tls:
        client_kwargs["tlsCAFile"] = certifi.where()
    
    client = AsyncIOMotorClient(final_url, **client_kwargs)
    db = client[DB_NAME]
    
    now = datetime.now(timezone.utc).isoformat()
    
    # ============ Generate Course IDs ============
    js_id = str(uuid.uuid4())
    react_id = str(uuid.uuid4())
    python_id = str(uuid.uuid4())
    node_id = str(uuid.uuid4())
    html_id = str(uuid.uuid4())
    flutter_id = str(uuid.uuid4())

    # ============ Seed Courses ============
    print("\n📚 Seeding courses...")
    courses = [
        {
            'id': js_id, 
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
            'id': react_id, 
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
            'id': python_id, 
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
            'id': node_id, 
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
            'id': html_id, 
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
            'id': flutter_id, 
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

    # Additional Dummy Courses generated automatically
    tech_stack = [
        ('TypeScript Diktat', 'frontend', 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400'),
        ('Vue.js Complete', 'frontend', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'),
        ('Angular for Enterprise', 'frontend', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
        ('Go (Golang) Microservices', 'backend', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'),
        ('Rust Systems Programming', 'backend', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'),
        ('Ruby on Rails Developer', 'backend', 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400'),
        ('Kotlin Android Dev', 'mobile', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'),
        ('Swift iOS Dev', 'mobile', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400'),
        ('React Native Unleashed', 'mobile', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'),
        ('Docker & Containers', 'devops', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400'),
        ('Kubernetes Orchestration', 'devops', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400'),
        ('AWS Cloud Practitioner', 'cloud', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'),
        ('Machine Learning with Python', 'data', 'https://images.unsplash.com/photo-1518932945647-7a3661150492?w=400'),
        ('Deep Learning Basics', 'data', 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400'),
        ('SQL Data Analysis', 'database', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=400'),
        ('PostgreSQL Administration', 'database', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'),
        ('Cybersecurity Fundamentals', 'security', 'https://images.unsplash.com/photo-1510511459012-914015daedca?w=400'),
        ('Ethical Hacking 101', 'security', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400'),
        ('UI/UX Design Principles', 'design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'),
        ('Figma Prototyping Masterclass', 'design', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'),
        ('C++ for Game Dev', 'gamedev', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'),
        ('Unity 3D Basics', 'gamedev', 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400'),
        ('Unreal Engine Masterclass', 'gamedev', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'),
        ('Blockchain & Web3', 'web3', 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400'),
        ('Ethereum Smart Contracts', 'web3', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400')
    ]

    for title, cat, thumb in tech_stack:
        for level in ['beginner', 'intermediate', 'advanced']:
            lvl_name = level.replace("beginner", "Pemula").replace("intermediate", "Menengah").replace("advanced", "Mahir")
            courses.append({
                'id': str(uuid.uuid4()),
                'title': f'{title} ({lvl_name})',
                'description': f'Pelajari {title} untuk tingkat {level}. Materi dirancang khusus agar mudah dipahami, langsung praktik dengan studi kasus industri. Sangat cocok bagi Anda untuk meningkatkan kemampuan ke jenjang {lvl_name}.',
                'thumbnail': thumb,
                'price': 0 if level == 'beginner' else (199000 if level == 'intermediate' else 299000),
                'is_free': level == 'beginner',
                'category': cat,
                'level': level,
                'duration_hours': 10 if level == 'beginner' else (25 if level == 'intermediate' else 40),
                'instructor': 'Firza Ilmi',
                'created_at': now,
                'updated_at': now
            })
    
    await db.courses.delete_many({})
    await db.courses.insert_many(courses)
    print(f"   ✅ Inserted {len(courses)} courses")
    
    # ============ Seed Videos ============
    print("\n🎥 Seeding videos & exercises...")
    videos = []
    
    # JS Videos & Moduls
    videos.extend([
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': '1. Pengenalan JavaScript Paling Dasar', 'video_url': 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration_minutes': 15, 'is_preview': True, 'order': 1, 'type': 'video', 'description': 'Silakan tonton video ini untuk mengerti konsep JS.', 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': '2. Materi: Dokumentasi Asli JS (MDN)', 'video_url': 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'duration_minutes': 20, 'is_preview': False, 'order': 2, 'type': 'video', 'description': 'Silahkan baca dokumentasi resmi di MDN Web Docs sebelum lanjut: https://developer.mozilla.org/id/docs/Web/JavaScript/Guide/Introduction', 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': '3. Latihan JS (Tingkat: MUDAH)', 'video_url': 'quiz', 'duration_minutes': 10, 'is_preview': False, 'order': 3, 'type': 'quiz', 'description': 'Uji pemahaman dasar mu! Selesaikan latihan gampang ini untuk dapat bintang tambahan.', 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': js_id, 'title': '4. Latihan JS (Tingkat: SULIT)', 'video_url': 'quiz', 'duration_minutes': 30, 'is_preview': False, 'order': 4, 'type': 'quiz', 'description': 'Lebih menantang, mari kita uji skill logika JavaScript kamu.', 'created_at': now}
    ])

    # React Videos
    videos.extend([
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'Intro to React & Setup', 'video_url': 'https://www.youtube.com/watch?v=bMknfKXIFA8', 'duration_minutes': 25, 'is_preview': True, 'order': 1, 'type': 'video', 'description': 'Panduan React.js pemula oleh programmer favorit.', 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'Materi Dokumentasi Resmi React', 'video_url': 'https://www.youtube.com/watch?v=bMknfKXIFA8', 'duration_minutes': 15, 'is_preview': False, 'order': 2, 'type': 'video', 'description': 'Baca panduan resminya di react.dev/learn', 'created_at': now},
        {'id': str(uuid.uuid4()), 'course_id': react_id, 'title': 'Latihan Analisa React DOM (Sedang)', 'video_url': 'quiz', 'duration_minutes': 20, 'is_preview': False, 'order': 3, 'type': 'quiz', 'description': 'Kerjakan soal-soal ini untuk mengklaim reward.', 'created_at': now}
    ])

    # Auto-generate videos for other courses that don't have explicit videos
    course_ids_with_videos = {js_id, react_id}
    for c in courses:
        cid = c['id']
        if cid not in course_ids_with_videos:
            videos.extend([
                {'id': str(uuid.uuid4()), 'course_id': cid, 'title': '1. Pengantar & Setup Awal (Gratis)', 'video_url': 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration_minutes': 15, 'is_preview': True, 'order': 1, 'type': 'video', 'description': 'Silakan tonton video ini untuk mengerti konsep awal.', 'created_at': now},
                {'id': str(uuid.uuid4()), 'course_id': cid, 'title': '2. Teori Lengkap Pendalaman', 'video_url': 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'duration_minutes': 35, 'is_preview': False, 'order': 2, 'type': 'video', 'description': 'Pembahasan lebih dalam mengenai topik dari expert kami.', 'created_at': now},
                {'id': str(uuid.uuid4()), 'course_id': cid, 'title': '3. Kuis Evaluasi', 'video_url': 'quiz', 'duration_minutes': 20, 'is_preview': False, 'order': 3, 'type': 'quiz', 'description': 'Uji pemahaman dasar mu! Selesaikan latihan ini.', 'created_at': now},
                {'id': str(uuid.uuid4()), 'course_id': cid, 'title': '4. Praktik & Live Coding Server', 'video_url': 'https://www.youtube.com/watch?v=bMknfKXIFA8', 'duration_minutes': 60, 'is_preview': False, 'order': 4, 'type': 'video', 'description': 'Praktik langsung membuat project.', 'created_at': now},
                {'id': str(uuid.uuid4()), 'course_id': cid, 'title': '5. Final Exam Project', 'video_url': 'quiz', 'duration_minutes': 90, 'is_preview': False, 'order': 5, 'type': 'quiz', 'description': 'Dapatkan sertifikatmu setelah menyelesaikan project akhir ini.', 'created_at': now}
            ])

    await db.videos.delete_many({})
    await db.videos.insert_many(videos)
    print(f"   ✅ Inserted {len(videos)} videos")

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
