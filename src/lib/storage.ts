// src/lib/storage.ts

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  appliedDate: string;
  lastChecked: string;
  status: 'pending' | 'responded' | 'ghosted';
  emailId?: string;
  responseDate?: string;
}

const STORAGE_KEY = 'ghost_job_applications';

export const storage = {
  // Get all applications
  getApplications(): JobApplication[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save applications
  saveApplications(applications: JobApplication[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  },

  // Add new application
  addApplication(app: Omit<JobApplication, 'id'>): JobApplication {
    const applications = this.getApplications();
    const newApp = {
      ...app,
      id: crypto.randomUUID(),
    };
    applications.push(newApp);
    this.saveApplications(applications);
    return newApp;
  },

  // Update application
  updateApplication(id: string, updates: Partial<JobApplication>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      this.saveApplications(applications);
    }
  },

  // Delete application
  deleteApplication(id: string): void {
    const applications = this.getApplications();
    const filtered = applications.filter(app => app.id !== id);
    this.saveApplications(filtered);
  },

  // Get ghosted applications (no response after 7 days)
  getGhostedApplications(): JobApplication[] {
    const applications = this.getApplications();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return applications.filter(app => 
      app.status === 'pending' && 
      new Date(app.appliedDate) < sevenDaysAgo
    );
  },

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};