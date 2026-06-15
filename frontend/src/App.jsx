import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import SettingsList from './pages/SettingsList';
import CreateSetting from './pages/CreateSetting';
import EditSetting from './pages/EditSetting';
import Categories from './pages/Categories';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';
import UserPreferences from './pages/UserPreferences';
import Assistant from './pages/Assistant';
import MongoDataManager from './pages/MongoDataManager';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PreferencesProvider>
          <AuthProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<SettingsList />} />
                <Route path="settings/create" element={<CreateSetting />} />
                <Route path="settings/edit/:id" element={<EditSetting />} />
                <Route path="categories" element={<Categories />} />
                <Route path="assistant" element={<Assistant />} />
                <Route path="mongo-data" element={<MongoDataManager />} />
                <Route path="audit" element={<AuditLogs />} />
                <Route path="profile" element={<Profile />} />
                <Route path="preferences" element={<UserPreferences />} />
              </Route>
            </Routes>
          </AuthProvider>
        </PreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
