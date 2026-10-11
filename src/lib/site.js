// Edit this file to change the text, contact details and services across the whole site.

export const site = {
  name: "Putin Edit",
  tagline: "Your Vision, My Creativity",
  motto: "Capture | Edit | Design",
  phone: "+233 5540 86240",
  whatsapp: "233554086240", // digits only, with country code
  instagram: "putin_edit",
  facebookName: "Putin Edit",
  facebookUrl: "", // paste your Facebook page link here to make it clickable
  location: "Ghana (Nationwide & Beyond)",
};

export const waLink = (text) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Categories you can choose when uploading work in the admin panel.
export const categories = [
  "Flyers & Posters",
  "Logos & Branding",
  "Social Media",
  "Photo Editing",
  "Photography",
  "AI Advertising",
  "Video Editing",
  "Other",
];

export const services = [
  {
    icon: "auto_fix_high",
    title: "Picture editing",
    blurb: "Clean, natural edits that make your photos look like they belong on a magazine page.",
    items: ["Retouching", "Color grading", "Background change"],
  },
  {
    icon: "brush",
    title: "Graphic design",
    blurb: "Flyers, posters and logos that make people stop scrolling and remember your name.",
    items: ["Flyers", "Posters", "Logos", "Banners", "Social media posts"],
  },
  {
    icon: "smart_toy",
    title: "AI advertising",
    blurb: "Fresh ad concepts built with AI, finished by hand so they look polished and on brand.",
    items: ["Creative ads", "AI images", "Video edits"],
  },
  {
    icon: "photo_camera",
    title: "Photography",
    blurb: "Photos that tell the story of your event, your product or your day.",
    items: ["Events", "Portraits", "Products", "Lifestyle"],
  },
  {
    icon: "movie",
    title: "Video editing",
    blurb: "Short, punchy videos cut for Instagram, TikTok and WhatsApp status.",
    items: ["Short clips", "Reels", "Promo videos"],
  },
];

export const perks = [
  { icon: "bolt", title: "Fast delivery", text: "Quick turnaround so your post or event never waits on a design." },
  { icon: "workspace_premium", title: "High quality", text: "Sharp, print-ready files and clean exports for every platform." },
  { icon: "payments", title: "Affordable prices", text: "Fair prices for students, small businesses and big events alike." },
  { icon: "favorite", title: "Your satisfaction matters", text: "I keep refining until you love the result." },
];

export const steps = [
  { title: "Tell me what you need", text: "Send your idea, photos and any references on WhatsApp." },
  { title: "Get a price and timeline", text: "You'll know the cost and the delivery date before work starts." },
  { title: "Review the draft", text: "Ask for changes until it feels exactly right." },
  { title: "Receive your files", text: "Final files arrive ready to post, print or share." },
];

export const about = [
  "Putin Edit is a one-person creative studio in Ghana. I edit photos, design for print and social media, shoot portraits and events, and cut short videos and ads.",
  "Every project starts with your idea. I shape the look, you keep the vibe you had in mind, and I keep working until you're happy with the result.",
];

export const pillars = [
  { title: "Capture", text: "Events, portraits, products and lifestyle shots with a clear eye for light and mood." },
  { title: "Edit", text: "Retouching, color grading and background changes that stay natural." },
  { title: "Design", text: "Flyers, posters, logos and social posts with a strong, consistent look." },
];
