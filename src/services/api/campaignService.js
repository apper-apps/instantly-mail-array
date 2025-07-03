import campaignData from '@/services/mockData/campaigns.json';

class CampaignService {
  constructor() {
    this.campaigns = [...campaignData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.campaigns];
  }

  async getById(id) {
    await this.delay();
    const campaign = this.campaigns.find(c => c.Id === id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return { ...campaign };
  }

  async create(campaignData) {
    await this.delay();
    const newId = Math.max(...this.campaigns.map(c => c.Id), 0) + 1;
    const newCampaign = {
      Id: newId,
      ...campaignData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0,
        unsubscribed: 0
      }
    };
    this.campaigns.unshift(newCampaign);
    return { ...newCampaign };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.campaigns.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.campaigns[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.campaigns.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    this.campaigns.splice(index, 1);
    return true;
  }
}

export const campaignService = new CampaignService();