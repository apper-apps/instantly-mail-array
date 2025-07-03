import leadData from '@/services/mockData/leads.json';

class LeadService {
  constructor() {
    this.leads = [...leadData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.leads];
  }

  async getById(id) {
    await this.delay();
    const lead = this.leads.find(l => l.Id === id);
    if (!lead) {
      throw new Error('Lead not found');
    }
    return { ...lead };
  }

  async create(leadData) {
    await this.delay();
    const newId = Math.max(...this.leads.map(l => l.Id), 0) + 1;
    const newLead = {
      Id: newId,
      ...leadData,
      status: leadData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.leads.unshift(newLead);
    return { ...newLead };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.leads.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
    this.leads[index] = {
      ...this.leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.leads[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.leads.findIndex(l => l.Id === id);
    if (index === -1) {
      throw new Error('Lead not found');
    }
this.leads.splice(index, 1);
    return true;
  }

  async bulkImport(leads) {
    await this.delay();
    const importedLeads = leads.map((leadData, index) => {
      const newId = Math.max(...this.leads.map(l => l.Id), 0) + index + 1;
      return {
        Id: newId,
        ...leadData,
        status: leadData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
    
    this.leads.unshift(...importedLeads);
    return importedLeads;
  }

  async validateEmails(emails) {
    await this.delay(500);
    const results = {
      valid: [],
      invalid: [],
      total: emails.length
    };

    emails.forEach(email => {
      // Simple validation logic for demo
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && Math.random() > 0.1;
      
      if (isValid) {
        results.valid.push(email);
      } else {
        results.invalid.push({
          email,
          reason: 'Invalid email format or domain'
        });
      }
    });

    return results;
  }
}

export const leadService = new LeadService();