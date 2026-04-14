import type { CharacterBase, Franchise } from "@/lib/mockCharaData";

export type CreateMode = "zero-text" | "manual" | "ai" | "lorebook" | "world";

export type ZeroTextStepId = "franchise" | "personality" | "scenario" | "final";

export interface StepFieldSpec {
  key: string;
  label: string;
  type: "select" | "slider" | "text" | "textarea" | "chips" | "slot-machine";
  required?: boolean;
  aiHint?: string;
}

export interface ZeroTextStepSpec {
  id: ZeroTextStepId;
  title: string;
  purpose: string;
  fields: StepFieldSpec[];
  output: string[];
  validation: string[];
}

export interface CreateAICharacterPayload {
  mode: "zero-text" | "manual" | "ai";
  franchise: {
    id: string | null;
    name: string | null;
  };
  character: {
    id: string | null;
    name: string;
    isOriginalCharacter: boolean;
  };
  personality: {
    traits: Record<string, number>;
    appearance: Record<string, number>;
    nickname: string;
    loreOverride: string;
  };
  scenario: {
    slotResults: string[];
    customScenario: string;
    source: "slot-machine" | "custom" | "mixed" | "none";
  };
  finalPolish: {
    pronoun: string;
    behaviours: string[];
    creatorNote: string;
  };
  generatedFrom: {
    customReelsApplied: boolean;
    selectedCharacterHasCustomSlots: boolean;
  };
}

export interface CreateFlowSpec {
  productName: string;
  primaryModes: Array<{
    id: CreateMode;
    label: string;
    route?: string;
    description: string;
  }>;
  zeroTextFlow: {
    totalSteps: number;
    stepOrder: ZeroTextStepId[];
    steps: ZeroTextStepSpec[];
    rules: string[];
    aiFeedPayload: string[];
  };
  worldFlow: {
    route: string;
    fields: string[];
  };
  lorebookFlow: {
    route: string;
    fields: string[];
  };
}

