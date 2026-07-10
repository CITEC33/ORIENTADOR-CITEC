import { useEffect, useRef, useState } from 'react'
import quilaAvatarPoster from '../assets/imgs/quila-avatar-poster.png'
import quilaAvatarVideo from '../assets/videos/quila-avatar-animated.mp4'

/**
 * Avatar circular de Aquila con video animado (Grok) y fallback a imagen.
 * - Respeta prefers-reduced-motion (usa imagen estática).
 * - Autoplay defensivo para iOS/Safari.
 *
 * Props:
 *  - size: 'sm' | 'md' | 'lg' | number (px)
 *  - className: clases extra para el contenedor
 *  - rounded: 'full' | '2xl' | '3xl' (default 'full')
 *  - border: boolean (default true)
 */
const SIZES = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28'
}

const RADIUS = {
  full: 'rounded-full',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl'
}

const AquilaAvatar = ({
  size = 'md',
  className = '',
  rounded = 'full',
  border = true,
  alt = 'Aquila, mascota de UNES'
}) => {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => v.play?.().catch(() => {})
    if (v.readyState >= 2) tryPlay()
    v.addEventListener('canplay', tryPlay)
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  const sizeClass =
    typeof size === 'string' ? SIZES[size] || SIZES.md : ''
  const radiusClass = RADIUS[rounded] || RADIUS.full
  const styleSize =
    typeof size === 'number' ? { width: size, height: size } : undefined

  const borderStyle = border
    ? {
        border: '2px solid rgba(147,197,253,0.4)',
        boxShadow: '0 6px 14px rgba(2,13,51,0.4)'
      }
    : undefined

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${sizeClass} ${radiusClass} ${className}`}
      style={{ ...styleSize, ...borderStyle }}
    >
      <img
        src={quilaAvatarPoster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          ready && !prefersReducedMotion ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          src={quilaAvatarVideo}
          poster={quilaAvatarPoster}
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          aria-hidden
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

export default AquilaAvatar
