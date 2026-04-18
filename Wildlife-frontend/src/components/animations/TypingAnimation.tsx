import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TypingAnimationProps {
  words: string[];
  className?: string;
}

export const TypingAnimation = ({ words, className }: TypingAnimationProps) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      Math.random() * 100 + 50,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <div className={className}>
      <span>{words[index].substring(0, subIndex)}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-primary ml-1"
      />
    </div>
  );
};
