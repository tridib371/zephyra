import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import PostDetail from './pages/PostDetail';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Support from './pages/Support';
import Guidelines from './pages/Guidelines';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { NotificationProvider } from './context/NotificationContext';

import ErrorBoundary from './components/ErrorBoundary';

function AppShell() {
  const location = useLocation();
  const hideFooter = location.pathname === '/messages';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0E1116] transition-colors duration-300">
      <Navbar />
      <main className="grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Info & Legal Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/support" element={<Support />} />
            <Route path="/help" element={<Support />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/explore" element={<Discover />} />
            <Route path="/discover" element={<Discover />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* Admin Portal (Protected by dedicated Admin Login Gate) */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppShell />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;