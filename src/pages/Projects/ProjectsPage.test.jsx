import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import * as projectsApi from '../../api/projects';

vi.mock('../../api/projects', () => ({
  getProjects: vi.fn(),
  deleteProject: vi.fn(),
}));
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const PROJECTS = [
  {
    id: 1, name: 'Portfolio site', template_name: 'Solo Portfolio', status: 'DRAFT',
    updated_at: '2026-09-01T10:00:00Z', live_url: null,
  },
  {
    id: 2, name: 'Company site', template_name: 'Business Landing', status: 'DEPLOYED',
    updated_at: '2026-09-05T10:00:00Z', live_url: 'https://company-abc123.devlaunch.app',
  },
];

const renderPage = () => render(<MemoryRouter><ProjectsPage /></MemoryRouter>);

describe('ProjectsPage', () => {
  it('renders the projects table with live-URL state', async () => {
    projectsApi.getProjects.mockResolvedValue({ data: PROJECTS });
    renderPage();

    expect(await screen.findByText('Portfolio site')).toBeInTheDocument();
    expect(screen.getByText('Not deployed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute(
      'href',
      'https://company-abc123.devlaunch.app'
    );
  });

  it('shows the empty state with a link to the gallery', async () => {
    projectsApi.getProjects.mockResolvedValue({ data: [] });
    renderPage();

    expect(await screen.findByText('No projects yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse Templates' })).toBeInTheDocument();
  });

  it('deletes a project after confirmation and drops the row', async () => {
    projectsApi.getProjects.mockResolvedValue({ data: PROJECTS });
    projectsApi.deleteProject.mockResolvedValue({});
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPage();

    const row = (await screen.findByText('Portfolio site')).closest('tr');
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(projectsApi.deleteProject).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(screen.queryByText('Portfolio site')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Company site')).toBeInTheDocument();
  });

  it('keeps the row when the user cancels the confirm dialog', async () => {
    projectsApi.getProjects.mockResolvedValue({ data: PROJECTS });
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderPage();

    const row = (await screen.findByText('Portfolio site')).closest('tr');
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }));

    expect(projectsApi.deleteProject).not.toHaveBeenCalled();
    expect(screen.getByText('Portfolio site')).toBeInTheDocument();
  });

  it('shows an error when loading fails', async () => {
    projectsApi.getProjects.mockRejectedValue(new Error('nope'));
    renderPage();
    expect(await screen.findByText('Failed to load your projects.')).toBeInTheDocument();
  });
});
