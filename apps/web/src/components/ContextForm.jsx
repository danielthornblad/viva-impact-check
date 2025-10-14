import React from 'react';
import { sectionStyle, headingStyle } from '../styles/commonStyles';

const ContextForm = ({
  adObjective,
  setAdObjective,
  platform,
  setPlatform,
  targetAudience,
  setTargetAudience,
  platforms
}) => (
  <div style={{ ...sectionStyle, marginBottom: '32px' }}>
    <div style={{ marginBottom: '24px' }}>
      <h2 style={headingStyle}>Steg 3: Kontext för analysen</h2>
      <p style={{
        color: '#6b7280',
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
      <label
        htmlFor="ad-objective"
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#1f2937',
          marginBottom: '12px',
        }}
      >
        Syftet med annonsen
      </label>
      <select
        id="ad-objective"
        value={adObjective}
        onChange={(e) => setAdObjective(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '12px',
          fontSize: '16px',
          boxSizing: 'border-box'
        }}
      >
        <option value="">Välj syfte</option>
        <option value="upper_funnel">Upper funnel</option>
        <option value="mid_funnel">Mid funnel</option>
        <option value="lower_funnel">Lower funnel</option>
      </select>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
      <div>
        <label
          htmlFor="platform-select"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1f2937',
            marginBottom: '12px',
          }}
        >
          Plattform
        </label>
        <select
          id="platform-select"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
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
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1f2937',
            marginBottom: '12px',
          }}
        >
          Målgrupp
        </label>
        <input
          type="text"
          id="target-audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="t.ex. Kvinnor 25-35, intresserade av fitness"
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  </div>
);

export default ContextForm;
