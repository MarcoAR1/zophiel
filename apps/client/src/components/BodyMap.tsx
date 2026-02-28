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

const FRONT_ZONES: ZoneDef[] = [
  { id: 'head_front', d: 'M88,8 C88,2 95,0 100,0 C105,0 112,2 112,8 L112,22 C112,26 108,28 100,28 C92,28 88,26 88,22 Z' },
  { id: 'face', d: 'M90,28 C90,26 94,24 100,24 C106,24 110,26 110,28 L110,44 C110,50 106,54 100,54 C94,54 90,50 90,44 Z' },
  { id: 'neck_front', d: 'M94,54 L106,54 L108,68 L92,68 Z' },
  { id: 'chest_left', d: 'M68,82 L98,82 L98,120 L68,108 Z' },
  { id: 'chest_right', d: 'M102,82 L132,82 L132,108 L102,120 Z' },
  { id: 'left_shoulder_front', d: 'M56,68 L92,68 L92,86 L68,82 L56,78 Z' },
  { id: 'right_shoulder_front', d: 'M108,68 L144,68 L144,78 L132,82 L108,86 Z' },
  { id: 'abdomen_upper', d: 'M76,120 L124,120 L126,160 L74,160 Z' },
  { id: 'abdomen_lower', d: 'M74,160 L126,160 L128,195 L72,195 Z' },
  { id: 'groin', d: 'M80,195 L120,195 L110,215 L100,220 L90,215 Z' },
  { id: 'left_upper_arm_front', d: 'M44,78 L56,78 L60,86 L64,130 L52,130 L44,90 Z' },
  { id: 'right_upper_arm_front', d: 'M144,78 L156,78 L156,90 L148,130 L136,130 L140,86 Z' },
  { id: 'left_forearm_front', d: 'M46,130 L58,130 L54,190 L40,190 Z' },
  { id: 'right_forearm_front', d: 'M142,130 L154,130 L160,190 L146,190 Z' },
  { id: 'left_hand', d: 'M36,190 L54,190 L52,210 L48,220 L42,220 L36,210 Z' },
  { id: 'right_hand', d: 'M146,190 L164,190 L164,210 L158,220 L152,220 L148,210 Z' },
  { id: 'left_hip_front', d: 'M68,180 L80,195 L90,215 L78,220 L65,200 Z' },
  { id: 'right_hip_front', d: 'M120,195 L132,180 L135,200 L122,220 L110,215 Z' },
  { id: 'left_thigh_front', d: 'M78,220 L94,220 L92,310 L76,310 Z' },
  { id: 'right_thigh_front', d: 'M106,220 L122,220 L124,310 L108,310 Z' },
  { id: 'left_knee_front', d: 'M76,310 L92,310 L92,340 L76,340 Z' },
  { id: 'right_knee_front', d: 'M108,310 L124,310 L124,340 L108,340 Z' },
  { id: 'left_shin', d: 'M76,340 L92,340 L90,430 L78,430 Z' },
  { id: 'right_shin', d: 'M108,340 L124,340 L122,430 L110,430 Z' },
  { id: 'left_foot', d: 'M72,430 L92,430 L94,450 L90,460 L74,460 L70,450 Z' },
  { id: 'right_foot', d: 'M108,430 L128,430 L130,450 L126,460 L110,460 L106,450 Z' },
];

const BACK_ZONES: ZoneDef[] = [
  { id: 'head_back', d: 'M88,0 C88,0 95,0 100,0 C105,0 112,0 112,8 L112,44 C112,50 106,54 100,54 C94,54 88,50 88,44 L88,8 Z' },
  { id: 'neck_back', d: 'M94,54 L106,54 L108,68 L92,68 Z' },
  { id: 'left_shoulder_back', d: 'M56,68 L92,68 L92,86 L68,82 L56,78 Z' },
  { id: 'right_shoulder_back', d: 'M108,68 L144,68 L144,78 L132,82 L108,86 Z' },
  { id: 'upper_back_left', d: 'M68,82 L98,82 L98,120 L70,110 Z' },
  { id: 'upper_back_right', d: 'M102,82 L132,82 L130,110 L102,120 Z' },
  { id: 'mid_back_left', d: 'M70,120 L98,120 L98,160 L72,155 Z' },
  { id: 'mid_back_right', d: 'M102,120 L130,120 L128,155 L102,160 Z' },
  { id: 'lower_back_left', d: 'M72,160 L98,160 L98,195 L74,190 Z' },
  { id: 'lower_back_right', d: 'M102,160 L128,160 L126,190 L102,195 Z' },
  { id: 'left_glute', d: 'M74,195 L98,195 L94,230 L78,230 Z' },
  { id: 'right_glute', d: 'M102,195 L126,195 L122,230 L106,230 Z' },
  { id: 'left_upper_arm_back', d: 'M44,78 L56,78 L60,86 L64,130 L52,130 L44,90 Z' },
  { id: 'right_upper_arm_back', d: 'M144,78 L156,78 L156,90 L148,130 L136,130 L140,86 Z' },
  { id: 'left_forearm_back', d: 'M46,130 L58,130 L54,190 L40,190 Z' },
  { id: 'right_forearm_back', d: 'M142,130 L154,130 L160,190 L146,190 Z' },
  { id: 'left_thigh_back', d: 'M78,230 L94,230 L92,310 L76,310 Z' },
  { id: 'right_thigh_back', d: 'M106,230 L122,230 L124,310 L108,310 Z' },
  { id: 'left_calf', d: 'M76,340 L92,340 L90,430 L78,430 Z' },
  { id: 'right_calf', d: 'M108,340 L124,340 L122,430 L110,430 Z' },
  { id: 'left_heel', d: 'M78,430 L90,430 L90,460 L78,460 Z' },
  { id: 'right_heel', d: 'M110,430 L122,430 L122,460 L110,460 Z' },
];

