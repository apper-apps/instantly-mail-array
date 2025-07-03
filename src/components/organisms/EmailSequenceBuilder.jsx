import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const EmailSequenceBuilder = ({ sequence = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);

  const addEmail = () => {
    const newEmail = {
      id: Date.now(),
      subject: '',
      body: '',
      delay: 1,
      delayUnit: 'days'
    };
    onChange([...sequence, newEmail]);
    setEditingIndex(sequence.length);
  };

  const updateEmail = (index, field, value) => {
    const updatedSequence = [...sequence];
    updatedSequence[index] = { ...updatedSequence[index], [field]: value };
    onChange(updatedSequence);
  };

  const deleteEmail = (index) => {
    const updatedSequence = sequence.filter((_, i) => i !== index);
    onChange(updatedSequence);
    setEditingIndex(null);
  };

  const moveEmail = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sequence.length) return;
    
    const updatedSequence = [...sequence];
    [updatedSequence[index], updatedSequence[newIndex]] = [updatedSequence[newIndex], updatedSequence[index]];
    onChange(updatedSequence);
  };

  const EmailEditor = ({ email, index, onSave, onCancel }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <Input
        label="Subject Line"
        value={email.subject}
        onChange={(e) => updateEmail(index, 'subject', e.target.value)}
        placeholder="Enter email subject..."
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
        <textarea
          value={email.body}
          onChange={(e) => updateEmail(index, 'body', e.target.value)}
          placeholder="Write your email content here..."
          rows={8}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Wait</label>
          <input
            type="number"
            value={email.delay}
            onChange={(e) => updateEmail(index, 'delay', parseInt(e.target.value))}
            min="1"
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={email.delayUnit}
            onChange={(e) => updateEmail(index, 'delayUnit', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="days">days</option>
            <option value="hours">hours</option>
          </select>
          <span className="text-sm text-gray-500">before sending</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex space-x-2">
          <Button
            onClick={() => setPreviewIndex(index)}
            variant="outline"
            size="sm"
            icon="Eye"
          >
            Preview
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onCancel}
            variant="secondary"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            size="sm"
            disabled={!email.subject || !email.body}
          >
            Save
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const EmailPreview = ({ email, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-500 mb-2">Subject:</div>
        <div className="font-medium">{email.subject}</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-500 mb-2">Body:</div>
        <div className="whitespace-pre-wrap">{email.body}</div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-500">
          Wait {email.delay} {email.delayUnit} before sending
        </div>
        <Button
          onClick={() => setPreviewIndex(null)}
          variant="outline"
          size="sm"
        >
          Close Preview
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Sequence</h3>
        <Button
          onClick={addEmail}
          icon="Plus"
          size="sm"
        >
          Add Email
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {sequence.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <ApperIcon name="Mail" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No emails in sequence</h4>
            <p className="text-gray-500 mb-4">Create your first email to get started</p>
            <Button onClick={addEmail} icon="Plus">
              Add First Email
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sequence.map((email, index) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {email.subject || 'Untitled Email'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {index === 0 ? 'Sent immediately' : `Sent ${email.delay} ${email.delayUnit} after previous email`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveEmail(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ApperIcon name="ChevronUp" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveEmail(index, 'down')}
                        disabled={index === sequence.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ApperIcon name="ChevronDown" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="p-1 text-gray-400 hover:text-primary-600"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEmail(index)}
                        className="p-1 text-gray-400 hover:text-error-600"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {editingIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t"
                      >
                        <EmailEditor
                          email={email}
                          index={index}
                          onSave={() => setEditingIndex(null)}
                          onCancel={() => setEditingIndex(null)}
                        />
                      </motion.div>
                    )}
                    
                    {previewIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t"
                      >
                        <EmailPreview
                          email={email}
                          index={index}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailSequenceBuilder;