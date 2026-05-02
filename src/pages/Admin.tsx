import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Settings, MessageSquare, Package, LogOut, BarChart3 } from "lucide-react";
import AdminBlogPosts from "@/components/admin/AdminBlogPosts";
import AdminServices from "@/components/admin/AdminServices";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminStats from "@/components/admin/AdminStats";
import beeLogo from "@/assets/bee-logo.png";

const tabs = [
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "blog", label: "Blog Posts", icon: FileText },
  { id: "services", label: "Services", icon: Settings },
  { id: "products", label: "Products", icon: Package },
  { id: "stats", label: "Stats", icon: BarChart3 },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabId>("messages");
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <a href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
            <img src={beeLogo} alt="NIB Solution logo" width={28} height={28} loading="lazy" className="h-7 w-7 object-contain" />
            NIB Solution
          </a>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground truncate mb-3">{user?.email}</p>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>

          {activeTab === "messages" && <AdminMessages />}
          {activeTab === "blog" && <AdminBlogPosts />}
          {activeTab === "services" && <AdminServices />}
          {activeTab === "products" && <AdminProducts />}
          {activeTab === "stats" && <AdminStats />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
