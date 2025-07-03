import accountData from '@/services/mockData/emailAccounts.json';

class EmailAccountService {
  constructor() {
    this.accounts = [...accountData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.accounts];
  }

  async getById(id) {
    await this.delay();
    const account = this.accounts.find(a => a.Id === id);
    if (!account) {
      throw new Error('Email account not found');
    }
    return { ...account };
  }

  async create(accountData) {
    await this.delay();
    const newId = Math.max(...this.accounts.map(a => a.Id), 0) + 1;
    const newAccount = {
      Id: newId,
      ...accountData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentToday: 0,
      warmupProgress: accountData.warmupEnabled ? 0 : 100
    };
    this.accounts.unshift(newAccount);
    return { ...newAccount };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.accounts.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Email account not found');
    }
    this.accounts[index] = {
      ...this.accounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.accounts[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.accounts.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error('Email account not found');
    }
    this.accounts.splice(index, 1);
    return true;
  }
}

export const emailAccountService = new EmailAccountService();