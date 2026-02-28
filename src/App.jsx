import { useState, useEffect } from 'react'
import OfficeSimulator from './office-simulator'

function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calcScale = () => {
      const phoneH = 800 + 100; // game height + bezels (top 60 + bottom 40)
      const phoneW = 480 + 24;  // game width + bezels (left 12 + right 12)
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const s = Math.min(vh / phoneH, vw / phoneW, 1.15);
      setScale(s);
    };
    calcScale();
    window.addEventListener("resize", calcScale);
    return () => window.removeEventListener("resize", calcScale);
  }, []);

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#06060f",
      overflow: "hidden",
    }}>
      {/* Phone Frame */}
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Phone Body */}
        <div style={{
          width: 480 + 24,
          borderRadius: 40,
          background: "linear-gradient(145deg, #1a1a2e, #0f0f1a)",
          border: "3px solid #2a2a3e",
          boxShadow: "0 0 60px rgba(100,80,200,0.08), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "0 12px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top Bezel — notch + speaker */}
          <div style={{
            height: 52,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Notch */}
            <div style={{
              width: 140, height: 28,
              background: "#0a0a14",
              borderRadius: "0 0 18px 18px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "inset 0 -1px 3px rgba(0,0,0,0.5)",
            }}>
              {/* Camera */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "radial-gradient(circle, #1a1a3a, #0a0a18)",
                border: "1.5px solid #2a2a4a",
              }} />
              {/* Speaker */}
              <div style={{
                width: 44, height: 4, borderRadius: 2,
                background: "#1a1a2a",
                border: "0.5px solid #2a2a3a",
              }} />
            </div>
          </div>

          {/* Game Screen */}
          <div style={{
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #1a1a2e",
          }}>
            <OfficeSimulator />
          </div>

          {/* Bottom Bezel — home indicator */}
          <div style={{
            height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 120, height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.12)",
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
