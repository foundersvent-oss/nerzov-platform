import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";

function AdminHome() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">
        Nerzov Admin
      </h1>

      <p className="mt-2">
        Admin authentication is working.
      </p>
    </div>
  );
}

function App() {
  const path = window.location.pathname;

  let content;

  if (path === "/admin/login") {
    content = <AdminLoginPage />;
  } else if (path === "/admin") {
    content = (
      <ProtectedRoute>
        <AdminHome />
      </ProtectedRoute>
    );
  } else {
    content = (
      <div className="p-8">
        <h1>Nerzov Platform</h1>
        <p>React app is live.</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      {content}
    </AuthProvider>
  );
}

export default App;
