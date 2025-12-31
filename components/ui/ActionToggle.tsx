import React, { useState, useEffect } from 'react';
import { Download, Power } from 'lucide-react';

interface ActionToggleProps {
  type: 'download' | 'toggle';
  labelIdle?: string; 
  labelActive?: string;
  isActive?: boolean;
  onToggle?: () => void;
}

export const ActionToggle: React.FC<ActionToggleProps> = ({ 
  type, 
  labelIdle, 
  labelActive, 
  isActive = false, 
  onToggle
}) => {
  const [internalState, setInternalState] = useState(isActive);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setInternalState(isActive);
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnimating) return;
    
    const checked = e.target.checked;
    setIsAnimating(true);
    
    if (onToggle) onToggle();

    if (type === 'download') {
        setInternalState(true);
        setTimeout(() => {
            setInternalState(false);
            setIsAnimating(false);
        }, 4000);
    } else {
        // Toggle logic: wait for animation
        setTimeout(() => {
            setInternalState(checked);
            setIsAnimating(false);
        }, 3000); 
    }
  };

  const isDownload = type === 'download';
  
  // Colors
  const activeColor = '#10B981'; // Emerald 500 (Green) - WHEN ACTIVE/RUNNING
  const pausedColor = '#C5A572'; // Gold - WHEN PAUSED
  const downloadColor = '#6366f1'; // Indigo

  // If internalState is true -> Active -> Green
  // If internalState is false -> Paused -> Gold
  const currentColor = isDownload 
    ? downloadColor 
    : internalState ? activeColor : pausedColor;

  // Labels
  const getHoverLabel = () => {
      if (isDownload) return labelIdle || "Download";
      // If currently Active (Green), user wants to PAUSE
      if (internalState) return "Pause"; 
      // If currently Paused (Gold), user wants to ENABLE
      return "Enable";
  };

  const getActiveLabel = () => {
      if (isDownload) return labelActive || "Done";
      if (internalState) return "Active";
      return "Paused";
  };

  return (
    <div className="action-toggle-wrapper">
      <label className={`label ${internalState ? 'active-state' : 'paused-state'} ${isAnimating ? 'animating' : ''}`}>
        <input 
            type="checkbox" 
            className="input" 
            checked={internalState} 
            onChange={handleChange}
            disabled={isAnimating} 
        />
        
        {/* The Circle Container */}
        <span className="circle">
          <div className="icon-box">
             {type === 'download' ? (
                <Download size={18} strokeWidth={2.5} />
             ) : (
                <Power size={18} strokeWidth={2.5} />
             )}
          </div>
        </span>
        
        {/* Hover Text (The Action) */}
        <p className="title action-text">{getHoverLabel()}</p>
        
        {/* Active/Status Text (Hidden generally) */}
        <p className="title status-text">{getActiveLabel()}</p>
      </label>

      <style>{`
        .action-toggle-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .label {
          background-color: transparent;
          border: 2px solid ${currentColor};
          display: flex;
          align-items: center;
          border-radius: 50px;
          width: 45px; /* Default Circle Width */
          height: 45px;
          cursor: pointer;
          transition: all 0.4s ease;
          padding: 0;
          position: relative;
          overflow: hidden;
        }

        /* Hover: Expand to Pill */
        .label:not(.animating):hover {
          width: 130px; /* Expand */
        }

        /* Text Styling */
        .label .title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.4s ease;
          position: absolute;
          right: 22px;
          text-align: center;
          white-space: nowrap;
          opacity: 0; 
          visibility: hidden;
          color: ${currentColor};
        }

        /* Show Action text on hover */
        .label:not(.animating):hover .action-text {
          opacity: 1;
          visibility: visible;
        }
        
        .label .status-text {
            display: none;
        }

        /* The Circle Holder */
        .label .circle {
          height: 41px; 
          width: 41px;
          border-radius: 50%;
          background-color: ${currentColor};
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s ease;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 5;
        }

        .label .circle .icon-box {
          color: #fff;
          width: 18px;
          height: 18px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Loading Spinner Logic */
        .label.animating {
           width: 45px !important;
           border-color: #e5e5e4; 
        }
        
        .label.animating .title {
            opacity: 0 !important;
        }

        /* Create the spinner ring effect */
        .label.animating .circle {
           animation: pulse 1s forwards, circleDelete 0.2s ease 3.5s forwards;
           rotate: 180deg;
           background-color: transparent; 
           border: 2px solid ${currentColor}; 
           border-top-color: transparent; 
           animation: spin 1s linear infinite; 
        }
        
        .label.animating .circle .icon-box {
            opacity: 0; 
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        
        @keyframes circleDelete {
          100% { opacity: 0.8; } /* Keep slight visibility for spinner */
        }
      `}</style>
    </div>
  );
};