"use client";

import { ArrowLeft, Upload, MapPin, Users, Scroll, Clock } from "lucide-react";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassEffect";

const WORLD_FIELDS = [
  { icon: null, label: "Tên thế giới", placeholder: "Ví dụ: Đại Lục Huyền Thiên..." },
  { icon: null, label: "Mô tả tổng quan", placeholder: "Mô tả tổng quan về thế giới...", multiline: true, rows: 3 },
  { icon: MapPin, label: "Địa lý & Bối cảnh", placeholder: "Mô tả địa hình, vương quốc, thành phố...", multiline: true, rows: 4 },
  { icon: Users, label: "Chủng tộc & Phe phái", placeholder: "Các chủng tộc, phe phái, tổ chức...", multiline: true, rows: 3 },
  { icon: Scroll, label: "Hệ thống ma thuật / sức mạnh", placeholder: "Các hệ thống năng lực, quy luật...", multiline: true, rows: 3 },
  { icon: Clock, label: "Lịch sử & Sự kiện", placeholder: "Các sự kiện lịch sử quan trọng...", multiline: true, rows: 3 },
  { icon: null, label: "Quy tắc thế giới", placeholder: "Các quy tắc đặc biệt mà AI cần tuân theo...", multiline: true, rows: 3 },
  { icon: null, label: "Tags", placeholder: "fantasy, sci-fi, medieval..." },
];

const inputClass = `
  w-full px-4 py-2.5 rounded-xl text-sm vp-input-motion
  bg-input-bg border border-input-border text-text-primary
  placeholder:text-text-muted
  focus:outline-none focus:border-input-focus
  focus:shadow-[0_0_8px_rgba(0,255,240,0.08)]
`;

export default function CreateWorldPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 page-enter">
      <header className="flex items-center gap-3">
        <Link
          href="/create"
          className="
            p-1.5 rounded-lg text-text-secondary
            hover:text-text-primary hover:bg-bg-surface
            transition-all duration-200 active:scale-90
          "
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Tạo World</h1>
          <p className="text-xs text-text-muted">Thiết kế bối cảnh thế giới</p>
        </div>
      </header>

      {/* Cover image */}
      <div
        className="
          w-full h-36 rounded-xl border-2 border-dashed border-border-default
          flex flex-col items-center justify-center cursor-pointer vp-upload-zone
          group
        "
      >
        <Upload
          size={24}
          strokeWidth={1.5}
          className="text-text-muted group-hover:text-accent-cyan transition-colors mb-2"
        />
        <span className="text-xs text-text-muted">Ảnh bìa thế giới (tùy chọn)</span>
      </div>

      {/* Fields */}
      <div className="space-y-4 stagger-in">
        {WORLD_FIELDS.map(({ icon: Icon, label, placeholder, multiline, rows }) => (
          <div key={label}>
            <label className="text-sm font-medium mb-2 flex items-center gap-2 text-text-primary">
              {Icon && <Icon size={14} strokeWidth={1.5} className="text-text-secondary" />}
              {label}
            </label>
            {multiline ? (
              <textarea
                placeholder={placeholder}
                rows={rows || 3}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input type="text" placeholder={placeholder} className={inputClass} />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <GlassButton className="flex-1">Tạo World</GlassButton>
        <GlassButton variant="ghost">Hủy</GlassButton>
      </div>
    </div>
  );
}
