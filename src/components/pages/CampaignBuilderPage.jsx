import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import EmailSequenceBuilder from '@/components/organisms/EmailSequenceBuilder';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { campaignService } from '@/services/api/campaignService';
import { emailAccountService } from '@/services/api/emailAccountService';

const CampaignBuilderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState([]);
  
  const [campaign, setCampaign] = useState({
    name: '',
    emailSequence: [],
    schedule: {
      timezone: 'UTC',
      sendingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      sendingHours: { start: 9, end: 17 },
      dailyLimit: 50
    },
    settings: {
      trackOpens: true,
      trackClicks: true,
      unsubscribeLink: true,
      spamCheck: true
    },
    status: 'draft'
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load email accounts
      const accountsData = await emailAccountService.getAll();
      setAccounts(accountsData);
      
      // Load campaign if editing
      if (isEditing) {
        const campaignData = await campaignService.getById(parseInt(id));
        setCampaign(campaignData);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status = 'draft') => {
    if (!campaign.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    if (campaign.emailSequence.length === 0) {
      toast.error('At least one email is required');
      return;
    }

    try {
      setSaving(true);
      const campaignData = { ...campaign, status };
      
      if (isEditing) {
        await campaignService.update(parseInt(id), campaignData);
        toast.success('Campaign updated successfully');
      } else {
        await campaignService.create(campaignData);
        toast.success('Campaign created successfully');
      }
      
      navigate('/campaigns');
    } catch (err) {
      toast.error('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const updateCampaign = (field, value) => {
    setCampaign(prev => ({ ...prev, [field]: value }));
  };

  const updateSchedule = (field, value) => {
    setCampaign(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value }
    }));
  };

  const updateSettings = (field, value) => {
    setCampaign(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

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
          title="Failed to load campaign"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Campaign' : 'Create Campaign'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your campaign settings' : 'Build your email sequence and configure settings'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate('/campaigns')}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave('draft')}
            variant="secondary"
            loading={saving}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave('active')}
            loading={saving}
            disabled={campaign.emailSequence.length === 0}
          >
            {isEditing ? 'Update & Launch' : 'Create & Launch'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Campaign Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h2>
              <div className="space-y-4">
                <Input
                  label="Campaign Name"
                  value={campaign.name}
                  onChange={(e) => updateCampaign('name', e.target.value)}
                  placeholder="Enter campaign name..."
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={campaign.description || ''}
                    onChange={(e) => updateCampaign('description', e.target.value)}
                    placeholder="Describe your campaign..."
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Email Sequence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <EmailSequenceBuilder
                sequence={campaign.emailSequence}
                onChange={(sequence) => updateCampaign('emailSequence', sequence)}
              />
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sending Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sending Schedule</h3>
              <div className="space-y-4">
                <Select
                  label="Timezone"
                  value={campaign.schedule.timezone}
                  onChange={(e) => updateSchedule('timezone', e.target.value)}
                  options={timezoneOptions}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sending Days
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dayOptions.map(day => (
                      <label key={day.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={campaign.schedule.sendingDays.includes(day.value)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...campaign.schedule.sendingDays, day.value]
                              : campaign.schedule.sendingDays.filter(d => d !== day.value);
                            updateSchedule('sendingDays', days);
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Hour"
                    type="number"
                    min="0"
                    max="23"
                    value={campaign.schedule.sendingHours.start}
                    onChange={(e) => updateSchedule('sendingHours', {
                      ...campaign.schedule.sendingHours,
                      start: parseInt(e.target.value)
                    })}
                  />
                  <Input
                    label="End Hour"
                    type="number"
                    min="0"
                    max="23"
                    value={campaign.schedule.sendingHours.end}
                    onChange={(e) => updateSchedule('sendingHours', {
                      ...campaign.schedule.sendingHours,
                      end: parseInt(e.target.value)
                    })}
                  />
                </div>
                
                <Input
                  label="Daily Sending Limit"
                  type="number"
                  min="1"
                  max="1000"
                  value={campaign.schedule.dailyLimit}
                  onChange={(e) => updateSchedule('dailyLimit', parseInt(e.target.value))}
                />
              </div>
            </Card>
          </motion.div>

          {/* Campaign Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={campaign.settings.trackOpens}
                    onChange={(e) => updateSettings('trackOpens', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Track email opens</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={campaign.settings.trackClicks}
                    onChange={(e) => updateSettings('trackClicks', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Track link clicks</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={campaign.settings.unsubscribeLink}
                    onChange={(e) => updateSettings('unsubscribeLink', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include unsubscribe link</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={campaign.settings.spamCheck}
                    onChange={(e) => updateSettings('spamCheck', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable spam check</span>
                </label>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderPage;