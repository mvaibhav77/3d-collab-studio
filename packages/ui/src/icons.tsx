/**
 * Centralized icon exports using Lucide React
 * Import icons from this file across the monorepo
 */

import {
  // Navigation & Actions
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  X,
  Check,

  // User & People
  User,
  Users,
  UserPlus,

  // Session & Collaboration
  Layers,
  Grid3x3,
  Share2,
  Link,
  Copy,

  // Time & Status
  Clock,
  Circle,
  AlertCircle,
  CheckCircle,
  XCircle,

  // Files & Documents
  File,
  FileText,
  Folder,

  // Interface
  Settings,
  Menu,
  MoreHorizontal,
  Eye,
  EyeOff,

  // Loading & Progress
  Loader2,

  // Arrows & Movement
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveDown,

  // 3D & Shapes
  Box,

  // Communication
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

// Re-export all icons with consistent naming
export {
  // Navigation & Actions
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  X,
  Check,

  // User & People
  User,
  Users,
  UserPlus,

  // Session & Collaboration
  Layers,
  Grid3x3,
  Share2,
  Link,
  Copy,

  // Time & Status
  Clock,
  Circle,
  AlertCircle,
  CheckCircle,
  XCircle,

  // Files & Documents
  File,
  FileText,
  Folder,

  // Interface
  Settings,
  Menu,
  MoreHorizontal,
  Eye,
  EyeOff,

  // Loading & Progress
  Loader2,

  // Arrows & Movement
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveDown,

  // 3D & Shapes
  Box,

  // Communication
  MessageSquare,

  // Types
  type LucideIcon,
};

// Common icon props type
export interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}
