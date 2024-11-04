"use client"

export default function FireBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="fire-container">
        <div className="fire-rows">
          {[...Array(10)].map((_, rowIndex) => (
            <div key={rowIndex} className="fire-row">
              {[...Array(20)].map((_, colIndex) => (
                <div key={colIndex} className="fire-pixel" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .fire-container {
          width: 100%;
          height: 100%;
          background-color: #1a1a1a;
          overflow: hidden;
        }
        .fire-rows {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .fire-row {
          display: flex;
          justify-content: space-around;
          flex: 1;
        }
        .fire-pixel {
          width: 100%;
          height: 100%;
          background-color: #ff6600;
          opacity: 0;
          animation: flicker 2s infinite;
          animation-delay: ${Math.random() * 2}s;
        }
        @keyframes flicker {
          0% { opacity: 0; }
          25% { opacity: 0.4; }
          50% { opacity: 0.2; }
          75% { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
} 