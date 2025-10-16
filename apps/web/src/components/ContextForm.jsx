import React from 'react';
import { sectionStyle, headingStyle } from '../styles/commonStyles';

const ContextForm = ({
  adObjective,
  setAdObjective,
  isContextModeOn,
  setIsContextModeOn,
  ctaText,
  setCtaText,
  postText,
  setPostText,
  platform,
  setPlatform,
  targetAudience,
  setTargetAudience,
  platforms
}) => {
  const sharedLabelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '12px'
  };

  const sharedInputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const getContextFieldStyle = () => ({
    ...sharedInputStyle,
    backgroundColor: isContextModeOn ? '#ffffff' : '#f3f4f6',
    color: isContextModeOn ? '#1f2937' : '#9ca3af',
    cursor: isContextModeOn ? 'text' : 'not-allowed'
  });

  const getToggleButtonStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '9999px',
    border: '1px solid',
    borderColor: active ? '#2563eb' : '#d1d5db',
    backgroundColor: active ? '#2563eb' : '#ffffff',
    color: active ? '#ffffff' : '#1f2937',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ ...sectionStyle, marginBottom: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={headingStyle}>Steg 3: Kontext för analysen</h2>
        <p style={{
          color: '#6b7280'
        }}>
          Berätta mer om din annons för bättre analys
        </p>
      </div>

      <div
        style={{
          marginBottom: '24px',
          width: '100%',
          maxWidth: 'calc((100% - 24px) / 2)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '12px'
          }}
        >
          <label
            htmlFor="ad-objective"
            style={{ ...sharedLabelStyle, marginBottom: 0 }}
          >
            Syftet med annonsen
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Kontextläge</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsContextModeOn(false)}
                style={getToggleButtonStyle(!isContextModeOn)}
              >
                Av
              </button>
              <button
                type="button"
                onClick={() => setIsContextModeOn(true)}
                style={getToggleButtonStyle(isContextModeOn)}
              >
                På
              </button>
            </div>
          </div>
        </div>
        <select
          id="ad-objective"
          value={adObjective}
          onChange={(e) => setAdObjective(e.target.value)}
          style={sharedInputStyle}
        >
          <option value="">Välj syfte</option>
          <option value="upper_funnel">Upper funnel</option>
          <option value="mid_funnel">Mid funnel</option>
          <option value="lower_funnel">Lower funnel</option>
          <option value="unknown">Vet ej</option>
        </select>

        <div style={{ marginTop: '16px' }}>
          <label
            htmlFor="cta-text"
            style={sharedLabelStyle}
          >
            CTA
          </label>
          <input
            type="text"
            id="cta-text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="t.ex. Boka demo, Läs mer"
            disabled={!isContextModeOn}
            style={getContextFieldStyle()}
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <label
            htmlFor="post-text"
            style={sharedLabelStyle}
          >
            Inläggstext
          </label>
          <textarea
            id="post-text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Skriv inläggstexten här"
            disabled={!isContextModeOn}
            rows={4}
            style={{
              ...getContextFieldStyle(),
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        <div>
          <label
            htmlFor="platform-select"
            style={sharedLabelStyle}
          >
            Plattform
          </label>
          <select
            id="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={sharedInputStyle}
          >
            <option value="">Välj plattform</option>
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="target-audience"
            style={sharedLabelStyle}
          >
            Målgrupp
          </label>
          <input
            type="text"
            id="target-audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="t.ex. Kvinnor 25-35, intresserade av fitness"
            style={sharedInputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default ContextForm;
