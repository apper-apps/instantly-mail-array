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

  async getAbTestResults(campaignId, emailIndex) {
    await this.delay();
    const campaign = this.campaigns.find(c => c.Id === campaignId);
    if (!campaign || !campaign.emailSequence[emailIndex]) {
      throw new Error('Campaign or email not found');
    }
    
    const email = campaign.emailSequence[emailIndex];
    if (!email.abTest?.enabled) {
      throw new Error('A/B test not enabled for this email');
    }
    
    return {
      campaignId,
      emailIndex,
      abTest: email.abTest,
      variants: email.abTest.variants,
      winner: this.calculateWinner(email.abTest),
      recommendations: this.generateRecommendations(email.abTest)
    };
  }

  async updateAbTestStatus(campaignId, emailIndex, status) {
    await this.delay();
    const campaign = this.campaigns.find(c => c.Id === campaignId);
    if (!campaign || !campaign.emailSequence[emailIndex]) {
      throw new Error('Campaign or email not found');
    }
    
    const email = campaign.emailSequence[emailIndex];
    if (!email.abTest?.enabled) {
      throw new Error('A/B test not enabled for this email');
    }
    
    email.abTest.status = status;
    campaign.updatedAt = new Date().toISOString();
    
    return { ...email.abTest };
  }

  calculateWinner(abTest) {
    if (!abTest.variants || abTest.variants.length === 0) return null;
    
    const criteriaMap = {
      'open_rate': 'open_rate',
      'click_rate': 'click_rate',
      'reply_rate': 'replied',
      'conversion_rate': 'conversion_rate'
    };
    
    const criteria = criteriaMap[abTest.winnerCriteria] || 'open_rate';
    
    return abTest.variants.reduce((winner, variant) => {
      const variantScore = variant.metrics[criteria];
      const winnerScore = winner?.metrics[criteria] || 0;
      
      if (variantScore > winnerScore) {
        return { ...variant, winningCriteria: criteria, score: variantScore };
      }
      return winner;
    }, null);
  }

  generateRecommendations(abTest) {
    const recommendations = [];
    const winner = this.calculateWinner(abTest);
    
    if (!winner) return recommendations;
    
    // Check for statistical significance
    const totalSent = abTest.variants.reduce((sum, v) => sum + v.metrics.sent, 0);
    if (totalSent < 100) {
      recommendations.push({
        type: 'warning',
        title: 'Low Sample Size',
        message: 'Consider running the test longer for more reliable results.'
      });
    }
    
    // Performance recommendations
    if (winner.metrics.open_rate < 0.2) {
      recommendations.push({
        type: 'tip',
        title: 'Subject Line Optimization',
        message: 'Try more compelling subject lines to improve open rates.'
      });
    }
    
    if (winner.metrics.click_rate < 0.05) {
      recommendations.push({
        type: 'tip',
        title: 'Call-to-Action Optimization',
        message: 'Consider stronger calls-to-action to improve click rates.'
      });
    }
    
    return recommendations;
  }

  async getAllAbTests() {
    await this.delay();
    const abTests = [];
    
    this.campaigns.forEach(campaign => {
      campaign.emailSequence.forEach((email, emailIndex) => {
        if (email.abTest?.enabled) {
          abTests.push({
            id: `${campaign.Id}-${emailIndex}`,
            campaignId: campaign.Id,
            campaignName: campaign.name,
            emailIndex,
            emailSubject: email.subject || 'Untitled Email',
            abTest: email.abTest,
            status: email.abTest.status || 'draft',
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt
          });
        }
      });
    });
    
    return abTests;
  }
}

export const campaignService = new CampaignService();