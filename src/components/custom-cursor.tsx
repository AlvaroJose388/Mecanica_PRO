'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Wrench } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    // Si es móvil, no ocultamos el cursor del sistema y no ejecutamos la lógica
    if (isMobile) {
      document.body.classList.remove('hide-system-cursor');
      return;
    }

    // Añadimos la clase para ocultar el cursor del sistema en desktop
    document.body.classList.add('hide-system-cursor');

    const updateCursorPosition = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-20%, -20%) ${isHovering ? 'rotate(45deg)' : 'rotate(-10deg)'} ${isClicking ? 'scale(0.8)' : 'scale(1)'}`;
      }
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateCursorPosition, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      document.body.classList.remove('hide-system-cursor');
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isVisible, isHovering, isClicking, isMobile]);

  if (!mounted || isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 pointer-events-none z-[9999] text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        willChange: 'transform',
      }}
    >
      <Wrench size={24} strokeWidth={2.5} fill="currentColor" fillOpacity={isHovering ? 0.2 : 0} />
    </div>
  );
}
