import { supabase } from '../supabase';

export async function uploadVideo(file: Blob, userId: string): Promise<string> {
  const filename = `${userId}/${Date.now()}.webm`;
  
  const { data, error } = await supabase.storage
    .from('interview-recordings')
    .upload(filename, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('interview-recordings')
    .getPublicUrl(filename);

  return publicUrl;
}

export async function deleteVideo(url: string): Promise<void> {
  const path = url.split('/').pop();
  if (!path) throw new Error('Invalid video URL');

  const { error } = await supabase.storage
    .from('interview-recordings')
    .remove([path]);

  if (error) throw error;
}