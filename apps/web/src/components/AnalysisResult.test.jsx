import { render, screen } from '@testing-library/react';
import AnalysisResult from './AnalysisResult';

test('renders reordered overall strengths correctly', () => {
  const strengths = ['Alpha', 'Beta'];
  const analysis = {
    message: 'test',
    fileName: 'file.mp4',
    platform: 'YouTube',
    targetAudience: 'Adults',
    analysisResult: {
      parsed: true,
      type: 'video',
      overallStrengths: strengths,
    },
  };

  const { rerender } = render(<AnalysisResult analysisResult={analysis} />);

  const getOrder = () => {
    const container = screen.getByText('Övergripande styrkor').parentElement;
    return Array.from(container.querySelectorAll('p')).map((el) => el.textContent);
  };

  expect(getOrder()).toEqual(strengths);

  const reversed = [...strengths].reverse();
  rerender(
    <AnalysisResult
      analysisResult={{
        ...analysis,
        analysisResult: {
          ...analysis.analysisResult,
          overallStrengths: reversed,
        },
      }}
    />
  );

  expect(getOrder()).toEqual(reversed);
});
