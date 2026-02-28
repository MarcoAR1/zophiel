import { useState, useRef, useCallback } from 'react';
import {
  BODY_REGION_LABELS,
  PAIN_INTENSITY_LEVELS,
  PAIN_INTENSITY_LABELS,
  PAIN_INTENSITY_COLORS,
  PAIN_LEVEL_RANGES,
  type BodyRegion,
  type PainIntensityLevel,
} from '@zophiel/shared';
import '../styles/body-map.css';

interface BodyMapProps {
  musclePainLevels: Partial<Record<BodyRegion, PainIntensityLevel>>;
  onSetMusclePain: (region: BodyRegion, level: PainIntensityLevel | null) => void;
}

interface ZoneDef {
  id: BodyRegion;
  d: string;
}

// ── Anatomically improved SVG zones (viewBox 0 0 200 480) ──

const FRONT_ZONES: ZoneDef[] = [
  // Head — rounded cranium
  { id: 'head_front', d: 'M100,2 C88,2 82,10 82,22 L82,30 C82,32 84,34 88,34 L112,34 C116,34 118,32 118,30 L118,22 C118,10 112,2 100,2 Z' },
  // Face
  { id: 'face', d: 'M88,34 C88,34 86,36 86,40 L86,50 C86,56 92,62 100,62 C108,62 114,56 114,50 L114,40 C114,36 112,34 112,34 Z' },
  // Neck
  { id: 'neck_front', d: 'M93,62 L107,62 C107,62 109,66 109,72 L91,72 C91,66 93,62 93,62 Z' },
  // Left shoulder
  { id: 'left_shoulder_front', d: 'M60,76 C56,74 50,76 48,80 L54,88 L68,86 L91,82 L91,72 L78,72 C72,72 64,73 60,76 Z' },
  // Right shoulder
  { id: 'right_shoulder_front', d: 'M140,76 C144,74 150,76 152,80 L146,88 L132,86 L109,82 L109,72 L122,72 C128,72 136,73 140,76 Z' },
  // Chest left
  { id: 'chest_left', d: 'M68,86 L91,82 L98,82 L98,124 L70,114 Z' },
  // Chest right
  { id: 'chest_right', d: 'M102,82 L109,82 L132,86 L130,114 L102,124 Z' },
  // Upper arm left
  { id: 'left_upper_arm_front', d: 'M48,80 L54,88 L68,86 L70,114 C70,114 62,116 58,120 L56,136 L44,136 L40,98 Z' },
  // Upper arm right
  { id: 'right_upper_arm_front', d: 'M152,80 L146,88 L132,86 L130,114 C130,114 138,116 142,120 L144,136 L156,136 L160,98 Z' },
  // Forearm left
  { id: 'left_forearm_front', d: 'M44,136 L56,136 L54,180 C54,180 52,192 50,196 L36,196 C38,188 40,176 44,136 Z' },
  // Forearm right
  { id: 'right_forearm_front', d: 'M144,136 L156,136 L160,176 C160,176 162,188 164,196 L150,196 C148,192 146,180 144,136 Z' },
  // Left hand
  { id: 'left_hand', d: 'M36,196 L50,196 C50,196 50,208 48,216 C46,222 42,226 38,226 C34,226 32,220 32,214 C32,208 34,200 36,196 Z' },
  // Right hand
  { id: 'right_hand', d: 'M150,196 L164,196 C164,196 166,200 168,214 C168,220 166,226 162,226 C158,226 154,222 152,216 C150,208 150,196 150,196 Z' },
  // Abdomen upper
  { id: 'abdomen_upper', d: 'M74,124 L126,124 L128,158 L72,158 Z' },
  // Abdomen lower
  { id: 'abdomen_lower', d: 'M72,158 L128,158 L130,192 L70,192 Z' },
  // Left hip
  { id: 'left_hip_front', d: 'M62,178 L70,192 L80,208 L76,218 L60,200 Z' },
  // Right hip
  { id: 'right_hip_front', d: 'M138,178 L130,192 L120,208 L124,218 L140,200 Z' },
  // Groin
  { id: 'groin', d: 'M80,208 L120,208 L114,226 L100,232 L86,226 Z' },
  // Left thigh
  { id: 'left_thigh_front', d: 'M76,226 L94,228 L92,316 L74,316 Z' },
  // Right thigh
  { id: 'right_thigh_front', d: 'M106,228 L124,226 L126,316 L108,316 Z' },
  // Left knee
  { id: 'left_knee_front', d: 'M74,316 L92,316 C92,316 93,326 93,336 C93,346 92,350 92,350 L74,350 C74,350 73,346 73,336 C73,326 74,316 74,316 Z' },
  // Right knee
  { id: 'right_knee_front', d: 'M108,316 L126,316 C126,316 127,326 127,336 C127,346 126,350 126,350 L108,350 C108,350 107,346 107,336 C107,326 108,316 108,316 Z' },
  // Left shin
  { id: 'left_shin', d: 'M74,350 L92,350 L90,434 L76,434 Z' },
  // Right shin
  { id: 'right_shin', d: 'M108,350 L126,350 L124,434 L110,434 Z' },
  // Left foot
  { id: 'left_foot', d: 'M70,434 L92,434 C92,434 94,446 92,456 C90,462 84,466 76,466 C70,466 66,460 66,454 C66,448 68,440 70,434 Z' },
  // Right foot
  { id: 'right_foot', d: 'M108,434 L130,434 C130,434 132,440 134,454 C134,460 130,466 124,466 C116,466 110,462 108,456 C106,446 108,434 108,434 Z' },
];

