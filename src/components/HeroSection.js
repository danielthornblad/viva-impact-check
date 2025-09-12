import React from 'react';

const HeroSection = () => (
  <div style={{ backgroundColor: '#CAE780' }}>
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '48px',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            padding: '8px 16px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#02443E',
            marginBottom: '24px',
            border: '1px solid #02443E'
          }}>
            Marknadsföring & AI-analys
          </div>
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: '700',
            color: '#02443E',
            lineHeight: '1.1',
            margin: 0,
          }}>
            Viva Impact Check
          </h1>
        </div>

        <div style={{ paddingTop: '72px' }}>
          <p style={{
            fontSize: '18px',
            color: '#02443E',
            lineHeight: '1.6',
            margin: 0
          }}>
            Analysera effekten av dina annonser med AI-driven precision. Få djupgående insikter om målgruppsrelevans, budskap och optimeringsmöjligheter som driver konvertering och ROI.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
