import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import MetricCard from '@/components/molecules/MetricCard';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { emailThreadService } from '@/services/api/emailThreadService';
import { format } from 'date-fns';

const InboxPage = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedThread, setSelectedThread] = useState(null);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emailThreadService.getAll();
      setThreads(data);
    } catch (err) {
      setError('Failed to load inbox');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (threadId) => {
    try {
      await emailThreadService.update(threadId, { status: 'read' });
      setThreads(threads.map(t => 
        t.Id === threadId ? { ...t, status: 'read' } : t
      ));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleReply = async (threadId, message) => {
    try {
      const thread = threads.find(t => t.Id === threadId);
      const newMessage = {
        id: Date.now(),
        from: 'you@company.com',
        to: thread.messages[thread.messages.length - 1].from,
        subject: `Re: ${thread.subject}`,
        body: message,
        timestamp: new Date().toISOString(),
        type: 'sent'
      };
      
      const updatedMessages = [...thread.messages, newMessage];
      await emailThreadService.update(threadId, { 
        messages: updatedMessages,
        status: 'replied'
      });
      
      setThreads(threads.map(t => 
        t.Id === threadId ? { ...t, messages: updatedMessages, status: 'replied' } : t
      ));
      
      toast.success('Reply sent');
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = 
      thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.messages.some(msg => 
        msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || thread.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'unread': return 'warning';
      case 'read': return 'default';
      case 'replied': return 'success';
      case 'positive': return 'active';
      case 'negative': return 'danger';
      default: return 'default';
    }
  };

  // Calculate metrics
  const totalThreads = threads.length;
  const unreadThreads = threads.filter(t => t.status === 'unread').length;
  const positiveReplies = threads.filter(t => t.status === 'positive').length;
  const negativeReplies = threads.filter(t => t.status === 'negative').length;

  const ThreadDetail = ({ thread }) => {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendReply = async (e) => {
      e.preventDefault();
      if (!replyText.trim()) return;

      setSending(true);
      try {
        await handleReply(thread.Id, replyText);
        setReplyText('');
      } finally {
        setSending(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{thread.subject}</h2>
              <p className="text-sm text-gray-500">
                {thread.messages.length} messages
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(thread.status)}>
                {thread.status}
              </Badge>
              <button
                onClick={() => setSelectedThread(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {thread.messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.type === 'sent' 
                  ? 'bg-primary-50 border-l-4 border-primary-500 ml-8' 
                  : 'bg-gray-50 border-l-4 border-gray-300 mr-8'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{message.from}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                {message.type === 'received' && (
                  <ApperIcon name="ArrowDown" className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSendReply} className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={sending}
                disabled={!replyText.trim()}
                icon="Send"
              >
                Send Reply
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
          title="Failed to load inbox"
          message={error}
          onRetry={loadThreads}
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
          <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          <p className="text-gray-600">Manage email conversations and replies</p>
        </div>
        <Button
          onClick={loadThreads}
          variant="outline"
          icon="RefreshCw"
        >
          Refresh
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
          title="Total Conversations"
          value={totalThreads}
          icon="MessageSquare"
          gradient
        />
        <MetricCard
          title="Unread"
          value={unreadThreads}
          icon="Mail"
          gradient
        />
        <MetricCard
          title="Positive Replies"
          value={positiveReplies}
          icon="ThumbsUp"
          gradient
        />
        <MetricCard
          title="Negative Replies"
          value={negativeReplies}
          icon="ThumbsDown"
          gradient
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thread List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          {/* Thread List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-8">
                <Empty
                  title="No conversations found"
                  description="Email conversations will appear here when leads reply to your campaigns."
                  icon="MessageSquare"
                />
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedThread?.Id === thread.Id ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedThread(thread)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {thread.subject}
                          </h3>
                          <Badge variant={getStatusVariant(thread.status)} size="sm">
                            {thread.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {thread.messages[thread.messages.length - 1]?.from}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {thread.messages[thread.messages.length - 1]?.body}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <p className="text-xs text-gray-500">
                          {format(new Date(thread.messages[thread.messages.length - 1]?.timestamp), 'MMM d')}
                        </p>
                        {thread.status === 'unread' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(thread.Id);
                            }}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Thread Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-h-[calc(100vh-200px)]"
        >
          {selectedThread ? (
            <ThreadDetail thread={selectedThread} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ApperIcon name="MessageSquare" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InboxPage;