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
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const getContextFieldStyle = () => ({
    ...sharedInputStyle,
    backgroundColor: isContextModeOn ? '#ffffff' : '#f3f4f6',
    color: isContextModeOn ? '#1f2937' : '#9ca3af',
    cursor: isContextModeOn ? 'text' : 'not-allowed'
  });

  const getContextLabelStyle = () => ({
    ...sharedLabelStyle,
    color: isContextModeOn ? '#1f2937' : '#9ca3af'
  });

  const getToggleButtonStyle = (active) => ({
    flex: 1,
    padding: '12px 24px',
    borderRadius: '9999px',
    border: 'none',
    backgroundColor: active ? '#CAE780' : 'transparent',
    color: active ? '#1f2937' : '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  };

  const contextCardStyle = {
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    backgroundColor: isContextModeOn ? '#f9fafb' : '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'background-color 0.2s ease, border-color 0.2s ease'
  };

  const contextToggleGroupStyle = {
    display: 'inline-flex',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    padding: '4px'
  };

  const contextFieldsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  };

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

      <div style={formGridStyle}>
        <div>
          <label
            htmlFor="ad-objective"
            style={sharedLabelStyle}
          >
            Syftet med annonsen
          </label>
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
        </div>

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

      <div style={contextCardStyle}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <span style={getContextLabelStyle()}>Kontextläge</span>
            <p style={{
              fontSize: '14px',
              color: isContextModeOn ? '#6b7280' : '#9ca3af',
              margin: 0
            }}>
              Aktivera för att beskriva CTA och inläggstext
            </p>
          </div>

          <div style={contextToggleGroupStyle}>
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

        <div style={contextFieldsGridStyle}>
          <div>
            <label
              htmlFor="cta-text"
              style={getContextLabelStyle()}
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

          <div style={{ gridColumn: '1 / -1' }}>
            <label
              htmlFor="post-text"
              style={getContextLabelStyle()}
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
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextForm;
