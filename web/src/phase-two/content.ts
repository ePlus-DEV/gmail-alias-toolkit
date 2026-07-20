export type Locale = "vi" | "en";
export type TabId = "history" | "statistics" | "presets" | "accounts" | "context";
export type AccountId = "personal" | "work";

export interface AliasItem {
  id: string;
  alias: string;
  tag: string;
  source: string;
}

export interface DemoAccount {
  label: string;
  email: string;
  aliases: AliasItem[];
}

export const ACCOUNTS: Record<AccountId, DemoAccount> = {
  personal: {
    label: "Personal",
    email: "david@gmail.com",
    aliases: [
      {
        id: "p1",
        alias: "david+shopping@gmail.com",
        tag: "shopping",
        source: "Paddy",
      },
      {
        id: "p2",
        alias: "david+travel@gmail.com",
        tag: "travel",
        source: "Booking",
      },
      {
        id: "p3",
        alias: "david+newsletter@gmail.com",
        tag: "newsletter",
        source: "Hashnode",
      },
      {
        id: "p4",
        alias: "david+finance@gmail.com",
        tag: "finance",
        source: "PayPal",
      },
    ],
  },
  work: {
    label: "Work",
    email: "dev@eplus.dev",
    aliases: [
      {
        id: "w1",
        alias: "dev+github@eplus.dev",
        tag: "github",
        source: "GitHub",
      },
      {
        id: "w2",
        alias: "dev+cloud@eplus.dev",
        tag: "cloud",
        source: "Google Cloud",
      },
      {
        id: "w3",
        alias: "dev+testing@eplus.dev",
        tag: "testing",
        source: "Staging",
      },
    ],
  },
};

export const PRESETS = ["shopping", "work", "testing", "travel"] as const;

export const ACTIVITY: Record<AccountId, Array<{ day: string; value: number }>> = {
  personal: [
    { day: "mon", value: 1 },
    { day: "tue", value: 2 },
    { day: "wed", value: 1 },
    { day: "thu", value: 4 },
    { day: "fri", value: 3 },
    { day: "sat", value: 5 },
    { day: "sun", value: 4 },
  ],
  work: [
    { day: "mon", value: 0 },
    { day: "tue", value: 1 },
    { day: "wed", value: 3 },
    { day: "thu", value: 2 },
    { day: "fri", value: 4 },
    { day: "sat", value: 2 },
    { day: "sun", value: 3 },
  ],
};

export const URLS = {
  releases: "https://github.com/ePlus-DEV/gmail-alias-toolkit/releases/latest",
  install: "https://github.com/ePlus-DEV/gmail-alias-toolkit/blob/main/INSTALL.md",
} as const;

