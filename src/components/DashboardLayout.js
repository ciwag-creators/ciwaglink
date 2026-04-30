import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/dashboard.css";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="content">
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}