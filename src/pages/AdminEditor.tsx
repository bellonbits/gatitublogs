import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/Input.tsx';
import Button from '../components/Button.tsx';
import { Save, Upload, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AdminEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Backend',
    tags: '',
    published: false,
    cover_image: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/posts/${id}`) // Note: Public API gets by slug, need admin API to get by ID or adjust backend
      // Actually, let's just use the public API if slug is available or create an admin endpoint.
      // For simplicity, I'll assume I can fetch by ID or I'll just fetch all and find it (inefficient but works for small app)
      // Better: let's use the admin list endpoint and filter, or add a getById endpoint.
      // I'll add a getById endpoint to postRoutes.ts later if needed, but for now let's try to fetch by slug if I had it, but I have ID.
      // Let's just fetch all admin posts and find it for now to save a file edit.
      fetch('/api/posts/admin/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          const post = data.find((p: any) => p.id === parseInt(id));
          if (post) {
            setFormData({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || '',
              category: post.category,
              tags: post.tags || '',
              published: !!post.published,
              cover_image: post.cover_image || ''
            });
          }
        });
    }
  }, [id, isNew]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      setFormData(prev => ({ ...prev, cover_image: data.url }));
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isNew ? '/api/posts' : `/api/posts/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save');
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save transmission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold font-mono text-white">
            {isNew ? 'Initialize New Transmission' : 'Edit Transmission'}
          </h1>
        </div>
        <Button onClick={handleSubmit} isLoading={loading} icon={Save}>
          {isNew ? 'Publish Signal' : 'Update Signal'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-card p-6 rounded-xl border border-white/5">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter transmission title..."
              className="text-lg font-bold"
            />
            
            <div className="mt-6">
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Content (Markdown)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-96 bg-dark-bg border border-white/10 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-neon-green resize-y"
                placeholder="# Write your story..."
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-dark-card p-6 rounded-xl border border-white/5">
            <h3 className="text-xs font-mono text-gray-400 mb-4 uppercase tracking-wider">Preview</h3>
            <div className="markdown-body prose prose-invert max-w-none">
              <ReactMarkdown>{formData.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-dark-card p-6 rounded-xl border border-white/5 space-y-6">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Status</label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 text-neon-green focus:ring-neon-green bg-dark-bg"
                />
                <span className="text-white text-sm">Published</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-neon-green"
              >
                <option>Backend</option>
                <option>Frontend</option>
                <option>AI</option>
                <option>DevOps</option>
                <option>Systems Design</option>
              </select>
            </div>

            <Input
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, node, system-design"
            />

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full h-24 bg-dark-bg border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-neon-green resize-none"
                placeholder="Brief summary..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Cover Image</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-neon-green/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                {uploading ? (
                  <span className="text-neon-green text-sm animate-pulse">Uploading...</span>
                ) : formData.cover_image ? (
                  <img src={formData.cover_image} alt="Cover" className="max-h-32 mx-auto rounded" />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs">Click to upload</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
