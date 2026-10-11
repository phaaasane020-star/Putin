import {
  Sparkles, Brush, Bot, Camera, Film, Zap, Award, Banknote, Heart, ArrowLeft, ArrowRight, ArrowUpRight,
  Pause, Play, X, Menu, MessageCircle, ThumbsUp, MapPin, Upload, Trash2, Star, Lock, Activity,
  Image as ImageIcon, ExternalLink, LogOut,
} from "lucide-react";

// Icons are bundled with the site, so no external icon font has to download.
const icons = {
  auto_fix_high: Sparkles, auto_awesome: Sparkles, brush: Brush, smart_toy: Bot, photo_camera: Camera,
  movie: Film, bolt: Zap, workspace_premium: Award, payments: Banknote, favorite: Heart,
  arrow_back: ArrowLeft, arrow_forward: ArrowRight, north_east: ArrowUpRight, pause: Pause, play_arrow: Play,
  close: X, menu: Menu, chat: MessageCircle, thumb_up: ThumbsUp, location_on: MapPin, cloud_upload: Upload,
  delete: Trash2, star: Star, lock: Lock, monitoring: Activity, photo_library: ImageIcon,
  open_in_new: ExternalLink, logout: LogOut,
};

export default function Icon({ name, size = 24, className = "", fill = false }) {
  const Cmp = icons[name] || Sparkles;
  return <Cmp size={size} strokeWidth={1.75} className={`shrink-0 ${className}`} fill={fill ? "currentColor" : "none"} aria-hidden="true" />;
}
