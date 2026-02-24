import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout.tsx';
import AdminLayout from './layouts/AdminLayout.tsx';
import Home from './pages/Home.tsx';
import PostView from './pages/PostView.tsx';
import CategoryView from './pages/CategoryView.tsx';
import About from './pages/About.tsx';
import GatituAIDashboard from './components/GatituAIDashboard.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminEditor from './pages/AdminEditor.tsx';
import AdminSettings from './pages/AdminSettings.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="post/:slug" element={<PostView />} />
            <Route path="category/:category" element={<CategoryView />} />
            <Route path="about" element={<About />} />
            <Route path="ai" element={<GatituAIDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="posts" element={<AdminDashboard />} />
            <Route path="posts/new" element={<AdminEditor />} />
            <Route path="posts/:id" element={<AdminEditor />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
