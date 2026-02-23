import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Clock, Edit, Trash2, Plus } from 'lucide-react';
import Button from '../components/Button.tsx';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts/admin/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transmission?')) return;

    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const publishedPosts = posts.filter(p => p.published).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-mono text-white">Command Center</h1>
        <Link to="/admin/posts/new">
          <Button icon={Plus}>New Transmission</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-mono text-sm uppercase">Total Transmissions</h3>
            <FileText className="text-neon-green w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{posts.length}</p>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-mono text-sm uppercase">Total Views</h3>
            <Eye className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{totalViews}</p>
        </div>
        <div className="bg-dark-card p-6 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-mono text-sm uppercase">Active Signals</h3>
            <Clock className="text-deep-red w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">{publishedPosts}</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-dark-card rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-white font-mono">Recent Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-300 font-mono uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Views</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${post.published ? 'bg-neon-green/10 text-neon-green' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {post.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{format(new Date(post.created_at), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 font-mono">{post.views}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/admin/posts/${post.id}`}>
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-deep-red hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
