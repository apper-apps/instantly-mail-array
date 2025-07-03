import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import { emailValidationService } from '@/services/api/emailValidationService';

const EmailValidatorPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [validating, setValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [step, setStep] = useState(1);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.includes('text/csv') && !file.type.includes('text/plain')) {
      toast.error('Please upload a CSV or TXT file');
      return;
    }
    
    setFile(file);
    setStep(2);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleValidation = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setValidating(true);
      setProgress(0);
      setStep(3);

      const validationResults = await emailValidationService.validateBulk(file, (progress) => {
        setProgress(progress);
      });

      setResults(validationResults);
      setStep(4);
      toast.success(`Validation complete! ${validationResults.valid.length} valid emails found`);
    } catch (error) {
      toast.error('Failed to validate emails');
      setStep(2);
    } finally {
      setValidating(false);
    }
  };

  const handleExport = async (type) => {
    if (!results) return;

    try {
      const data = type === 'valid' ? results.valid : results.invalid;
      await emailValidationService.exportResults(data, type);
      toast.success(`${type} emails exported successfully`);
    } catch (error) {
      toast.error('Failed to export results');
    }
  };

  const handleReset = () => {
    setFile(null);
    setValidating(false);
    setProgress(0);
    setResults(null);
    setStep(1);
  };

  const getStepStatus = (stepNumber) => {
    if (step > stepNumber) return 'completed';
    if (step === stepNumber) return 'active';
    return 'pending';
  };

  const getStepClasses = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    if (status === 'completed') return 'bg-success-600 text-white';
    if (status === 'active') return 'bg-primary-600 text-white';
    return 'bg-gray-200 text-gray-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Validator</h1>
          <p className="text-gray-600">
            Validate email addresses in bulk before sending campaigns
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleReset}
            variant="outline"
            icon="RefreshCw"
          >
            Start Over
          </Button>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(1)}`}>
                <ApperIcon name="Upload" className="w-5 h-5" />
              </div>
              <div className={`w-20 h-0.5 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(2)}`}>
                <ApperIcon name="Settings" className="w-5 h-5" />
              </div>
              <div className={`w-20 h-0.5 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(3)}`}>
                <ApperIcon name="Loader" className="w-5 h-5" />
              </div>
              <div className={`w-20 h-0.5 ${step >= 4 ? 'bg-primary-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClasses(4)}`}>
                <ApperIcon name="CheckCircle" className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Upload File</span>
            <span>Configure</span>
            <span>Validate</span>
            <span>Results</span>
          </div>
        </Card>
      </motion.div>

      {/* Step Content */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="p-8">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
                      <ApperIcon name="Upload" className="w-10 h-10 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Upload Email List
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Drag and drop your CSV or TXT file here, or click to browse
                      </p>
                      <Button variant="outline" size="lg">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">File Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-success-600 mr-2" />
                        CSV or TXT format
                      </li>
                      <li className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-success-600 mr-2" />
                        One email per line
                      </li>
                      <li className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-success-600 mr-2" />
                        Maximum 100,000 emails
                      </li>
                      <li className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-success-600 mr-2" />
                        File size limit: 50MB
                      </li>
                    </ul>
                  </div>

                  <div className="bg-primary-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Validation Checks</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-center">
                        <ApperIcon name="Shield" className="w-4 h-4 text-primary-600 mr-2" />
                        Syntax validation
                      </li>
                      <li className="flex items-center">
                        <ApperIcon name="Shield" className="w-4 h-4 text-primary-600 mr-2" />
                        Domain verification
                      </li>
                      <li className="flex items-center">
                        <ApperIcon name="Shield" className="w-4 h-4 text-primary-600 mr-2" />
                        Disposable email detection
                      </li>
                      <li className="flex items-center">
                        <ApperIcon name="Shield" className="w-4 h-4 text-primary-600 mr-2" />
                        Role-based account detection
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    File Ready for Validation
                  </h3>
                  <p className="text-gray-600">
                    Your file "{file?.name}" has been uploaded successfully
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="FileText" className="w-8 h-8 text-primary-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{file?.name}</p>
                        <p className="text-sm text-gray-500">
                          {file?.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown size'}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleValidation}
                      size="lg"
                      icon="Play"
                    >
                      Start Validation
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                  >
                    Choose Different File
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Validating Emails
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we validate your email addresses
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin">
                        <ApperIcon name="Loader" className="w-6 h-6 text-primary-600" />
                      </div>
                      <span className="text-gray-600">Validating emails...</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 4 && results && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="space-y-6">
                {/* Results Overview */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Validation Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Emails</p>
                          <p className="text-2xl font-bold text-primary-600">{results.total}</p>
                        </div>
                        <ApperIcon name="Mail" className="w-8 h-8 text-primary-600" />
                      </div>
                    </div>
                    
                    <div className="bg-success-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Valid</p>
                          <p className="text-2xl font-bold text-success-600">{results.valid.length}</p>
                        </div>
                        <ApperIcon name="CheckCircle" className="w-8 h-8 text-success-600" />
                      </div>
                    </div>
                    
                    <div className="bg-error-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Invalid</p>
                          <p className="text-2xl font-bold text-error-600">{results.invalid.length}</p>
                        </div>
                        <ApperIcon name="XCircle" className="w-8 h-8 text-error-600" />
                      </div>
                    </div>
                    
                    <div className="bg-warning-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Risky</p>
                          <p className="text-2xl font-bold text-warning-600">{results.risky.length}</p>
                        </div>
                        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-warning-600" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleExport('valid')}
                      variant="success"
                      icon="Download"
                    >
                      Export Valid Emails
                    </Button>
                    <Button
                      onClick={() => handleExport('invalid')}
                      variant="outline"
                      icon="Download"
                    >
                      Export Invalid Emails
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      icon="RefreshCw"
                    >
                      Validate Another File
                    </Button>
                  </div>
                </Card>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Valid Emails</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.valid.slice(0, 10).map((email, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-success-50 rounded">
                          <span className="text-sm text-gray-700">{email}</span>
                          <ApperIcon name="CheckCircle" className="w-4 h-4 text-success-600" />
                        </div>
                      ))}
                      {results.valid.length > 10 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... and {results.valid.length - 10} more
                        </p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Invalid Emails</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.invalid.slice(0, 10).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-error-50 rounded">
                          <div>
                            <span className="text-sm text-gray-700">{item.email}</span>
                            <p className="text-xs text-error-600">{item.reason}</p>
                          </div>
                          <ApperIcon name="XCircle" className="w-4 h-4 text-error-600" />
                        </div>
                      ))}
                      {results.invalid.length > 10 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... and {results.invalid.length - 10} more
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailValidatorPage;