import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { campaignService } from '@/services/api/campaignService';

const AbTestingPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [abTests, setAbTests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const campaignsData = await campaignService.getAll();
      setCampaigns(campaignsData);
      
      // Extract A/B tests from campaigns
      const testsData = [];
      campaignsData.forEach(campaign => {
        campaign.emailSequence.forEach((email, emailIdx) => {
          if (email.abTest?.enabled) {
            testsData.push({
              id: `${campaign.Id}-${emailIdx}`,
              campaignId: campaign.Id,
              campaignName: campaign.name,
              emailIndex: emailIdx,
              emailSubject: email.subject || 'Untitled Email',
              abTest: email.abTest,
              status: email.abTest.status || 'draft'
            });
          }
        });
      });
      setAbTests(testsData);
    } catch (err) {
      setError('Failed to load A/B tests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'completed': return 'bg-primary-100 text-primary-800';
      case 'paused': return 'bg-warning-100 text-warning-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinnerVariant = (abTest) => {
    if (!abTest.variants || abTest.variants.length === 0) return null;
    
    const criteriaMap = {
      'open_rate': 'open_rate',
      'click_rate': 'click_rate',
      'reply_rate': 'replied',
      'conversion_rate': 'conversion_rate'
    };
    
    const criteria = criteriaMap[abTest.winnerCriteria] || 'open_rate';
    
    return abTest.variants.reduce((winner, variant) => {
      if (variant.metrics[criteria] > (winner?.metrics[criteria] || 0)) {
        return variant;
      }
      return winner;
    }, null);
  };

  const calculateTotalMetrics = (variants) => {
    return variants.reduce((total, variant) => ({
      sent: total.sent + variant.metrics.sent,
      opened: total.opened + variant.metrics.opened,
      clicked: total.clicked + variant.metrics.clicked,
      replied: total.replied + variant.metrics.replied
    }), { sent: 0, opened: 0, clicked: 0, replied: 0 });
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error
          title="Failed to load A/B tests"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">A/B Testing</h1>
          <p className="text-gray-600">
            Manage and analyze your email A/B tests to optimize campaign performance
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
        >
          Create A/B Test
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="TestTube" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{abTests.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Play" className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {abTests.filter(test => test.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Pause" className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paused Tests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {abTests.filter(test => test.status === 'paused').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {abTests.filter(test => test.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* A/B Tests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">A/B Tests</h2>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedCampaign || ''}
                onChange={(e) => setSelectedCampaign(e.target.value || null)}
                options={[
                  { value: '', label: 'All Campaigns' },
                  ...campaigns.map(campaign => ({
                    value: campaign.Id,
                    label: campaign.name
                  }))
                ]}
              />
            </div>
          </div>

          {abTests.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="TestTube" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No A/B Tests</h3>
              <p className="text-gray-500 mb-4">
                Create your first A/B test to start optimizing your email campaigns
              </p>
              <Button onClick={() => setShowCreateModal(true)} icon="Plus">
                Create A/B Test
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {abTests
                .filter(test => !selectedCampaign || test.campaignId === parseInt(selectedCampaign))
                .map((test) => {
                  const winner = getWinnerVariant(test.abTest);
                  const totalMetrics = calculateTotalMetrics(test.abTest.variants);
                  
                  return (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{test.emailSubject}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Campaign: {test.campaignName} • {test.abTest.variants.length} variants • {test.abTest.testDuration} days
                          </p>
                          
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Total Sent</div>
                              <div className="font-medium">{totalMetrics.sent}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Opens</div>
                              <div className="font-medium">{totalMetrics.opened}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Clicks</div>
                              <div className="font-medium">{totalMetrics.clicked}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Replies</div>
                              <div className="font-medium">{totalMetrics.replied}</div>
                            </div>
                          </div>

                          {winner && (
                            <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <ApperIcon name="Trophy" className="w-4 h-4 text-success-600" />
                                <span className="text-sm font-medium text-success-900">
                                  Leading Variant: {winner.name}
                                </span>
                                <span className="text-sm text-success-700">
                                  ({(winner.metrics[test.abTest.winnerCriteria.replace('_rate', '_rate')] * 100).toFixed(1)}% {test.abTest.winnerCriteria.replace('_', ' ')})
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon="BarChart3"
                            onClick={() => toast.info('Detailed analytics coming soon!')}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="Edit"
                            onClick={() => toast.info('Edit functionality coming soon!')}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Create A/B Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create A/B Test</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <ApperIcon name="TestTube" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">A/B Test Integration</h4>
              <p className="text-gray-500 mb-4">
                A/B tests are created directly within your email campaigns. Go to the Campaign Builder and enable A/B testing for any email in your sequence.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    window.location.href = '/campaigns/new';
                  }}
                  className="flex-1"
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AbTestingPage;