const BACK_ZONES: ZoneDef[] = [
  // Head back
  { id: 'head_back', d: 'M100,2 C88,2 82,10 82,22 L82,46 C82,56 90,62 100,62 C110,62 118,56 118,46 L118,22 C118,10 112,2 100,2 Z' },
  // Neck back
  { id: 'neck_back', d: 'M93,62 L107,62 C107,62 109,66 109,72 L91,72 C91,66 93,62 93,62 Z' },
  // Left shoulder back
  { id: 'left_shoulder_back', d: 'M48,80 L78,72 L91,72 L91,82 L68,86 L54,88 Z' },
  // Right shoulder back
  { id: 'right_shoulder_back', d: 'M152,80 L122,72 L109,72 L109,82 L132,86 L146,88 Z' },
  // Upper back left
  { id: 'upper_back_left', d: 'M68,86 L98,82 L98,124 L70,114 Z' },
  // Upper back right
  { id: 'upper_back_right', d: 'M102,82 L132,86 L130,114 L102,124 Z' },
  // Mid back left
  { id: 'mid_back_left', d: 'M70,114 L98,124 L98,158 L72,152 Z' },
  // Mid back right
  { id: 'mid_back_right', d: 'M102,124 L130,114 L128,152 L102,158 Z' },
  // Lower back left
  { id: 'lower_back_left', d: 'M72,152 L98,158 L98,192 L74,186 Z' },
  // Lower back right
  { id: 'lower_back_right', d: 'M102,158 L128,152 L126,186 L102,192 Z' },
  // Left glute
  { id: 'left_glute', d: 'M74,192 L98,192 L96,236 C96,236 88,240 82,236 L76,226 Z' },
  // Right glute
  { id: 'right_glute', d: 'M102,192 L126,192 L124,226 L118,236 C112,240 104,236 104,236 Z' },
  // Upper arm back left
  { id: 'left_upper_arm_back', d: 'M40,98 L48,80 L54,88 L68,86 L70,114 L58,120 L56,136 L44,136 Z' },
  // Upper arm back right
  { id: 'right_upper_arm_back', d: 'M160,98 L152,80 L146,88 L132,86 L130,114 L142,120 L144,136 L156,136 Z' },
  // Forearm back left
  { id: 'left_forearm_back', d: 'M44,136 L56,136 L54,180 L50,196 L36,196 L40,176 Z' },
  // Forearm back right
  { id: 'right_forearm_back', d: 'M144,136 L156,136 L160,176 L164,196 L150,196 L146,180 Z' },
  // Left thigh back
  { id: 'left_thigh_back', d: 'M76,236 L96,236 L92,316 L74,316 Z' },
  // Right thigh back
  { id: 'right_thigh_back', d: 'M104,236 L124,236 L126,316 L108,316 Z' },
  // Left calf
  { id: 'left_calf', d: 'M74,350 L92,350 L90,434 L76,434 Z' },
  // Right calf
  { id: 'right_calf', d: 'M108,350 L126,350 L124,434 L110,434 Z' },
  // Left heel
  { id: 'left_heel', d: 'M76,434 L90,434 C90,434 92,446 90,456 L76,456 C74,446 76,434 76,434 Z' },
  // Right heel
  { id: 'right_heel', d: 'M110,434 L124,434 C124,434 126,446 124,456 L110,456 C108,446 110,434 110,434 Z' },
];

// ── Anatomically improved body silhouette ──

const BODY_OUTLINE_FRONT = `
  M100,2 C88,2 82,10 82,22 L82,46 C82,56 90,62 100,62 C110,62 118,56 118,46
  L118,22 C118,10 112,2 100,2 Z
  M93,62 C93,62 91,66 91,72 L78,72 C72,72 64,73 60,76 C56,74 50,76 48,80
  L40,98 L44,136 L36,196 C34,200 32,208 32,214 C32,220 34,226 38,226
  C42,226 46,222 48,216 C50,208 50,196 50,196 L56,136 L58,120
  C62,116 70,114 70,114 L68,86 L54,88 L60,76 L78,72
  M109,72 C109,72 107,62 107,62 L93,62 C93,62 91,72 91,72 L91,82
  L98,82 L98,124 L74,124 L72,158 L70,192 L62,178 L60,200 L76,218 L76,226
  L94,228 L92,316 L74,316 C74,316 73,326 73,336 C73,346 74,350 74,350
  L76,434 C68,440 66,448 66,454 C66,460 70,466 76,466 C84,466 90,462 92,456
  C94,446 92,434 92,434 L92,350 L92,316 L94,228
  L100,232 L106,228 L108,316 L108,350 L108,434
  C108,434 106,446 108,456 C110,462 116,466 124,466 C130,466 134,460 134,454
  C132,440 130,434 130,434 L126,350 L126,316 L124,226 L140,200 L138,178
  L130,192 L128,158 L126,124 L102,124 L102,82 L109,82
  L132,86 L146,88 L140,76 L122,72 L109,72
  L109,82 L142,120 L144,136 L156,136 L164,196
  C164,196 166,200 168,214 C168,220 166,226 162,226 C158,226 154,222 152,216
  C150,208 150,196 150,196 L144,136 L142,120 L130,114
  L152,80 L160,98 L156,136
`;

const BODY_OUTLINE_BACK = BODY_OUTLINE_FRONT; // Same silhouette for back view

// ── Cleaner single outline path ──
const SILHOUETTE = `
  M100,0 C87,0 80,10 80,24 L80,46 C80,58 89,64 100,64 C111,64 120,58 120,46
  L120,24 C120,10 113,0 100,0 Z
  M92,64 C92,64 90,68 90,72 L76,72 C68,72 58,76 54,80 L46,78
  C42,78 38,82 38,86 L38,96 L42,136 L34,196
  C32,204 30,214 30,218 C32,224 36,228 40,228 C44,228 48,224 50,218
  C52,210 52,196 52,196 L58,136 L60,118 L66,86 L54,88
  L66,86 L90,82 L98,82 L98,126 L72,126 L70,158 L68,192
  L60,180 L58,202 L74,224 L74,230 L92,232
  L90,318 L72,318 C72,324 72,340 72,352 L74,436
  C68,442 64,452 64,458 C64,464 68,470 76,470
  C84,470 90,464 92,458 C94,448 92,436 92,436
  L92,352 L94,318 L100,236 L106,318 L108,352
  L108,436 C108,436 106,448 108,458 C110,464 116,470 124,470
  C132,470 136,464 136,458 C136,452 132,442 126,436
  L128,352 C128,340 128,324 128,318 L110,318
  L108,232 L126,224 L142,202 L140,180 L132,192
  L130,158 L128,126 L102,126 L102,82 L110,82
  L134,86 L146,88 L134,86 L140,118 L142,136 L148,196
  C148,196 148,210 150,218 C152,224 156,228 160,228
  C164,228 168,224 170,218 C170,214 168,204 166,196
  L158,136 L162,96 L162,86 C162,82 158,78 154,78
  L146,80 C142,76 132,72 124,72 L110,72 C110,68 108,64 108,64 Z
`;