const BODY_OUTLINE_FRONT = `
  M100,0 C92,0 86,4 86,12 L86,42 C86,52 92,56 92,56
  L90,68 L56,68 C52,68 42,72 42,78 L42,90 L50,130 L54,190
  L34,190 L34,210 L42,220 L50,220 L56,190
  L64,130 L68,108 L68,180 L65,200 L72,220
  L76,310 L74,340 L76,430 L70,450 L72,460 L92,460
  L94,450 L92,430 L92,340 L94,310 L94,220
  L100,224 L106,220 L106,310 L108,340 L108,430
  L106,450 L108,460 L128,460 L130,450 L126,430
  L126,340 L124,310 L128,220 L135,200 L132,180
  L132,108 L136,130 L144,190 L148,220 L158,220 L164,210
  L166,190 L146,190 L150,130 L158,90 L158,78
  C158,72 148,68 144,68 L108,68 L108,56
  C108,56 114,52 114,42 L114,12 C114,4 108,0 100,0 Z
`;

const BODY_OUTLINE_BACK = `
  M100,0 C92,0 86,4 86,12 L86,42 C86,52 92,56 92,56
  L90,68 L56,68 C52,68 42,72 42,78 L42,90 L50,130 L54,190
  L34,190 L34,210 L42,220 L50,220 L56,190
  L64,130 L68,82 L70,120 L72,160 L74,195
  L78,230 L76,310 L76,340 L78,430 L78,460 L90,460
  L90,430 L92,340 L92,310 L94,230
  L100,232 L106,230 L108,310 L108,340 L110,430
  L110,460 L122,460 L122,430 L124,340 L124,310
  L122,230 L126,195 L128,160 L130,120 L132,82
  L136,130 L144,190 L148,220 L158,220 L164,210
  L166,190 L146,190 L150,130 L158,90 L158,78
  C158,72 148,68 144,68 L108,68 L108,56
  C108,56 114,52 114,42 L114,12 C114,4 108,0 100,0 Z
`;

export default function BodyMap({ musclePainLevels, onSetMusclePain }: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [popupRegion, setPopupRegion] = useState<BodyRegion | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = useCallback((region: BodyRegion, e: React.MouseEvent) => {
    if (!svgRef.current || !containerRef.current) return;

    // Get the click position relative to the container
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    // If clicking the same region that's already open, close it
    if (popupRegion === region) {
      setPopupRegion(null);
      return;
    }

    setPopupPos({ x, y });
    setPopupRegion(region);
  }, [popupRegion]);

  const handleSelectLevel = (level: PainIntensityLevel) => {
    if (!popupRegion) return;
    // If already that level, remove it (toggle off)
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
  const outline = view === 'front' ? BODY_OUTLINE_FRONT : BODY_OUTLINE_BACK;

  // Count of muscles with pain assigned
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
        <svg ref={svgRef} viewBox="0 0 200 470" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bodyGlow">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="zoneShadow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.4" />
            </filter>
          </defs>

          <path d={outline} className="body-outline" />
          <ellipse cx="100" cy="240" rx="80" ry="220" fill="url(#bodyGlow)" />

          {zones.map((zone) => (
            <path
              key={zone.id}
              d={zone.d}
              className={getZoneClass(zone.id)}
              onClick={(e) => handleZoneClick(zone.id, e)}
              filter={musclePainLevels[zone.id] ? 'url(#zoneShadow)' : undefined}
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
                  style={{
                    '--level-color': PAIN_INTENSITY_COLORS[level],
                  } as React.CSSProperties}
                >
                  <span
                    className="muscle-pain-dot"
                    style={{ background: PAIN_INTENSITY_COLORS[level] }}
                  />
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

      {/* Summary label */}
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
