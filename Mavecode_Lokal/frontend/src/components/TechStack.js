import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const techIcons = [
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'JS', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { name: 'TS', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'C', icon: 'https://cdn.simpleicons.org/c/A8B9CC' },
  { name: 'C++', icon: 'https://cdn.simpleicons.org/cplusplus/00599C' },
  { name: 'Kotlin', icon: 'https://cdn.simpleicons.org/kotlin/7F52FF' },
  { name: 'HTML', icon: 'https://cdn.simpleicons.org/html5/E34F26' },
  { name: 'CSS', icon: 'https://cdn.simpleicons.org/css3/1572B6' },
  { name: 'Bash', icon: 'https://cdn.simpleicons.org/gnubash/4EAA25' },
  { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/white' },
  { name: 'Bootstrap', icon: 'https://cdn.simpleicons.org/bootstrap/7952B3' },
  { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'Django', icon: 'https://cdn.simpleicons.org/django/092E20' },
  { name: 'Flask', icon: 'https://cdn.simpleicons.org/flask/white' },
  { name: 'FastAPI', icon: 'https://cdn.simpleicons.org/fastapi/05998B' },
  { name: 'Tensorflow', icon: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
  { name: 'PyTorch', icon: 'https://cdn.simpleicons.org/pytorch/EE4C2C' },
  { name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E' },
  { name: 'OpenCV', icon: 'https://cdn.simpleicons.org/opencv/5C3EE8' },
  { name: 'NumPy', icon: 'https://cdn.simpleicons.org/numpy/013243' },
  { name: 'Tailwind', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  { name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas/150458' },
  { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
  { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248' },
  { name: 'Firebase', icon: 'https://cdn.simpleicons.org/firebase/FFCA28' },
  { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D' },
  { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'Azure', icon: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
  { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white' },
  { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux/FCC624' },
  { name: 'AWS', icon: 'https://cdn.simpleicons.org/amazonaws/232F3E' },
  { name: 'VS Code', icon: 'https://cdn.simpleicons.org/visualstudiocode/007ACC' },
  { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/white' },
  { name: 'Jupyter', icon: 'https://cdn.simpleicons.org/jupyter/F37626' },
  { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/F24E1E' },
  { name: 'Postman', icon: 'https://cdn.simpleicons.org/postman/FF6C37' },
  { name: 'Photoshop', icon: 'https://cdn.simpleicons.org/adobephotoshop/31A8FF' },
  { name: 'HuggingFace', icon: 'https://cdn.simpleicons.org/huggingface/FFD21E' },
  { name: 'MS Office', icon: 'https://cdn.simpleicons.org/microsoftoffice/D83B01' }
];

const TechStack = () => {
  const { t } = useLanguage();
  // Arrange icons in a heart-like / triangular grid shape
  const rows = [
    techIcons.slice(0, 12),
    techIcons.slice(12, 22),
    techIcons.slice(22, 30),
    techIcons.slice(30, 36),
    techIcons.slice(36, 40),
    techIcons.slice(40, 42)
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-card/30 dark:bg-black/60 font-mono transition-colors duration-500">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(62,48,154,0.15),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black italic tracking-tighter text-foreground uppercase mb-4"
          >
            {t('techStackTitle').split(' ')[0]} <span className="text-primary">{t('techStackTitle').split(' ').slice(1).join(' ')}</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-4 text-accent text-xs">
            <div className="h-[1px] w-12 bg-accent/30" />
            <span>{t('spectrumCapabilities')}</span>
            <div className="h-[1px] w-12 bg-accent/30" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-3">
              {row.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (rowIndex * 0.1) + (i * 0.05) }}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: '0 0 25px rgba(0,255,255,0.4)',
                    borderColor: '#00FFFF'
                  }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-1 backdrop-blur-md cursor-help transition-all group overflow-hidden relative shadow-sm hover:shadow-primary/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={tech.icon} 
                    alt={tech.name} 
                    className="w-7 h-7 md:w-8 md:h-8 object-contain transition-transform duration-300 group-hover:scale-110" 
                    onError={(e) => { e.target.src = 'https://cdn.simpleicons.org/code/white'; }}
                  />
                  <span className="text-[8px] md:text-[10px] text-white/40 group-hover:text-white transition-colors text-center px-1 font-bold truncate w-full">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
