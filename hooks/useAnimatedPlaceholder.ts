import { useState, useEffect, useRef } from 'react';

export const useAnimatedPlaceholder = (
  examples: string[],
  staticPlaceholder: string,
  isReady: boolean,
  prompt: string
): string => {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(staticPlaceholder);
  const typingTimeoutRef = useRef<number | null>(null);
  const examplesRef = useRef(examples);

  useEffect(() => {
    examplesRef.current = examples;
  }, [examples]);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isReady && prompt.length === 0 && examplesRef.current.length > 0) {
      const shuffledExamples = [...examplesRef.current].sort(() => 0.5 - Math.random());
      
      let exampleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const type = () => {
        const currentExample = shuffledExamples[exampleIndex];
        let displayText = '';

        if (isDeleting) {
          displayText = currentExample.substring(0, charIndex - 1);
          charIndex--;
        } else {
          displayText = currentExample.substring(0, charIndex + 1);
          charIndex++;
        }
        
        setAnimatedPlaceholder(`e.g., '${displayText}'`);

        // Increased speed: deleting is faster than typing
        let typingSpeed = isDeleting ? 15 : 50;

        if (!isDeleting && charIndex === currentExample.length) {
          typingSpeed = 2000; // Pause after typing
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          exampleIndex = (exampleIndex + 1) % shuffledExamples.length;
          typingSpeed = 500; // Pause before typing next one
        }

        typingTimeoutRef.current = window.setTimeout(type, typingSpeed);
      };
      
      typingTimeoutRef.current = window.setTimeout(type, 100);

    } else {
      setAnimatedPlaceholder(staticPlaceholder);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isReady, prompt, staticPlaceholder]);

  return animatedPlaceholder;
};