export default function BodyMap({ musclePainLevels, onSetMusclePain }: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [popupRegion, setPopupRegion] = useState<BodyRegion | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = useCallback((region: BodyRegion, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    if (popupRegion === region) {
      setPopupRegion(null);
      return;
    }
    setPopupPos({ x, y });
    setPopupRegion(region);
  }, [popupRegion]);

  const handleSelectLevel = (level: PainIntensityLevel) => {
    if (!popupRegion) return;
    if (musclePainLevels[popupRegion] === level) {
      onSetMusclePain(popupRegion, null);
    } else {
      onSetMusclePain(popupRegion, level);
    }
    setPopupRegion(null);
  };

  const getZoneClass = (zoneId: BodyRegion) => {
    const level = musclePainLevels[zoneId];
    let cls = 'body-zone';
    if (level) cls += ` pain-${level}`;
    if (popupRegion === zoneId) cls += ' zone-active';
    return cls;
  };

  const zones = view === 'front' ? FRONT_ZONES : BACK_ZONES;
  const muscleCount = Object.keys(musclePainLevels).length;

  return (
    <div className="body-map-container">
      {/* View toggle */}
      <div className="body-view-toggle">
        <button
          className={`body-view-btn ${view === 'front' ? 'active' : ''}`}
          onClick={() => { setView('front'); setPopupRegion(null); }}
        >
          🧑 Frontal
        </button>
        <button
          className={`body-view-btn ${view === 'back' ? 'active' : ''}`}
          onClick={() => { setView('back'); setPopupRegion(null); }}
        >
          🔄 Posterior
        </button>
      </div>

      {/* SVG body */}
      <div className="body-svg-wrapper" ref={containerRef}>
        <svg viewBox="0 0 200 480" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bodyGlow">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="zoneShadow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.4" />
            </filter>
            <filter id="painGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background glow */}
          <ellipse cx="100" cy="240" rx="82" ry="240" fill="url(#bodyGlow)" />

          {/* Body silhouette outline */}
          <path d={SILHOUETTE} className="body-outline" />

          {/* Interactive zones */}
          {zones.map((zone) => (
            <path
              key={zone.id}
              d={zone.d}
              className={getZoneClass(zone.id)}
              onClick={(e) => handleZoneClick(zone.id, e)}
              filter={musclePainLevels[zone.id] ? 'url(#painGlow)' : undefined}
            >
              <title>{BODY_REGION_LABELS[zone.id]}</title>
            </path>
          ))}
        </svg>

        {/* Pain level popup */}
        {popupRegion && (
          <div
            className="muscle-pain-popup"
            style={{
              left: `${Math.min(Math.max(popupPos.x, 80), containerRef.current ? containerRef.current.clientWidth - 80 : 200)}px`,
              top: `${popupPos.y}px`,
            }}
          >
            <div className="muscle-pain-popup-header">
              {BODY_REGION_LABELS[popupRegion]}
            </div>
            <div className="muscle-pain-popup-options">
              {PAIN_INTENSITY_LEVELS.map((level) => (
                <button
                  key={level}
                  className={`muscle-pain-option ${musclePainLevels[popupRegion] === level ? 'selected' : ''}`}
                  onClick={() => handleSelectLevel(level)}
                  style={{ '--level-color': PAIN_INTENSITY_COLORS[level] } as React.CSSProperties}
                >
                  <span className="muscle-pain-dot" style={{ background: PAIN_INTENSITY_COLORS[level] }} />
                  <span className="muscle-pain-label">{PAIN_INTENSITY_LABELS[level]}</span>
                  <span className="muscle-pain-range">{PAIN_LEVEL_RANGES[level]}</span>
                </button>
              ))}
            </div>
            <button
              className="muscle-pain-clear"
              onClick={() => {
                if (popupRegion && musclePainLevels[popupRegion]) {
                  onSetMusclePain(popupRegion, null);
                }
                setPopupRegion(null);
              }}
            >
              ✕ Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="body-selection-label">
        {muscleCount > 0 ? (
          <>🎯 {muscleCount} zona{muscleCount > 1 ? 's' : ''} marcada{muscleCount > 1 ? 's' : ''}</>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Tocá una zona para marcar el dolor</span>
        )}
      </div>
    </div>
  );
}
