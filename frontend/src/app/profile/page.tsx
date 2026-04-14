"use client";

import { useState } from "react";
import {
  Camera,
  AtSign,
  Type,
  FileText,
  UserCircle,
  Heart,
  Compass,
  Plus,
  Trash2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { GlassButton } from "@/components/ui/GlassEffect";

type Tab = "profile" | "persona";

const PROFILE_FIELDS = [
  {
    icon: AtSign,
    label: "Username",
    placeholder: "username",
    hint: "Dùng cho hệ thống, không thể thay đổi sau khi tạo",
  },
  {
    icon: Type,
    label: "Tên hiển thị",
    placeholder: "Tên hiển thị của bạn",
    hint: "Hiển thị trên bảng xếp hạng và hồ sơ công khai",
  },
  {
    icon: FileText,
    label: "Mô tả",
    placeholder: "Giới thiệu về bản thân...",
    hint: "Tối đa 200 ký tự",
    multiline: true,
  },
];

const PERSONA_FIELDS = [
  {
    icon: Type,
    label: "Tên",
    placeholder: "Tên AI gọi khi chat",
    hint: "AI sẽ xưng hô với bạn bằng tên này",
  },
  {
    icon: UserCircle,
    label: "Giới tính",
    placeholder: "Nam / Nữ / Khác",
    hint: "Giới tính của nhân cách",
  },
  {
    icon: Heart,
    label: "Xu hướng tính dục",
    placeholder: "Ví dụ: Dị tính, Đồng tính...",
    hint: "Xu hướng tính dục của nhân cách",
  },
  {
    icon: Compass,
    label: "Mô tả",
    placeholder: "Mô tả chi tiết nhân cách của bạn...",
    hint: "AI sẽ sử dụng thông tin này để tương tác phù hợp",
    multiline: true,
  },
];

const DUMMY_PERSONAS = [
  { name: "Minh", desc: "Chàng trai 20 tuổi, hướng nội, thích đọc sách" },
  { name: "Linh", desc: "Cô gái mạnh mẽ, quyết đoán" },
];

function InputField({
  icon: Icon,
  label,
  placeholder,
  hint,
  multiline,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  placeholder: string;
  hint: string;
  multiline?: boolean;
}) {
  const inputClass = `
    w-full px-4 py-2.5 rounded-xl text-sm
    bg-input-bg border border-input-border text-text-primary
    placeholder:text-text-muted
    focus:outline-none focus:border-input-focus
    focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
    transition-all duration-300
  `;

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-2 text-text-primary">
        <Icon size={14} strokeWidth={1.5} className="text-text-secondary" />
        {label}
      </label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input type="text" placeholder={placeholder} className={inputClass} />
      )}
      <p className="text-xs text-text-muted mt-1.5">{hint}</p>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6 page-enter">
      {/* Avatar */}
      <Card neon="combined" className="flex flex-col items-center py-8">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full skeleton" />
          <div
            className="
              absolute inset-0 flex items-center justify-center
              rounded-full bg-black/60
              opacity-0 group-hover:opacity-100
              scale-90 group-hover:scale-100
              transition-all duration-300
            "
          >
            <Camera size={20} strokeWidth={1.5} className="text-white" />
          </div>
        </div>
        <div className="h-5 w-32 skeleton mt-4" />
        <div className="h-3 w-20 skeleton mt-1.5" />
      </Card>

      <div className="space-y-5 stagger-in">
        {PROFILE_FIELDS.map((field) => (
          <InputField key={field.label} {...field} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <GlassButton className="flex-1">Lưu thay đổi</GlassButton>
        <GlassButton variant="ghost">Hủy</GlassButton>
      </div>
    </div>
  );
}

function PersonaTab() {
  return (
    <div className="space-y-6 page-enter">
      {/* Persona list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-secondary">Danh sách nhân cách</h3>
          <button
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-border-default text-text-secondary
              hover:border-border-accent hover:text-accent-cyan
              transition-all duration-200 active:scale-95
            "
          >
            <Plus size={13} strokeWidth={1.5} />
            Thêm mới
          </button>
        </div>

        {DUMMY_PERSONAS.map((p, i) => (
          <Card
            key={p.name}
            hoverable
            neon={i === 0 ? "blue" : "none"}
            className={i === 0 ? "ring-1 ring-accent-cyan/20" : ""}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full skeleton shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{p.name}</span>
                  {i === 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                      Đang dùng
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted truncate mt-0.5">{p.desc}</p>
              </div>
              <button
                className="
                  p-1.5 rounded-lg text-text-muted
                  hover:text-red-400 hover:bg-red-400/10
                  transition-all duration-200 active:scale-90
                "
                aria-label="Xóa persona"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit active persona */}
      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-3">Chỉnh sửa nhân cách</h3>
        <div className="space-y-5 stagger-in">
          {PERSONA_FIELDS.map((field) => (
            <InputField key={field.label} {...field} />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <GlassButton className="flex-1">Lưu nhân cách</GlassButton>
        <GlassButton variant="ghost">Hủy</GlassButton>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 page-enter">
      <header>
        <h1 className="text-xl font-semibold mb-1">Hồ sơ & Nhân cách</h1>
        <p className="text-sm text-text-secondary">
          Quản lý thông tin cá nhân và nhân cách roleplay.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border-default bg-bg-surface p-1">
        {([
          { id: "profile" as const, label: "Hồ sơ", icon: UserCircle },
          { id: "persona" as const, label: "Nhân cách", icon: Heart },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-300 ease-out
              ${
                tab === id
                  ? "bg-bg-elevated text-text-primary border border-border-accent shadow-[0_0_8px_rgba(0,255,240,0.06)]"
                  : "text-text-muted hover:text-text-secondary border border-transparent"
              }
            `}
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" ? <ProfileTab /> : <PersonaTab />}
    </div>
  );
}
