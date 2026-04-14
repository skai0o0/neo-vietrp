"use client";

import {
  Users,
  MessageSquare,
  Flag,
  BarChart3,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import Card from "@/components/ui/Card";

const STATS = [
  { label: "Người dùng", value: "—", icon: Users, change: "+0" },
  { label: "Đoạn chat", value: "—", icon: MessageSquare, change: "+0" },
  { label: "Cards", value: "—", icon: BarChart3, change: "+0" },
  { label: "Báo cáo", value: "—", icon: Flag, change: "0" },
];

const ADMIN_TOOLS = [
  {
    icon: Users,
    label: "Quản lý người dùng",
    description: "Xem, chỉnh sửa, ban/unban người dùng",
  },
  {
    icon: ShieldCheck,
    label: "Kiểm duyệt nội dung",
    description: "Xem xét các nội dung bị báo cáo",
  },
  {
    icon: BarChart3,
    label: "Thống kê",
    description: "Xem thống kê chi tiết hoạt động website",
  },
  {
    icon: Flag,
    label: "Quản lý báo cáo",
    description: "Xử lý các báo cáo từ người dùng",
  },
  {
    icon: Activity,
    label: "System logs",
    description: "Theo dõi nhật ký hệ thống",
  },
];

export default function AdminHubPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 page-enter">
      <header>
        <h1 className="text-xl font-semibold mb-1">Admin Hub</h1>
        <p className="text-sm text-text-secondary">
          Bảng điều khiển quản trị VietRP.
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, change }) => (
          <Card key={label} className="relative vp-lift-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-muted mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <div className="p-2 rounded-lg bg-bg-elevated border border-border-default">
                <Icon size={16} strokeWidth={1.5} className="text-text-secondary" />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">{change} hôm nay</p>
          </Card>
        ))}
      </div>

      {/* Tools */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Công cụ quản trị</h2>
        <div className="space-y-2 stagger-in">
          {ADMIN_TOOLS.map(({ icon: Icon, label, description }) => (
            <Card key={label} hoverable>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-bg-elevated border border-border-default">
                  <Icon size={18} strokeWidth={1.5} className="text-text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{label}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{description}</p>
                </div>
                <ArrowUpRight size={14} strokeWidth={1.5} className="text-text-muted" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent activity skeleton */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
        <Card>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full skeleton shrink-0" />
                <div className="flex-1">
                  <div className={`h-3.5 skeleton ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
                  <div className="h-3 w-1/3 skeleton mt-1" />
                </div>
                <div className="h-3 w-16 skeleton" />
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
