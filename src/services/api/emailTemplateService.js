import emailTemplatesData from '@/services/mockData/emailTemplates.json';

let templates = [...emailTemplatesData];
let nextId = Math.max(...templates.map(t => t.Id)) + 1;

const emailTemplateService = {
  // Get all templates
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...templates];
  },

  // Get template by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const template = templates.find(t => t.Id === parseInt(id));
    return template ? { ...template } : null;
  },

  // Create new template
  create: async (templateData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newTemplate = {
      ...templateData,
      Id: nextId++,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString()
    };
    templates.push(newTemplate);
    return { ...newTemplate };
  },

  // Update template
  update: async (id, templateData) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Template not found');
    }
    templates[index] = {
      ...templates[index],
      ...templateData,
      Id: parseInt(id),
      updatedAt: new Date().toLocaleDateString()
    };
    return { ...templates[index] };
  },

  // Delete template
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Template not found');
    }
    templates.splice(index, 1);
    return true;
  },

  // Get templates by category
  getByCategory: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return templates.filter(t => t.category === category).map(t => ({ ...t }));
  },

  // Search templates
  search: async (searchTerm) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const term = searchTerm.toLowerCase();
    return templates.filter(t => 
      t.name.toLowerCase().includes(term) || 
      t.subject.toLowerCase().includes(term) ||
      t.body.toLowerCase().includes(term)
    ).map(t => ({ ...t }));
  }
};

export default emailTemplateService;