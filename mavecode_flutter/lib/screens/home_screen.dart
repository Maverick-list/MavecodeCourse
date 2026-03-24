import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../theme/app_theme.dart';
import '../widgets/course_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final List<Map<String, dynamic>> _dummyCourses = [
    {
      'title': 'Full Stack Developer 2026',
      'category': 'Web Development',
      'price': 'Rp 499.000',
      'image':
          'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'rating': 4.8,
      'students': 1250,
    },
    {
      'title': 'Flutter Mobile Masterclass',
      'category': 'Mobile App',
      'price': 'Rp 399.000',
      'image':
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'rating': 4.9,
      'students': 850,
    },
    {
      'title': 'Python & AI for Beginners',
      'category': 'Data Science',
      'price': 'Rp 299.000',
      'image':
          'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'rating': 4.7,
      'students': 2100,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: RichText(
          text: TextSpan(
            style: GoogleFonts.rajdhani(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              letterSpacing: 2.0,
            ),
            children: [
              const TextSpan(
                text: 'MAVE',
                style: TextStyle(color: AppTheme.surface),
              ), // Will be corrected by Theme but let's override locally for effect
              TextSpan(
                text: 'MAVE',
                style: TextStyle(
                  color: Colors.white,
                  shadows: [Shadow(color: AppTheme.primary, blurRadius: 10)],
                ),
              ),
              TextSpan(
                text: 'CODE',
                style: TextStyle(
                  color: AppTheme.primary,
                  shadows: [Shadow(color: AppTheme.primary, blurRadius: 15)],
                ),
              ),
            ],
          ),
        ),
        actions: [
          IconButton(icon: const Icon(LucideIcons.bell), onPressed: () {}),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            _buildHeroSection(),

            const SizedBox(height: 24),

            // Categories
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'KATEGORI POPULER',
                style: Theme.of(context).textTheme.labelLarge,
              ),
            ),
            const SizedBox(height: 12),
            _buildCategories(),

            const SizedBox(height: 24),

            // Featured Courses
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'KURSUS TERBARU',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  Text(
                    'Lihat Semua',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.primary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _dummyCourses.length,
              itemBuilder: (context, index) {
                final course = _dummyCourses[index];
                return CourseCard(
                  course: course,
                ).animate().fadeIn(delay: (100 * index).ms).slideX();
              },
            ),
            const SizedBox(height: 80), // Specs for Nav Bar overlay
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(LucideIcons.bookOpen),
            label: 'Kursus',
          ),
          BottomNavigationBarItem(
            icon: Icon(LucideIcons.layoutGrid),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(LucideIcons.user),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.surface, AppTheme.surface.withOpacity(0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.primary.withOpacity(0.5)),
            ),
            child: Text(
              'NEW SEASON 2026',
              style: GoogleFonts.spaceMono(
                fontSize: 10,
                color: AppTheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'MULAI KARIR\nCODINGMU\nSEKARANG',
            style: GoogleFonts.rajdhani(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              height: 1.1,
              color: Colors.white,
            ),
          ).animate().shimmer(
            duration: 2000.ms,
            color: AppTheme.primary.withOpacity(0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'Belajar dari mentor expert dengan kurikulum standar industri global.',
            style: GoogleFonts.inter(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                shadowColor: AppTheme.primary.withOpacity(0.5),
                elevation: 8,
              ),
              child: const Text('GABUNG CLUB MEMBER ->'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategories() {
    final categories = ['All', 'Web Dev', 'Mobile', 'UI/UX', 'AI', 'DevOps'];
    return SizedBox(
      height: 40,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final isSelected = index == 0;
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected ? AppTheme.primary : AppTheme.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isSelected ? AppTheme.primary : AppTheme.border,
              ),
            ),
            child: Center(
              child: Text(
                categories[index],
                style: GoogleFonts.spaceMono(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: isSelected
                      ? AppTheme.background
                      : AppTheme.textSecondary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
