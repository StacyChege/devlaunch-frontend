import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TemplateCard from './TemplateCard';

const template = {
  id: 7,
  name: 'Solo Portfolio',
  description: 'A clean portfolio for developers.',
  category: 'PORTFOLIO',
  category_display: 'Portfolio',
  tech_stack: 'React',
  is_premium: false,
};

describe('TemplateCard', () => {
  it('renders the template metadata', () => {
    render(<TemplateCard template={template} onPreview={vi.fn()} onUse={vi.fn()} />);
    expect(screen.getByText('Solo Portfolio')).toBeInTheDocument();
    expect(screen.getByText('A clean portfolio for developers.')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows a Premium badge for premium templates', () => {
    render(
      <TemplateCard template={{ ...template, is_premium: true }} onPreview={vi.fn()} onUse={vi.fn()} />
    );
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.queryByText('Free')).not.toBeInTheDocument();
  });

  it('calls onPreview and onUse with the template', async () => {
    const onPreview = vi.fn();
    const onUse = vi.fn();
    render(<TemplateCard template={template} onPreview={onPreview} onUse={onUse} />);

    await userEvent.click(screen.getByRole('button', { name: 'Preview' }));
    await userEvent.click(screen.getByRole('button', { name: 'Use Template' }));

    expect(onPreview).toHaveBeenCalledWith(template);
    expect(onUse).toHaveBeenCalledWith(template);
  });

  it('disables the use button and shows progress while creating', () => {
    render(
      <TemplateCard template={template} onPreview={vi.fn()} onUse={vi.fn()} isCreating />
    );
    const useButton = screen.getByRole('button', { name: /creating/i });
    expect(useButton).toBeDisabled();
  });
});
