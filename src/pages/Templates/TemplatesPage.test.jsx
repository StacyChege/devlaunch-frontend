import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TemplatesPage from './TemplatesPage';
import * as templatesApi from '../../api/templates';
import * as projectsApi from '../../api/projects';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));
vi.mock('../../api/templates', () => ({ getTemplates: vi.fn() }));
vi.mock('../../api/projects', () => ({ createProject: vi.fn() }));

const TEMPLATES = [
  {
    id: 1, name: 'Solo Portfolio', description: 'Clean portfolio.',
    category: 'PORTFOLIO', category_display: 'Portfolio', tech_stack: 'React', is_premium: false,
  },
  {
    id: 2, name: 'SaaS Starter', description: 'Marketing site.',
    category: 'SAAS', category_display: 'SaaS', tech_stack: 'Next.js', is_premium: true,
  },
];

const renderPage = () => render(<MemoryRouter><TemplatesPage /></MemoryRouter>);

describe('TemplatesPage', () => {
  it('loads and renders the template grid', async () => {
    templatesApi.getTemplates.mockResolvedValue({ data: TEMPLATES });
    renderPage();

    expect(await screen.findByText('Solo Portfolio')).toBeInTheDocument();
    expect(screen.getByText('SaaS Starter')).toBeInTheDocument();
    expect(screen.getByText('2 templates shown')).toBeInTheDocument();
  });

  it('refetches with a category filter when a pill is clicked', async () => {
    templatesApi.getTemplates.mockResolvedValue({ data: TEMPLATES });
    renderPage();
    await screen.findByText('Solo Portfolio');

    await userEvent.click(screen.getByRole('button', { name: 'SaaS' }));

    await waitFor(() =>
      expect(templatesApi.getTemplates).toHaveBeenLastCalledWith(
        expect.objectContaining({ category: 'SAAS' })
      )
    );
  });

  it('shows the empty state when nothing matches', async () => {
    templatesApi.getTemplates.mockResolvedValue({ data: [] });
    renderPage();
    expect(await screen.findByText('No templates found')).toBeInTheDocument();
  });

  it('creates a project and navigates to its editor', async () => {
    templatesApi.getTemplates.mockResolvedValue({ data: TEMPLATES });
    projectsApi.createProject.mockResolvedValue({ data: { id: 99 } });
    renderPage();

    const card = (await screen.findByText('Solo Portfolio')).closest('div.group');
    await userEvent.click(within(card).getByRole('button', { name: 'Use Template' }));

    await waitFor(() => expect(projectsApi.createProject).toHaveBeenCalledWith(1));
    expect(navigate).toHaveBeenCalledWith('/projects/99');
  });

  it('surfaces an error when the fetch fails', async () => {
    templatesApi.getTemplates.mockRejectedValue(new Error('boom'));
    renderPage();
    expect(
      await screen.findByText('Failed to load templates. Please try again.')
    ).toBeInTheDocument();
  });
});
