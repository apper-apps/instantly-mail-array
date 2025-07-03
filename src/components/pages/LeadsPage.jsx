import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import MetricCard from '@/components/molecules/MetricCard';
import SearchBar from '@/components/molecules/SearchBar';
import LeadImporter from '@/components/organisms/LeadImporter';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { leadService } from '@/services/api/leadService';
import { format } from 'date-fns';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImporter, setShowImporter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getAll();
      setLeads(data);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (importedLeads) => {
    try {
      const newLeads = [];
      for (const lead of importedLeads) {
        const createdLead = await leadService.create(lead);
        newLeads.push(createdLead);
      }
      setLeads([...newLeads, ...leads]);
      toast.success(`Successfully imported ${newLeads.length} leads`);
    } catch (err) {
      toast.error('Failed to import leads');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadService.delete(id);
      setLeads(leads.filter(l => l.Id !== id));
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) return;
    
    try {
      for (const id of selectedLeads) {
        await leadService.delete(id);
      }
      setLeads(leads.filter(l => !selectedLeads.includes(l.Id)));
      setSelectedLeads([]);
      toast.success(`Successfully deleted ${selectedLeads.length} leads`);
    } catch (err) {
      toast.error('Failed to delete leads');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadService.update(id, { status: newStatus });
      setLeads(leads.map(l => 
        l.Id === id ? { ...l, status: newStatus } : l
      ));
      toast.success('Lead status updated');
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  const toggleLeadSelection = (id) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedLeads(prev => 
      prev.length === filteredLeads.length 
        ? []
        : filteredLeads.map(lead => lead.Id)
    );
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'contacted': return 'primary';
      case 'replied': return 'active';
      case 'bounced': return 'danger';
      case 'unsubscribed': return 'warning';
      default: return 'default';
    }
  };

  // Calculate metrics
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => l.status === 'active').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const repliedLeads = leads.filter(l => l.status === 'replied').length;

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error
          title="Failed to load leads"
          message={error}
          onRetry={loadLeads}
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
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your lead database</p>
        </div>
        <Button
          onClick={() => setShowImporter(true)}
          icon="Upload"
          className="shadow-lg"
        >
          Import Leads
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
          title="Total Leads"
          value={totalLeads}
          icon="Users"
          gradient
        />
        <MetricCard
          title="Active Leads"
          value={activeLeads}
          icon="UserCheck"
          gradient
        />
        <MetricCard
          title="Contacted"
          value={contactedLeads}
          icon="Mail"
          gradient
        />
        <MetricCard
          title="Replied"
          value={repliedLeads}
          icon="MessageSquare"
          gradient
        />
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads..."
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="bounced">Bounced</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          {selectedLeads.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="danger"
              size="sm"
              icon="Trash2"
            >
              Delete Selected ({selectedLeads.length})
            </Button>
          )}
          <div className="text-sm text-gray-500">
            {filteredLeads.length} of {totalLeads} leads
          </div>
        </div>
      </motion.div>

      {/* Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredLeads.length === 0 ? (
          <Empty
            title="No leads found"
            description={searchTerm || statusFilter !== 'all' 
              ? "No leads match your search criteria. Try adjusting your filters."
              : "Import your first leads to get started with email campaigns."
            }
            icon="Users"
            actionText="Import Leads"
            onAction={() => setShowImporter(true)}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.Id)}
                          onChange={() => toggleLeadSelection(lead.Id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.company || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.Id, e.target.value)}
                          className="text-sm border-0 bg-transparent focus:ring-0 p-0"
                        >
                          <option value="active">Active</option>
                          <option value="contacted">Contacted</option>
                          <option value="replied">Replied</option>
                          <option value="bounced">Bounced</option>
                          <option value="unsubscribed">Unsubscribed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(lead.createdAt || Date.now()), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(lead.Id)}
                          className="text-gray-400 hover:text-error-600 transition-colors"
                          title="Delete lead"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Lead Importer Modal */}
      <AnimatePresence>
        {showImporter && (
          <LeadImporter
            onImport={handleImport}
            onClose={() => setShowImporter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadsPage;