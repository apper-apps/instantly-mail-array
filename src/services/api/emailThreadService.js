import threadData from '@/services/mockData/emailThreads.json';

class EmailThreadService {
  constructor() {
    this.threads = [...threadData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.threads];
  }

  async getById(id) {
    await this.delay();
    const thread = this.threads.find(t => t.Id === id);
    if (!thread) {
      throw new Error('Email thread not found');
    }
    return { ...thread };
  }

  async create(threadData) {
    await this.delay();
    const newId = Math.max(...this.threads.map(t => t.Id), 0) + 1;
    const newThread = {
      Id: newId,
      ...threadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.threads.unshift(newThread);
    return { ...newThread };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.threads.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Email thread not found');
    }
    this.threads[index] = {
      ...this.threads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.threads[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.threads.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Email thread not found');
    }
    this.threads.splice(index, 1);
    return true;
  }
}

export const emailThreadService = new EmailThreadService();