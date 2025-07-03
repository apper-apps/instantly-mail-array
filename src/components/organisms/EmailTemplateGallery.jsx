import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import emailTemplateService from '@/services/api/emailTemplateService';

const EmailTemplateGallery = ({ onSelectTemplate, selectionMode = false }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'personal', label: 'Personal' },
    { value: 'newsletter', label: 'Newsletter' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emailTemplateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load email templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      toast.success(`Template "${template.name}" applied successfully`);
    }
  };

  const TemplateCard = ({ template }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {template.name}
            </h3>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mt-2">
              {template.category}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTemplate(template);
              }}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Eye" className="w-4 h-4" />
            </button>
            {selectionMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect(template);
                }}
                className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-medium mb-2">Subject:</p>
          <p className="text-sm text-gray-800 line-clamp-2">{template.subject}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-medium mb-2">Preview:</p>
          <div className="text-sm text-gray-700 line-clamp-3 bg-gray-50 p-3 rounded-lg">
            {template.preview}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>Created {template.createdAt}</span>
          </div>
          {!selectionMode && (
            <Button
              onClick={() => handleTemplateSelect(template)}
              size="sm"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Use Template
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  const TemplatePreview = ({ template, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mt-2">
              {template.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Subject Line</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{template.subject}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Email Body</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="whitespace-pre-wrap text-gray-900">{template.body}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleTemplateSelect(template);
              onClose();
            }}
            icon="Check"
          >
            Use Template
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTemplates} />;

  return (
    <div className="space-y-6">
      {!selectionMode && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
            <p className="text-gray-600 mt-1">Browse and select pre-designed email templates for your campaigns</p>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
            <span className="text-sm text-gray-500">{filteredTemplates.length} templates</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Empty
              icon="FileText"
              title="No templates found"
              description={searchTerm || selectedCategory !== 'all' 
                ? "No templates match your current filters. Try adjusting your search or category."
                : "No email templates available yet."
              }
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TemplateCard template={template} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreview
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailTemplateGallery;