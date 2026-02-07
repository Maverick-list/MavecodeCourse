import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API } from '../context/AppContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';


export const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${API}/faqs`);
        setFaqs(res.data);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        // Fallback FAQs
        setFaqs([
          { id: '1', question: 'Apakah saya perlu pengalaman coding sebelumnya?', answer: 'Tidak! Kursus kami dirancang untuk pemula. Kamu bisa mulai dari nol dan belajar step by step.', category: 'general' },
          { id: '2', question: 'Bagaimana cara mengakses kursus premium?', answer: 'Kamu bisa berlangganan paket Pro atau Enterprise untuk mengakses semua kursus premium, live class, dan fitur eksklusif lainnya.', category: 'subscription' },
          { id: '3', question: 'Apakah ada sertifikat setelah menyelesaikan kursus?', answer: 'Ya! Setiap kursus yang diselesaikan akan mendapatkan sertifikat digital yang bisa kamu bagikan di LinkedIn atau CV.', category: 'certificate' },
          { id: '4', question: 'Berapa lama akses kursus berlaku?', answer: 'Untuk kursus yang sudah dibeli atau selama berlangganan aktif, kamu bisa mengakses materi selamanya tanpa batas waktu.', category: 'subscription' },
          { id: '5', question: 'Bagaimana jika saya stuck atau butuh bantuan?', answer: 'Kamu bisa bertanya di forum komunitas, menggunakan fitur AI chatbot, atau hubungi mentor langsung via live class (untuk member Pro/Enterprise).', category: 'support' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-muted-foreground text-lg">
            Temukan jawaban untuk pertanyaan umum tentang Mavecode
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                    data-testid={`faq-${faq.id}`}
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16 p-8 bg-card border border-border rounded-2xl"
        >
          <h3 className="font-heading font-semibold text-xl mb-2">
            Masih punya pertanyaan?
          </h3>
          <p className="text-muted-foreground mb-6">
            Tim kami siap membantu menjawab pertanyaanmu
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:firzailmidja@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              data-testid="faq-email"
            >
              Kirim Email
            </a>
            <a
              href="https://wa.me/6285191769521"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-muted transition-colors"
              data-testid="faq-whatsapp"
            >
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
