"use client";

import { Check, Zap, Crown, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import { GlassButton } from "@/components/ui/GlassEffect";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0đ",
    period: "mãi mãi",
    icon: Star,
    neon: "none" as const,
    features: [
      "10 tin nhắn / ngày",
      "Mô hình AI cơ bản",
      "Tạo 3 cards",
      "1 persona",
    ],
    cta: "Gói hiện tại",
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "99.000đ",
    period: "/ tháng",
    icon: Zap,
    neon: "blue" as const,
    features: [
      "Không giới hạn tin nhắn",
      "Tất cả mô hình AI",
      "Không giới hạn cards",
      "10 personas",
      "Ưu tiên phản hồi",
      "Tùy chỉnh nâng cao",
    ],
    cta: "Nâng cấp Pro",
    current: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "199.000đ",
    period: "/ tháng",
    icon: Crown,
    neon: "pink" as const,
    features: [
      "Tất cả tính năng Pro",
      "Mô hình AI cao cấp nhất",
      "Không giới hạn personas",
      "API access",
      "Hỗ trợ ưu tiên 24/7",
      "Badge đặc biệt",
      "Truy cập sớm tính năng mới",
    ],
    cta: "Nâng cấp Premium",
    current: false,
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 page-enter">
      <header className="text-center">
        <h1 className="text-xl font-semibold mb-1">Gói đăng ký</h1>
        <p className="text-sm text-text-secondary">
          Chọn gói phù hợp để nâng cao trải nghiệm roleplay.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-in">
        {PLANS.map(({ id, name, price, period, icon: Icon, neon, features, cta, current }) => (
          <Card
            key={id}
            neon={neon}
            className={`
              flex flex-col vp-lift-card
              ${neon === "blue" ? "ring-1 ring-accent-cyan/20" : ""}
            `}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-bg-elevated border border-border-default">
                <Icon size={18} strokeWidth={1.5} className="text-text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{name}</h3>
                {neon === "blue" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                    Phổ biến
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold">{price}</span>
              <span className="text-xs text-text-muted ml-1">{period}</span>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check size={14} strokeWidth={2} className="text-accent-cyan mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {current ? (
              <button
                disabled
                className="
                  w-full py-2.5 rounded-xl text-sm font-medium
                  border border-border-default text-text-muted
                  cursor-default
                "
              >
                {cta}
              </button>
            ) : (
              <GlassButton className="w-full">{cta}</GlassButton>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
