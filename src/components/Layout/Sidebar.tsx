
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/contexts/ConversationContext";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { LucideIcon, MessageSquare, KanbanSquare, CheckSquare, User, LogOut, BarChart3 } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

const SidebarNavItem = ({ icon: Icon, label, href, active, badge }: SidebarNavItemProps) => {
  return (
    <Link to={href} className="w-full">
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        {badge ? (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {badge}
          </span>
        ) : null}
      </div>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { conversations } = useConversations();
  
  const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  
  const navigation = [
    {
      icon: BarChart3,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: MessageSquare,
      label: "Conversas",
      href: "/conversations",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      icon: KanbanSquare,
      label: "Negociações",
      href: "/deals",
    },
    {
      icon: CheckSquare,
      label: "Tarefas",
      href: "/tasks",
    },
  ];
  
  // Add Users section for admin only
  if (user?.role === UserRole.ADMIN) {
    navigation.push({
      icon: User,
      label: "Usuários",
      href: "/users",
    });
  }
  
  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            N
          </div>
          <span className="text-xl font-semibold tracking-tight text-sidebar-foreground">
            Nexa CRM
          </span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-2">
        {navigation.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={location.pathname === item.href}
            badge={item.badge}
          />
        ))}
      </nav>
      
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            {user?.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {user?.role === UserRole.ADMIN ? "Administrador" : "Atendente"}
            </span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
