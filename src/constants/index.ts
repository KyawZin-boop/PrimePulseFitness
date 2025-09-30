import {
  LayoutDashboard,
  MessageCircle,
  Users,
  Package,
  List,
} from "lucide-react";

export const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: List, label: "Categories", href: "/admin/categories" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: MessageCircle, label: "Chats", href: "/admin/chats", badge: 3 },
  { icon: Users, label: "Users", href: "/admin/users" },
];
