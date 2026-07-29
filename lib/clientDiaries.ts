// Shared types and helpers for Client Diaries stored in Supabase.
import { supabaseBrowser } from './supabase-browser';

export interface ClientDiary {
  id: string;
  slug: string;
  outfit_name: string;
  client_name: string;
  city: string;
  occasion: string;
  description: string;
  testimonial: string | null;
  testimonial_author: string | null;
  images: string[];
  featured_on_homepage: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type ClientDiaryInput = Omit<
  ClientDiary,
  'id' | 'created_at' | 'updated_at'
>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function fetchAllDiaries(): Promise<ClientDiary[]> {
  const { data, error } = await supabaseBrowser
    .from('client_diaries')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch client diaries:', error.message);
    return [];
  }
  return (data as ClientDiary[]) ?? [];
}

export async function fetchFeaturedDiaries(): Promise<ClientDiary[]> {
  const { data, error } = await supabaseBrowser
    .from('client_diaries')
    .select('*')
    .eq('featured_on_homepage', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch featured diaries:', error.message);
    return [];
  }
  return (data as ClientDiary[]) ?? [];
}

export async function fetchDiaryBySlug(slug: string): Promise<ClientDiary | null> {
  const { data, error } = await supabaseBrowser
    .from('client_diaries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as ClientDiary;
}
