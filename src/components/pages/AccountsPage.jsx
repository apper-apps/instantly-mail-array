import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MetricCard from "@/components/molecules/MetricCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import { emailAccountService } from "@/services/api/emailAccountService";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    provider: '',
    password: '',
    smtpHost: '',
    smtpPort: '',
    dailyLimit: 50,
    warmupEnabled: true
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emailAccountService.getAll();
      setAccounts(data);
    } catch (err) {
      setError('Failed to load email accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.provider) {
      toast.error('Email and provider are required');
      return;
    }

    try {
      const newAccount = await emailAccountService.create({
        ...formData,
        status: 'connected',
        warmupProgress: formData.warmupEnabled ? 0 : 100
      });
      setAccounts([newAccount, ...accounts]);
      setShowAddForm(false);
      setFormData({
        email: '',
        provider: '',
        password: '',
        smtpHost: '',
        smtpPort: '',
        dailyLimit: 50,
        warmupEnabled: true
      });
      toast.success('Email account added successfully');
    } catch (err) {
      toast.error('Failed to add email account');
    }
  };

  const handleToggleWarmup = async (id) => {
    try {
      const account = accounts.find(a => a.Id === id);
      const warmupEnabled = !account.warmupEnabled;
      
      await emailAccountService.update(id, { warmupEnabled });
      setAccounts(accounts.map(a => 
        a.Id === id ? { ...a, warmupEnabled } : a
      ));
      
      toast.success(`Warmup ${warmupEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to toggle warmup');
    }
  };

  const handleUpdateLimit = async (id, newLimit) => {
    try {
      await emailAccountService.update(id, { dailyLimit: newLimit });
      setAccounts(accounts.map(a => 
        a.Id === id ? { ...a, dailyLimit: newLimit } : a
      ));
      toast.success('Daily limit updated');
    } catch (err) {
      toast.error('Failed to update daily limit');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this email account?')) return;
    
    try {
      await emailAccountService.delete(id);
      setAccounts(accounts.filter(a => a.Id !== id));
      toast.success('Email account removed');
    } catch (err) {
      toast.error('Failed to remove email account');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'danger';
      case 'warming': return 'warning';
      case 'limited': return 'warning';
      default: return 'default';
    }
  };

const providerOptions = [
    { value: 'gmail', label: 'Gmail' },
    { value: 'outlook', label: 'Outlook' },
    { value: 'yahoo', label: 'Yahoo' },
    { value: 'custom', label: 'Custom SMTP' }
  ];
  // Warmup Dashboard Components
  const ReputationGauge = ({ reputation }) => {
    const getReputationColor = (score) => {
      if (score >= 80) return 'text-success-600';
      if (score >= 60) return 'text-warning-600';
      return 'text-error-600';
    };

    const getReputationBg = (score) => {
      if (score >= 80) return 'bg-success-50';
      if (score >= 60) return 'bg-warning-50';
      return 'bg-error-50';
    };

    return (
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-3 rounded-lg ${getReputationBg(reputation.deliverability)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Deliverability</span>
            <span className={`text-xs font-bold ${getReputationColor(reputation.deliverability)}`}>
              {reputation.deliverability}%
            </span>
          </div>
          <ProgressRing
            progress={reputation.deliverability}
            size={24}
            strokeWidth={2}
            className="mx-auto"
          />
        </div>

        <div className={`p-3 rounded-lg ${getReputationBg(reputation.senderReputation)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Sender Rep</span>
            <span className={`text-xs font-bold ${getReputationColor(reputation.senderReputation)}`}>
              {reputation.senderReputation}%
            </span>
          </div>
          <ProgressRing
            progress={reputation.senderReputation}
            size={24}
            strokeWidth={2}
            className="mx-auto"
          />
        </div>

        <div className={`p-3 rounded-lg ${getReputationBg(reputation.domainHealth)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Domain Health</span>
            <span className={`text-xs font-bold ${getReputationColor(reputation.domainHealth)}`}>
              {reputation.domainHealth}%
            </span>
          </div>
          <ProgressRing
            progress={reputation.domainHealth}
            size={24}
            strokeWidth={2}
            className="mx-auto"
          />
        </div>
      </div>
    );
  };

  const ActivityTimeline = ({ activities }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'warmup_start': return 'Play';
        case 'warmup_progress': return 'TrendingUp';
        case 'warmup_complete': return 'CheckCircle';
        case 'reputation_improve': return 'ArrowUp';
        case 'reputation_decline': return 'ArrowDown';
        case 'limit_increase': return 'Plus';
        case 'limit_decrease': return 'Minus';
        default: return 'Activity';
      }
    };

    const getActivityColor = (status) => {
      switch (status) {
        case 'success': return 'text-success-600 bg-success-50';
        case 'warning': return 'text-warning-600 bg-warning-50';
        case 'error': return 'text-error-600 bg-error-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    return (
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {activities.slice(0, 10).map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.status)}`}>
              <ApperIcon name={getActivityIcon(activity.type)} className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-900 font-medium">{activity.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const WarmupDashboard = ({ account }) => {
    const [showDashboard, setShowDashboard] = useState(false);

    if (!account.warmupEnabled) return null;

    return (
      <div className="mb-4 border-b pb-4">
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name="BarChart3" className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Warmup Dashboard</span>
          </div>
          <ApperIcon 
            name={showDashboard ? "ChevronUp" : "ChevronDown"} 
            className="w-4 h-4 text-primary-600" 
          />
        </button>

        <AnimatePresence>
          {showDashboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              {/* Reputation Gauges */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Reputation Scores</h4>
                <ReputationGauge reputation={account.reputation || {}} />
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Timeline</h4>
                <ActivityTimeline activities={account.warmupActivity || []} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Calculate metrics

  // Calculate metrics
  const totalAccounts = accounts.length;
  const connectedAccounts = accounts.filter(a => a.status === 'connected').length;
  const warmingAccounts = accounts.filter(a => a.warmupEnabled && a.warmupProgress < 100).length;
  const totalDailyLimit = accounts.reduce((sum, a) => sum + (a.dailyLimit || 0), 0);

  const AddAccountForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Email Account</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              required
            />

            <Select
              label="Provider"
              value={formData.provider}
              onChange={(e) => setFormData({...formData, provider: e.target.value})}
              options={providerOptions}
              required
            />

            <Input
              label="Password / App Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter password"
              required
            />

            {formData.provider === 'custom' && (
              <>
                <Input
                  label="SMTP Host"
                  value={formData.smtpHost}
                  onChange={(e) => setFormData({...formData, smtpHost: e.target.value})}
                  placeholder="smtp.example.com"
                />
                <Input
                  label="SMTP Port"
                  type="number"
                  value={formData.smtpPort}
                  onChange={(e) => setFormData({...formData, smtpPort: e.target.value})}
                  placeholder="587"
                />
              </>
            )}

            <Input
              label="Daily Sending Limit"
              type="number"
              min="1"
              max="500"
              value={formData.dailyLimit}
              onChange={(e) => setFormData({...formData, dailyLimit: parseInt(e.target.value)})}
            />

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.warmupEnabled}
                onChange={(e) => setFormData({...formData, warmupEnabled: e.target.checked})}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable email warmup</span>
            </label>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={() => setShowAddForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" icon="Plus">
                Add Account
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error
          title="Failed to load email accounts"
          message={error}
          onRetry={loadAccounts}
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
          <h1 className="text-2xl font-bold text-gray-900">Email Accounts</h1>
          <p className="text-gray-600">Manage your email accounts and warmup settings</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          icon="Plus"
          className="shadow-lg"
        >
          Add Account
        </Button>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Accounts"
          value={totalAccounts}
          icon="Mail"
          gradient
        />
        <MetricCard
          title="Connected"
          value={connectedAccounts}
          icon="CheckCircle"
          gradient
        />
        <MetricCard
          title="Warming Up"
          value={warmingAccounts}
          icon="TrendingUp"
          gradient
        />
        <MetricCard
          title="Daily Limit"
          value={totalDailyLimit}
          icon="Send"
          gradient
        />
      </motion.div>

      {/* Accounts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {accounts.length === 0 ? (
          <Empty
            title="No email accounts connected"
            description="Connect your first email account to start sending campaigns."
            icon="Mail"
            actionText="Add Account"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <motion.div
                key={account.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <ApperIcon name="Mail" className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.email}</h3>
                        <p className="text-sm text-gray-500 capitalize">{account.provider}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(account.status)}>
                      {account.status}
                    </Badge>
</div>

                  <WarmupDashboard account={account} />

                  <div className="space-y-4">
                    {/* Warmup Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Warmup Progress</span>
                        <ProgressRing
                          progress={account.warmupProgress || 0}
                          size={32}
                          strokeWidth={3}
                        />
                      </div>
                      <button
                        onClick={() => handleToggleWarmup(account.Id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          account.warmupEnabled
                            ? 'bg-success-100 text-success-700 hover:bg-success-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {account.warmupEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* Daily Limit */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Daily Limit</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={account.dailyLimit}
                          onChange={(e) => handleUpdateLimit(account.Id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          min="1"
                          max="500"
                        />
                        <span className="text-sm text-gray-500">emails/day</span>
                      </div>
                    </div>

                    {/* Usage Today */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Usage Today</span>
                      <span className="text-sm text-gray-600">
                        {account.sentToday || 0} / {account.dailyLimit}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(account.Id)}
                          className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                          title="Remove account"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Connected {new Date(account.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddForm && <AddAccountForm />}
      </AnimatePresence>
    </div>
  );
};

export default AccountsPage;