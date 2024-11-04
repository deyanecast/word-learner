"use client"

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  life: number
}

export default function LlamaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Reducimos el número de partículas
    const particles: Particle[] = []
    const particleCount = 150 // Menos partículas

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        radius: Math.random() * 3 + 1, // Partículas más pequeñas
        vx: Math.random() * 2 - 1, // Menos movimiento horizontal
        vy: -Math.random() * 4 - 1, // Menos velocidad vertical
        life: Math.random() * 0.6 + 0.4 // Menos vida y brillo
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      // Aumentamos la opacidad del fondo para que las llamas sean menos visibles
      ctx.fillStyle = 'rgba(26, 26, 26, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.005 // Vida más larga, desvanecimiento más lento

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        )
        // Colores más suaves
        gradient.addColorStop(0, `rgba(255, 150, 0, ${particle.life * 0.7})`)
        gradient.addColorStop(0.4, `rgba(255, 80, 0, ${particle.life * 0.5})`)
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        if (particle.life <= 0) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 20,
            radius: Math.random() * 3 + 1,
            vx: Math.random() * 2 - 1,
            vy: -Math.random() * 4 - 1,
            life: 1
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: '#1a1a1a' }}
    />
  )
} 