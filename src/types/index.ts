export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  images: string[];
  capacity: number;
  price: number;
  organizer: string | { _id: string; name: string; email: string; avatar?: string };
  status: "draft" | "pending" | "published" | "cancelled";
  views: number;
  attendeesCount: number;
  createdAt: string;
}

export interface Registration {
  _id: string;
  event: string | Event;
  user: string | User;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type CreateEventInput = Omit<Event, "_id" | "organizer" | "status" | "views" | "createdAt">;

export type UpdateEventInput = Partial<CreateEventInput>;

export type RegisterUserInput = Pick<User, "name" | "email"> & { password: string };

export type LoginInput = Pick<User, "email"> & { password: string };
