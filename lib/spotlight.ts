// Celebrity Closet (spotlight) entries stored in Supabase.
import { supabaseBrowser } from './supabase-browser';

export interface SpotlightEntry {
  id: string;
  name: string;
  images: string[];
  product_link: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchSpotlight(): Promise<SpotlightEntry[]> {
  const { data, error } = await supabaseBrowser
    .from('spotlight')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch spotlight:', error.message);
    return [];
  }
  return (data as SpotlightEntry[]) ?? [];
}