export const CREATE_FLOW_SPEC: CreateFlowSpec = {
  productName: "VietRP Create",
  primaryModes: [
    {
      id: "zero-text",
      label: "Tạo Card (Zero-Text)",
      description: "Luồng wizard 4 bước để dựng card nhân vật từ chọn franchise đến chốt prompt.",
    },
    {
      id: "manual",
      label: "Tạo Card (Thủ công)",
      description: "Cho phép tự nhập toàn bộ trường dữ liệu theo từng field riêng.",
    },
    {
      id: "ai",
      label: "Tạo Card (AI)",
      description: "Sinh card từ mô tả ngắn, ưu tiên prompt-driven generation.",
    },
    {
      id: "lorebook",
      label: "Tạo Lorebook",
      route: "/create/lorebooks",
      description: "Tạo tập tri thức gắn keyword, nội dung, order và priority.",
    },
    {
      id: "world",
      label: "Tạo Thế Giới",
      route: "/create/worlds",
      description: "Thiết kế bối cảnh thế giới với địa lý, phe phái, magic system và rules.",
    },
  ],
  zeroTextFlow: {
    totalSteps: 4,
    stepOrder: ["franchise", "personality", "scenario", "final"],
    steps: [
      {
        id: "franchise",
        title: "Chọn thế giới và nhân vật",
        purpose: "Xác định franchise, nhân vật gốc hoặc OC, rồi đổ dữ liệu base vào state.",
        fields: [
          {
            key: "selectedFranchiseId",
            label: "Franchise",
            type: "select",
            required: true,
            aiHint: "Xác định bối cảnh IP/parody mà nhân vật thuộc về.",
          },
          {
            key: "selectedCharId",
            label: "Nhân vật",
            type: "select",
            required: false,
            aiHint: "Nếu chọn OC thì character=null và franchise vẫn được giữ.",
          },
        ],
        output: ["selectedFranchise", "selectedChar", "ocSelected", "baseTraits", "baseAppearance"],
        validation: ["Chọn franchise trước khi sang bước tiếp theo", "OC phải qua card riêng __OC__"],
      },
      {
        id: "personality",
        title: "Tinh chỉnh personality và ngoại hình",
        purpose: "Cho phép chỉnh trait/appearance quanh base data hoặc đặt tên OC mới.",
        fields: [
          { key: "nickname", label: "Nickname / Tên", type: "text", aiHint: "Tên hiển thị cuối cùng của card." },
          { key: "traits", label: "Tính cách", type: "slider", aiHint: "6 trục trait: kindness, aggression, intelligence, humor, mystery, romance." },
          { key: "appearance", label: "Ngoại hình", type: "slider", aiHint: "4 trục appearance: height, build, charm, age." },
          { key: "loreOverride", label: "Backstory bổ sung", type: "textarea", aiHint: "Override hoặc mở rộng lore gốc nếu người dùng nhập." },
        ],
        output: ["traits", "appearance", "nickname", "loreOverride"],
        validation: ["OC bắt buộc phải có nickname", "Non-OC có thể giữ mặc định từ franchise"],
      },
      {
        id: "scenario",
        title: "Tạo bối cảnh bằng slot machine hoặc text tự chọn",
        purpose: "Sinh một cảnh nền để AI hiểu quan hệ, địa điểm và trạng thái hiện tại của nhân vật.",
        fields: [
          { key: "slotResults", label: "Slot results", type: "slot-machine", aiHint: "Kết quả quay gồm địa điểm, trạng thái, quan hệ." },
          { key: "customScenario", label: "Custom scenario", type: "textarea", aiHint: "Nếu người dùng tự nhập, ưu tiên nội dung này." },
        ],
        output: ["slotResults", "customScenario"],
        validation: ["Có thể đi tiếp khi đã quay slot hoặc đã nhập custom scenario"],
      },
      {
        id: "final",
        title: "Hoàn thiện prompt cho AI",
        purpose: "Chốt xưng hô, phong cách phản hồi và ghi chú creator để dùng cho generation.",
        fields: [
          { key: "pronoun", label: "Cách xưng hô", type: "select", aiHint: "Mẫu xưng hô giữa character và user." },
          { key: "behaviours", label: "Định hướng AI", type: "chips", aiHint: "Các directive bổ sung cho style/behavior." },
          { key: "creatorNote", label: "Creator note", type: "textarea", aiHint: "Ghi chú cuối cùng dành cho người dùng card." },
        ],
        output: ["pronoun", "behaviours", "creatorNote"],
        validation: ["Không cần chọn xưng hô để render UI, nhưng cần trước khi feed AI"],
      },
    ],
    rules: [
      "Nếu user chọn character thật, trait và appearance được khởi tạo từ base data của character đó.",
      "Nếu chọn OC, char=null nhưng franchise vẫn giữ để AI hiểu thế giới gốc.",
      "Khi selectedChar có customSlots, slot machine phải merge custom options vào DEFAULT_SLOT_REELS.",
      "Kết quả scenario ưu tiên customScenario nếu có; nếu không thì dùng slotResults.join(' · ').",
      "Nút Next ở step 2 chỉ mở khi đã quay slot hoặc nhập custom scenario.",
      "Nút Next ở step 1 với OC bị khóa nếu nickname còn trống.",
      "Bước cuối chỉ đóng vai trò polish, không thay đổi core world/character state.",
    ],
    aiFeedPayload: [
      "franchise.id + franchise.name",
      "character.id + character.name + isOriginalCharacter",
      "traits + appearance + nickname + loreOverride",
      "slotResults + customScenario + scenario source",
      "pronoun + behaviours + creatorNote",
      "metadata về customReelsApplied và selectedCharacterHasCustomSlots",
    ],
  },
  worldFlow: {
    route: "/create/worlds",
    fields: [
      "Tên thế giới",
      "Mô tả tổng quan",
      "Địa lý & bối cảnh",
      "Chủng tộc & phe phái",
      "Hệ thống ma thuật / sức mạnh",
      "Lịch sử & sự kiện",
      "Quy tắc thế giới",
      "Tags",
      "Ảnh bìa thế giới (tùy chọn)",
    ],
  },
  lorebookFlow: {
    route: "/create/lorebooks",
    fields: [
      "Tên lorebook",
      "Mô tả",
      "Entries[]: keywords, content, insertion order, priority",
    ],
  },
};

export function buildCreateAIPayload(params: {
  selectedFranchise: Franchise | null;
  selectedChar: CharacterBase | null;
  isOC: boolean;
  traits: Record<string, number>;
  appearance: Record<string, number>;
  nickname: string;
  loreOverride: string;
  slotResults: string[];
  customScenario: string;
  pronoun: string;
  behaviours: string[];
  creatorNote: string;
  customReelsApplied: boolean;
}): CreateAICharacterPayload {
  const scenarioSource = params.customScenario.trim()
    ? (params.slotResults.length > 0 ? "mixed" : "custom")
    : (params.slotResults.length > 0 ? "slot-machine" : "none");

  return {
    mode: "zero-text",
    franchise: {
      id: params.selectedFranchise?.id ?? null,
      name: params.selectedFranchise?.parodyName ?? null,
    },
    character: {
      id: params.selectedChar?.id ?? null,
      name: params.nickname.trim() || params.selectedChar?.parodyName || "OC mới",
      isOriginalCharacter: params.isOC,
    },
    personality: {
      traits: params.traits,
      appearance: params.appearance,
      nickname: params.nickname,
      loreOverride: params.loreOverride,
    },
    scenario: {
      slotResults: params.slotResults,
      customScenario: params.customScenario,
      source: scenarioSource,
    },
    finalPolish: {
      pronoun: params.pronoun,
      behaviours: params.behaviours,
      creatorNote: params.creatorNote,
    },
    generatedFrom: {
      customReelsApplied: params.customReelsApplied,
      selectedCharacterHasCustomSlots: params.customReelsApplied,
    },
  };
}
