import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import EmailTemplateGallery from "@/components/organisms/EmailTemplateGallery";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const EmailSequenceBuilder = ({ sequence = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);
  const [showVariantComparison, setShowVariantComparison] = useState(null);
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

  const applyTemplate = (template) => {
    if (selectedTemplateIndex !== null) {
      updateEmail(selectedTemplateIndex, 'subject', template.subject);
      updateEmail(selectedTemplateIndex, 'body', template.body);
      setShowTemplateModal(false);
      setSelectedTemplateIndex(null);
    }
  };

const addVariant = (emailIndex) => {
    const email = sequence[emailIndex];
    if (!email) return;
    
    const newVariant = {
      id: Date.now(),
      name: `Variant ${email.abTest?.variants?.length + 1 || 1}`,
      subject: email.subject || '',
      body: email.body || '',
      trafficPercentage: 25,
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        conversion_rate: 0,
        open_rate: 0,
        click_rate: 0
      }
    };
const updatedSequence = [...sequence];
    if (!updatedSequence[emailIndex].abTest) {
      updatedSequence[emailIndex].abTest = {
        enabled: true,
        variants: [],
        testDuration: 7,
        winnerCriteria: 'open_rate'
      };
    }
    updatedSequence[emailIndex].abTest.variants.push(newVariant);
    onChange(updatedSequence);
  };
const updateVariant = (emailIndex, variantIndex, field, value) => {
    const updatedSequence = [...sequence];
    if (updatedSequence[emailIndex]?.abTest?.variants?.[variantIndex]) {
      updatedSequence[emailIndex].abTest.variants[variantIndex][field] = value;
      onChange(updatedSequence);
    }
  };
const deleteVariant = (emailIndex, variantIndex) => {
    const updatedSequence = [...sequence];
    if (updatedSequence[emailIndex]?.abTest?.variants) {
      updatedSequence[emailIndex].abTest.variants.splice(variantIndex, 1);
      onChange(updatedSequence);
    }
  };
const toggleAbTest = (emailIndex) => {
    const updatedSequence = [...sequence];
    if (!updatedSequence[emailIndex].abTest) {
      updatedSequence[emailIndex].abTest = {
        enabled: false,
        variants: [],
        testDuration: 7,
        winnerCriteria: 'open_rate'
      };
    }
    updatedSequence[emailIndex].abTest.enabled = !updatedSequence[emailIndex].abTest.enabled;
    if (updatedSequence[emailIndex].abTest.enabled && updatedSequence[emailIndex].abTest.variants.length === 0) {
      updatedSequence[emailIndex].abTest.variants = [
        {
          id: Date.now(),
          name: 'Variant A',
          subject: updatedSequence[emailIndex].subject,
          body: updatedSequence[emailIndex].body,
          trafficPercentage: 50,
          metrics: {
            sent: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            conversion_rate: 0,
            open_rate: 0,
            click_rate: 0
          }
        },
        {
          id: Date.now() + 1,
          name: 'Variant B',
          subject: updatedSequence[emailIndex].subject,
          body: updatedSequence[emailIndex].body,
          trafficPercentage: 50,
          metrics: {
            sent: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
            conversion_rate: 0,
            open_rate: 0,
            click_rate: 0
          }
        }
      ];
    }
    onChange(updatedSequence);
  };

  const EmailEditor = ({ email, index, onSave, onCancel }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* A/B Test Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
        <div className="flex items-center space-x-3">
          <ApperIcon name="TestTube" className="w-5 h-5 text-primary-600" />
          <div>
            <h4 className="font-medium text-primary-900">A/B Test This Email</h4>
            <p className="text-sm text-primary-700">Create variants to test different subject lines and content</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={email.abTest?.enabled || false}
            onChange={() => toggleAbTest(index)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {/* Standard Email Editor */}
      {!email.abTest?.enabled && (
        <div className="space-y-4">
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
        </div>
      )}

      {/* A/B Test Variants */}
      {email.abTest?.enabled && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Test Variants</h4>
            <Button
              onClick={() => addVariant(index)}
              variant="outline"
              size="sm"
              icon="Plus"
            >
              Add Variant
            </Button>
          </div>

          {email.abTest.variants.map((variant, variantIdx) => (
            <div key={variant.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  label="Variant Name"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, variantIdx, 'name', e.target.value)}
                  placeholder="Variant name..."
                  className="flex-1 mr-4"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    label="Traffic %"
                    type="number"
                    min="0"
                    max="100"
                    value={variant.trafficPercentage}
                    onChange={(e) => updateVariant(index, variantIdx, 'trafficPercentage', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <button
                    onClick={() => deleteVariant(index, variantIdx)}
                    className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <Input
                label="Subject Line"
                value={variant.subject}
                onChange={(e) => updateVariant(index, variantIdx, 'subject', e.target.value)}
                placeholder="Enter variant subject..."
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
                <textarea
                  value={variant.body}
                  onChange={(e) => updateVariant(index, variantIdx, 'body', e.target.value)}
                  placeholder="Write variant email content..."
                  rows={6}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Variant Metrics */}
              {variant.metrics.sent > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Performance</div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Sent</div>
                      <div className="font-medium">{variant.metrics.sent}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Open Rate</div>
                      <div className="font-medium">{(variant.metrics.open_rate * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Click Rate</div>
                      <div className="font-medium">{(variant.metrics.click_rate * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Replies</div>
                      <div className="font-medium">{variant.metrics.replied}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* A/B Test Settings */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h5 className="font-medium text-gray-900">Test Settings</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration (days)</label>
                <input
type="number"
                  min="1"
                  max="30"
                  value={email.abTest?.testDuration || 7}
                  onChange={(e) => updateEmail(index, 'abTest', {
                    ...email.abTest,
                    testDuration: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Winner Criteria</label>
<label className="block text-sm font-medium text-gray-700 mb-1">Winner Criteria</label>
                <select
                  value={email.abTest?.winnerCriteria || 'open_rate'}
                  onChange={(e) => updateEmail(index, 'abTest', {
                    ...email.abTest,
                    winnerCriteria: e.target.value
                  })}
                >
                  <option value="open_rate">Open Rate</option>
                  <option value="click_rate">Click Rate</option>
                  <option value="reply_rate">Reply Rate</option>
                  <option value="conversion_rate">Conversion Rate</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Timing Settings */}
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

      {/* Action Buttons */}
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
          <Button
            onClick={() => setShowTemplateModal(true)}
            variant="outline"
            size="sm"
            icon="Template"
          >
            Use Template
          </Button>
{email.abTest?.enabled && email.abTest.variants?.length > 0 && (
            <Button
              onClick={() => setShowVariantComparison(index)}
              variant="outline"
              size="sm"
              icon="BarChart3"
            >
              Compare Results
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            size="sm"
            disabled={email.abTest?.enabled ? 
              email.abTest.variants.length === 0 || 
              email.abTest.variants.some(v => !v.subject || !v.body) :
              !email.subject || !email.body
            }
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
      {!email.abTest?.enabled ? (
        <>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-2">Subject:</div>
            <div className="font-medium">{email.subject}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-2">Body:</div>
            <div className="whitespace-pre-wrap">{email.body}</div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">A/B Test Variants</h4>
            <div className="text-sm text-gray-500">{email.abTest.variants.length} variants</div>
          </div>
          
          {email.abTest.variants.map((variant, idx) => (
            <div key={variant.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">{variant.name}</h5>
                <div className="text-sm text-gray-500">{variant.trafficPercentage}% traffic</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Subject:</div>
                <div className="font-medium">{variant.subject}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Body:</div>
                <div className="whitespace-pre-wrap text-sm">{variant.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
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

  const VariantComparison = ({ email, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
<div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">A/B Test Results</h4>
        <div className="text-sm text-gray-500">
          Test Duration: {email.abTest?.testDuration || 7} days
        </div>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {email.abTest?.variants?.map((variant, idx) => (
          <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">{variant.name}</h5>
              {variant.metrics?.sent > 0 && (
                <div className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                  {variant.trafficPercentage}% traffic
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sent</span>
                <span className="font-medium">{variant.metrics.sent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Open Rate</span>
                <span className="font-medium">{(variant.metrics.open_rate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Click Rate</span>
                <span className="font-medium">{(variant.metrics.click_rate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Replies</span>
                <span className="font-medium">{variant.metrics.replied}</span>
              </div>
            </div>

            {variant.metrics.sent > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500 mb-1">Performance</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(variant.metrics.open_rate * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

<div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-500">
          Winner determined by: {email.abTest?.winnerCriteria?.replace('_', ' ') || 'open rate'}
        </div>
        <Button
          onClick={() => setShowVariantComparison(null)}
          variant="outline"
          size="sm"
        >
          Close Results
        </Button>
      </div>
    </motion.div>
  );

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Email Sequence</h3>
          <p className="text-sm text-gray-500">Build your email sequence with A/B testing capabilities</p>
        </div>
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
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {email.subject || 'Untitled Email'}
                          </h4>
                          {email.abTest?.enabled && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="TestTube" className="w-4 h-4 text-primary-600" />
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                                A/B Test ({email.abTest.variants.length} variants)
                              </span>
                            </div>
                          )}
                        </div>
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
                    
                    {showVariantComparison === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t"
                      >
                        <VariantComparison
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
)}
      </AnimatePresence>
      {/* Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
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
              className="bg-white rounded-xl shadow-xl max-w-6xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Choose Email Template</h2>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedTemplateIndex(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <EmailTemplateGallery
                  onSelectTemplate={applyTemplate}
                  selectionMode={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailSequenceBuilder;