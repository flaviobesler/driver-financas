const { data: profile } = await supabase
  .from('profiles')
  .select('status, trial_ends_at')
  .single();

if (profile.status === 'cancelado') {
  // bloquear app
}

if (profile.status === 'aguardando') {
  // bloquear app
}