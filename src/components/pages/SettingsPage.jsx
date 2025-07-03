import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Instantly Mail',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    },
    email: {
      defaultFromName: 'Your Name',
      defaultReplyTo: 'reply@company.com',
      trackingDomain: 'track.company.com',
      unsubscribeUrl: 'https://company.com/unsubscribe'
    },
    sending: {
      maxDailyEmails: 500,
      sendingWindow: { start: 9, end: 17 },
      respectTimezones: true,
      pauseOnWeekends: true
    },
    warmup: {
      enabled: true,
      dailyIncrease: 5,
      maxWarmupEmails: 50,
      replyRate: 25
    },
    notifications: {
      emailReplies: true,
      campaignComplete: true,
      dailyReports: false,
      weeklyReports: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'sending', label: 'Sending', icon: 'Send' },
    { id: 'warmup', label: 'Warmup', icon: 'TrendingUp' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const updateSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
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

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={settings.general.companyName}
            onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
          />
          <Select
            label="Timezone"
            value={settings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
            options={timezoneOptions}
          />
          <Select
            label="Date Format"
            value={settings.general.dateFormat}
            onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
            options={dateFormatOptions}
          />
          <Select
            label="Language"
            value={settings.general.language}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
            options={languageOptions}
          />
        </div>
      </div>
    </div>
  );

  const EmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
        <div className="space-y-4">
          <Input
            label="Default From Name"
            value={settings.email.defaultFromName}
            onChange={(e) => updateSetting('email', 'defaultFromName', e.target.value)}
          />
          <Input
            label="Default Reply-To Email"
            type="email"
            value={settings.email.defaultReplyTo}
            onChange={(e) => updateSetting('email', 'defaultReplyTo', e.target.value)}
          />
          <Input
            label="Tracking Domain"
            value={settings.email.trackingDomain}
            onChange={(e) => updateSetting('email', 'trackingDomain', e.target.value)}
          />
          <Input
            label="Unsubscribe URL"
            value={settings.email.unsubscribeUrl}
            onChange={(e) => updateSetting('email', 'unsubscribeUrl', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const SendingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sending Settings</h3>
        <div className="space-y-4">
          <Input
            label="Max Daily Emails"
            type="number"
            value={settings.sending.maxDailyEmails}
            onChange={(e) => updateSetting('sending', 'maxDailyEmails', parseInt(e.target.value))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sending Window Start"
              type="number"
              min="0"
              max="23"
              value={settings.sending.sendingWindow.start}
              onChange={(e) => updateSetting('sending', 'sendingWindow', {
                ...settings.sending.sendingWindow,
                start: parseInt(e.target.value)
              })}
            />
            <Input
              label="Sending Window End"
              type="number"
              min="0"
              max="23"
              value={settings.sending.sendingWindow.end}
              onChange={(e) => updateSetting('sending', 'sendingWindow', {
                ...settings.sending.sendingWindow,
                end: parseInt(e.target.value)
              })}
            />
          </div>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.sending.respectTimezones}
                onChange={(e) => updateSetting('sending', 'respectTimezones', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Respect lead timezones</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.sending.pauseOnWeekends}
                onChange={(e) => updateSetting('sending', 'pauseOnWeekends', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Pause sending on weekends</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const WarmupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Warmup Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.warmup.enabled}
              onChange={(e) => updateSetting('warmup', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable automatic warmup</span>
          </label>
          {settings.warmup.enabled && (
            <div className="space-y-4 ml-6">
              <Input
                label="Daily Increase"
                type="number"
                value={settings.warmup.dailyIncrease}
                onChange={(e) => updateSetting('warmup', 'dailyIncrease', parseInt(e.target.value))}
              />
              <Input
                label="Max Warmup Emails"
                type="number"
                value={settings.warmup.maxWarmupEmails}
                onChange={(e) => updateSetting('warmup', 'maxWarmupEmails', parseInt(e.target.value))}
              />
              <Input
                label="Target Reply Rate (%)"
                type="number"
                value={settings.warmup.replyRate}
                onChange={(e) => updateSetting('warmup', 'replyRate', parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.emailReplies}
              onChange={(e) => updateSetting('notifications', 'emailReplies', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Email replies</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.campaignComplete}
              onChange={(e) => updateSetting('notifications', 'campaignComplete', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Campaign completion</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.dailyReports}
              onChange={(e) => updateSetting('notifications', 'dailyReports', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Daily reports</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.weeklyReports}
              onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Weekly reports</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'email':
        return <EmailSettings />;
      case 'sending':
        return <SendingSettings />;
      case 'warmup':
        return <WarmupSettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <GeneralSettings />;
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your application preferences</p>
        </div>
        <Button onClick={handleSave} icon="Save">
          Save Changes
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="p-6">
            {renderTabContent()}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;