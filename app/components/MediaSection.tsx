import { getHomepageGroups } from '@/lib/media';
import MediaShowcase from './MediaShowcase';

// Homepage press section. Content comes from data/media.json.
export default function MediaSection() {
  const groups = getHomepageGroups();
  if (groups.length === 0) return null;
  return <MediaShowcase groups={groups} />;
}
