import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './context/NotificationContext';

// Fast Loading Fallback Spinner for Lazy Loaded Routes
const PageLoadingFallback = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 font-[Manrope]">
    <div className="h-10 w-10 border-3 border-[#FF8F6B] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-black text-[#5E3821] dark:text-[#9DA3B4] uppercase tracking-wider animate-pulse">
      Loading Zephyra...
    </span>
  </div>
);

// Lazy-Loaded Page Components (Code Splitting for Fast Initial Loads)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Feed = lazy(() => import('./pages/Feed'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Profile = lazy(() => import('./pages/Profile'));
const Discover = lazy(() => import('./pages/Discover'));
const Search = lazy(() => import('./pages/Search'));
const Messages = lazy(() => import('./pages/Messages'));
const Settings = lazy(() => import('./pages/Settings'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Features = lazy(() => import('./pages/Features'));
const Changelog = lazy(() => import('./pages/Changelog'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Support = lazy(() => import('./pages/Support'));
const Guidelines = lazy(() => import('./pages/Guidelines'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Helper component that automatically scrolls window to the top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const hideFooter = location.pathname === '/messages';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F6EFE6] dark:bg-[#0E1116] text-[#1F1710] dark:text-[#EDEBE6] transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <main className="grow w-full max-w-full overflow-x-hidden">
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Info & Legal Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/support" element={<Support />} />
              <Route path="/help" element={<Support />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/contact" element={<Contact />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/explore" element={<Discover />} />
                <Route path="/search" element={<Search />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Admin Portal (Protected by dedicated Admin Login Gate) */}
              <Route path="/admin" element={<Admin />} />

              {/* 404 Catch-All Route for Irrelevant / Invalid Paths */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
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