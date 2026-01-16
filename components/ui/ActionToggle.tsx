import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Power } from 'lucide-react';

interface ActionToggleProps {
  type?: 'download' | 'toggle';
  labelIdle?: string;
  labelActive?: string;
  isActive?: boolean;
  checked?: boolean; // Alias for isActive
  onToggle?: () => void;
  onChange?: () => void; // Alias for onToggle
  className?: string; // Allow external positioning
}

export const ActionToggle: React.FC<ActionToggleProps> = ({
  type = 'toggle',
  labelIdle,
  labelActive,
  isActive = false,
  checked,
  onToggle,
  onChange,
  className = ''
}) => {
  const { t } = useTranslation();
  const finalActive = checked !== undefined ? checked : isActive;
  const [internalState, setInternalState] = useState(finalActive);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setInternalState(finalActive);
  }, [finalActive]);

  const handleChange = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (onToggle) onToggle();
    if (onChange) onChange();

    if (type === 'download') {
      setInternalState(true);
      setTimeout(() => {
        setInternalState(false);
        setIsAnimating(false);
      }, 4000); // Simulate download time
    } else {
      // Toggle logic: wait 'fake' API time
      setTimeout(() => {
        // State update is handled by prop usually, but for local demo:
        // setInternalState(!internalState); // Actually, we should rely on props or just stop animating
        setIsAnimating(false);
      }, 1500);
    }
  };

  const isDownload = type === 'download';

  // CSS Variables for dynamic colors logic (handled via inline style for the circle fill if needed, or classes)
  // Logic: 
  // Active -> Success Green
  // Paused (Idle) -> Brand Gold
  // Download -> Indigo (Special case)

  const getStatusColor = () => {
    if (isDownload) return 'var(--color-info)'; // Indigo-ish mapped to info
    if (internalState) return 'var(--color-success)';
    return 'var(--color-brand-accent)';
  };

  const currentColor = getStatusColor();

  // Labels logic
  const getHoverLabel = () => {
    if (isDownload) return labelIdle || t('ui.actionToggle.download');
    if (internalState) return t('ui.actionToggle.pause');
    return t('ui.actionToggle.enable');
  };

  const getActiveLabel = () => {
    if (isDownload) return labelActive || t('ui.actionToggle.done');
    if (internalState) return t('ui.actionToggle.active');
    return t('ui.actionToggle.paused');
  };

  return (
    <div className={`action-toggle-wrapper ${className}`}>
      <label
        className={`
          label-container 
          ${internalState ? 'active' : 'paused'} 
          ${isAnimating ? 'animating' : ''}
        `}
        onClick={(e) => {
          e.preventDefault();
          handleChange();
        }}
      >

        {/* The Circle Indicator */}
        <span
          className="circle-indicator"
          style={{ backgroundColor: isAnimating ? 'transparent' : currentColor, borderColor: currentColor }}
        >
          <div className={`icon-box ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {type === 'download' ? (
              <Download size={18} strokeWidth={2.5} />
            ) : (
              <Power size={18} strokeWidth={2.5} />
            )}
          </div>
        </span>

        {/* Hover Text (The Action) */}
        <p
          className="label-text action-text"
          style={{ color: currentColor }}
        >
          {getHoverLabel()}
        </p>

      </label>

      {/* Internal Styles for this complex component animation that is hard to do with strict Tailwind utilities only without polluting global CSS */}
      <style>{`
        .action-toggle-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .label-container {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 9999px; /* Pill */
          width: 45px;
          height: 45px;
          cursor: pointer;
          transition: width 0.4s ease;
          border: 2px solid ${currentColor};
          overflow: hidden;
          background: transparent;
        }

        .label-container:hover:not(.animating) {
          width: 130px;
        }

        .circle-indicator {
          position: absolute;
          left: 0;
          top: 0;
          height: 41px; /* border is 2px, so 45 - 4 = 41 */
          width: 41px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s ease;
          color: white;
          border: 2px solid transparent; /* default */
        }

        .label-text {
          position: absolute;
          right: 22px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }

        .label-container:hover:not(.animating) .action-text {
          opacity: 1;
          visibility: visible;
        }

        /* Loading State */
        .label-container.animating {
            width: 45px !important;
            border-color: var(--color-border);
            cursor: default;
        }

        .label-container.animating .circle-indicator {
            background-color: transparent !important;
            border-top-color: transparent !important;
            border-right-color: ${currentColor} !important;
            border-bottom-color: ${currentColor} !important;
            border-left-color: ${currentColor} !important;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};