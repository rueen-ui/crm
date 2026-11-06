export async function uploadAttachment(taskId, file) {
  const path = `${taskId}/${file.name}`;
  const { error } = await supabase.storage
    .from('task-attachments')
    .upload(path, file, {
      upsert: true,
    });
  if (error) throw error;
  return path;
}
