import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to detect the current page context to provide dynamic instructions
 * to the MaveMentor AI.
 */
export const usePageContext = () => {
    const location = useLocation();
    const [pageContext, setPageContext] = useState({
        language: 'JavaScript',
        topic: 'General Coding',
        pageType: 'app'
    });

    useEffect(() => {
        const detectContext = () => {
            const currentPath = location.pathname;
            let language = 'General Programming';
            let topic = 'General Platform Usage';
            let pageType = 'page';

            // 1. Detect Page Type
            if (currentPath.includes('/courses/')) {
                pageType = 'course';
            } else if (currentPath.includes('/dashboard')) {
                pageType = 'dashboard';
            } else if (currentPath.includes('/articles')) {
                pageType = 'article';
            }

            // 2. Extract texts from DOM
            const docTitle = document.title || '';
            const h1Element = document.querySelector('h1')?.innerText || '';
            const h2Element = document.querySelector('h2')?.innerText || ''; 
            
            const combinedText = `${docTitle} ${h1Element} ${h2Element} ${currentPath}`.toLowerCase();

            // 3. Language & Tech Stack Detection Heuristic
            if (combinedText.includes('react') || combinedText.includes('jsx')) language = 'React / JSX';
            else if (combinedText.includes('next.js') || combinedText.includes('nextjs')) language = 'Next.js / React';
            else if (combinedText.includes('python')) language = 'Python';
            else if (combinedText.includes('java ') || combinedText.endsWith('java')) language = 'Java';
            else if (combinedText.includes('cpp') || combinedText.includes('c++')) language = 'C++';
            else if (combinedText.includes('html') || combinedText.includes('css')) language = 'HTML/CSS';
            else if (combinedText.includes('javascript') || combinedText.includes(' js')) language = 'JavaScript';
            else if (combinedText.includes('typescript') || combinedText.includes(' ts')) language = 'TypeScript';

            // 4. Topic Detection Heuristic
            if (h1Element && pageType !== 'dashboard') {
                topic = h1Element;
            } else if (h2Element && pageType === 'course') {
                // In course player, h2 often holds the current video title
                topic = h2Element;
            } else {
                topic = docTitle.split('|')[0].trim() || 'General Learning';
            }

            setPageContext({ language, topic, pageType });
        };

        // Delay slightly to allow DOM to render dynamically (especially in SPAs)
        const timer = setTimeout(detectContext, 1000);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return pageContext;
};

export default usePageContext;
