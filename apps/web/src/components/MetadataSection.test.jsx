import { render, screen } from '@testing-library/react';
import MetadataSection from './MetadataSection';

test('renders AI provider when present', () => {
  const analysisResult = {
    message: 'Test message',
    fileName: 'file.mp4',
    platform: 'YouTube',
    targetAudience: 'Adults',
    data: {
      aiProvider: 'OpenAI',
    },
  };

  render(<MetadataSection analysisResult={analysisResult} />);

  expect(screen.getByText('AI-modell:')).toBeInTheDocument();
  expect(screen.getByText('OpenAI')).toBeInTheDocument();
});

