"use client"

import { useState, useEffect } from 'react'

const palabraDiaria = {
  espanol: "Aventura",
  ingles: "Adventure",
  significado: "Una experiencia emocionante o inusual.",
  ejemplo: "Viajar por el mundo es una gran aventura."
}

export default function PalabraDelDia() {
  const [visible, setVisible] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientY / window.innerHeight - 0.5) * 20
      const y = (e.clientX / window.innerWidth - 0.5) * 20
      setRotation({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 overflow-hidden pixel-art-container">
      <div className="scene">
        <div 
          className={`pixel-art-card ${visible ? 'visible' : ''}`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          <div className="pixel-art-content">
            <h2 className="pixel-art-title">Palabra del Día</h2>
            <div className="pixel-art-word">
              <span className="pixel-art-label">ES:</span> {palabraDiaria.espanol}
            </div>
            <div className="pixel-art-word">
              <span className="pixel-art-label">EN:</span> {palabraDiaria.ingles}
            </div>
            <p className="pixel-art-meaning">{palabraDiaria.significado}</p>
            <p className="pixel-art-example">{palabraDiaria.ejemplo}</p>
          </div>
          <div className="flames">
            <div className="flame"></div>
            <div className="flame"></div>
            <div className="flame"></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .pixel-art-container {
          perspective: 1000px;
        }
        .scene {
          width: 300px;
          height: 400px;
          perspective: 1000px;
        }
        .pixel-art-card {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: #1a1a1a;
          border: 4px solid #ff6600;
          padding: 16px;
          transform-style: preserve-3d;
          transform: rotateX(0) rotateY(0);
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
          opacity: 0;
        }
        .pixel-art-card.visible {
          opacity: 1;
        }
        .pixel-art-content {
          font-family: 'Courier New', monospace;
          transform: translateZ(20px);
        }
        .pixel-art-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
          text-align: center;
          color: #ffcc00;
          text-shadow: 2px 2px 0 #ff6600;
        }
        .pixel-art-word {
          font-size: 18px;
          margin-bottom: 8px;
          color: #ff9933;
        }
        .pixel-art-label {
          font-weight: bold;
          color: #ffcc00;
        }
        .pixel-art-meaning, .pixel-art-example {
          font-size: 14px;
          line-height: 1.4;
          margin-top: 8px;
          color: #f0f0f0;
        }
        .pixel-art-example {
          font-style: italic;
          color: #cccccc;
        }
        .flames {
          position: absolute;
          bottom: -20px;
          left: -20px;
          right: -20px;
          height: 40px;
          transform: translateZ(-1px);
        }
        .flame {
          position: absolute;
          bottom: 0;
          width: 40px;
          height: 40px;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHDSURBVHgB7ZjRUcMwDIZlOgEjMAIjMAIjMAIjdASOwAgdgRFgBEaAERiBDegGkU+6XOJzHDtNn3p3/s5xLH2RZcvOmTNnzpzZEOfcFVzAHUzgGT5M4RXeYQADfPZmGAO4hzHMoA8TWIBPeIExPJkNAw9wBSN4A5/wAVMYwRgeYWcEXcAVfIEJzKEPQ7iFW/P/WMEYZjCBKYxgAJfmSMC9wQzGcAWX5kjBHcELTODWHDm4N5jBCC7MEYPbgzF8wLU5UnD78A6XZgcAVwXuBK7hDm5gCFMYwwz6MIIBXMIVXMCZqQFcFbhbGMEcpvAMfXiEO7iBK7gwNYGrAncBQ5jAM0zgHvrwALdwbWoEVwWuDxOYwwz6MIRHuDU1g6sC9wITmMIzvMIQHuDG1AyuCtwIpjCGGTzBHVybmsGdGFzZxXkNuGPBHRNuJ3Aqm7jOJt5l4lqbuNYmrrWJa23iWpu41iautYlrbeJam7jWJq61iWtt4lqbuNYmrrWJa23iWpu41iautYlrbeJam7jWJq61iWtt4lqbuNYmrrWJa23iWpu41iautYlrbeJam7jWJq61iWtt4lqb+D9Ym/gLPTgpIcIqnXEAAAAASUVORK5CYII=');
          background-size: 160px 40px;
          image-rendering: pixelated;
          animation: flameAnimation 0.5s steps(4) infinite;
        }
        .flame:nth-child(1) { left: 10%; animation-delay: -0.1s; }
        .flame:nth-child(2) { left: 50%; transform: translateX(-50%); }
        .flame:nth-child(3) { right: 10%; animation-delay: -0.2s; }
        @keyframes flameAnimation {
          0% { background-position: 0 0; }
          100% { background-position: -160px 0; }
        }
      `}</style>
    </div>
  )
}