export const TEXT = {
  vi: {
    eyebrow: "Khám phá sản phẩm",
    title: "Không chỉ tạo alias — quản lý toàn bộ vòng đời.",
    desc: "Thử trực tiếp lịch sử, thống kê, preset, nhiều tài khoản và context menu ngay trên landing page.",
    tabs: {
      history: "Lịch sử",
      statistics: "Thống kê",
      presets: "Preset",
      accounts: "Tài khoản",
      context: "Context menu",
    },
    switchAccount: "Chuyển tài khoản",
    historyTitle: "Tìm và dùng lại alias trong vài giây",
    historyDesc: "Tìm theo alias, website hoặc tag; đánh dấu yêu thích và sao chép lại ngay.",
    search: "Tìm alias, tag hoặc website...",
    all: "Tất cả",
    favorites: "Yêu thích",
    empty: "Không tìm thấy alias phù hợp.",
    statsTitle: "Số liệu được tách riêng cho từng account",
    statsDesc: "Theo dõi tổng alias, tag phổ biến và hoạt động mà không gửi dữ liệu ra ngoài.",
    total: "Tổng alias",
    today: "Hôm nay",
    tags: "Số tag",
    topTag: "Tag phổ biến",
    activity: "Hoạt động 7 ngày",
    presetsTitle: "Tạo alias nhất quán bằng preset",
    presetsDesc: "Chọn preset có sẵn hoặc nhập tag riêng để xem trước địa chỉ.",
    customTag: "Tag tùy chỉnh",
    placeholder: "Ví dụ: project-alpha",
    preview: "Alias xem trước",
    useAlias: "Dùng alias này",
    used: "Đã chọn alias",
    accountsTitle: "Personal và Work không trộn dữ liệu",
    accountsDesc: "Mỗi account có history, favorite, statistics và preset riêng.",
    active: "Đang dùng",
    saved: "alias đã lưu",
    isolated: "Dữ liệu được cô lập theo account",
    contextTitle: "Tạo alias ngay tại ô email",
    contextDesc: "Chuột phải vào ô email để dùng gợi ý theo website mà không cần mở popup chính.",
    formTitle: "Đăng ký nhận bản tin",
    email: "Địa chỉ email",
    rightClick: "Nhấp chuột phải vào ô email",
    filled: "Đã điền alias",
    installEyebrow: "Cài đặt thủ công",
    installTitle: "Dùng ngay cả khi trình duyệt chưa có store chính thức.",
    installDesc: "Tải package từ GitHub Releases và giữ nguyên thư mục để cập nhật không mất settings.",
    chromium: "Chrome / Edge / Opera",
    firefox: "Firefox",
    chromiumSteps: [
      "Tải và giải nén package đúng với trình duyệt.",
      "Mở trang Extensions và bật Developer mode.",
      "Chọn Load unpacked rồi mở thư mục vừa giải nén.",
      "Khi cập nhật, thay file trong cùng thư mục và nhấn Reload.",
    ],
    firefoxSteps: [
      "Tải và giải nén package Firefox.",
      "Mở about:debugging#/runtime/this-firefox.",
      "Chọn Load Temporary Add-on và mở manifest.json.",
      "Để cài ổn định, ưu tiên bản trên Firefox Add-ons.",
    ],
    release: "Mở GitHub Releases",
    guide: "Xem hướng dẫn đầy đủ",
    warning: "Cài thủ công không tự động cập nhật.",
  },
  en: {
    eyebrow: "Product tour",
    title: "More than generation — manage the full alias lifecycle.",
    desc: "Try history, statistics, presets, multiple accounts and the context menu directly on the landing page.",
    tabs: {
      history: "History",
      statistics: "Statistics",
      presets: "Presets",
      accounts: "Accounts",
      context: "Context menu",
    },
    switchAccount: "Switch account",
    historyTitle: "Find and reuse an alias in seconds",
    historyDesc: "Search by alias, website or tag; favorite and copy it immediately.",
    search: "Search alias, tag or website...",
    all: "All",
    favorites: "Favorites",
    empty: "No matching aliases found.",
    statsTitle: "Statistics stay isolated per account",
    statsDesc: "Track totals, top tags and recent activity without sending data anywhere.",
    total: "Total aliases",
    today: "Created today",
    tags: "Unique tags",
    topTag: "Top tag",
    activity: "7-day activity",
    presetsTitle: "Create consistent aliases with presets",
    presetsDesc: "Choose a preset or type a custom tag and preview the result.",
    customTag: "Custom tag",
    placeholder: "Example: project-alpha",
    preview: "Alias preview",
    useAlias: "Use this alias",
    used: "Alias selected",
    accountsTitle: "Personal and Work never mix data",
    accountsDesc: "Each account owns separate history, favorites, statistics and presets.",
    active: "Active",
    saved: "saved aliases",
    isolated: "Account-isolated local data",
    contextTitle: "Generate directly beside an email field",
    contextDesc: "Right-click an email input to use website-aware suggestions without opening the popup.",
    formTitle: "Newsletter registration",
    email: "Email address",
    rightClick: "Right-click the email field",
    filled: "Alias filled",
    installEyebrow: "Manual installation",
    installTitle: "Use the toolkit before your browser has an official listing.",
    installDesc: "Download a GitHub Release package and keep the same folder to preserve settings during updates.",
    chromium: "Chrome / Edge / Opera",
    firefox: "Firefox",
    chromiumSteps: [
      "Download and extract the package for your browser.",
      "Open Extensions and enable Developer mode.",
      "Choose Load unpacked and select the extracted folder.",
      "For updates, replace files in the same folder and click Reload.",
    ],
    firefoxSteps: [
      "Download and extract the Firefox package.",
      "Open about:debugging#/runtime/this-firefox.",
      "Choose Load Temporary Add-on and select manifest.json.",
      "For a persistent install, use the Firefox Add-ons version.",
    ],
    release: "Open GitHub Releases",
    guide: "Read the full guide",
    warning: "Manual installations do not update automatically.",
  },
} as const;

export type TourText = (typeof TEXT)[Locale];
