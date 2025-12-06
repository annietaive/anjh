// Placeholder edge function - does nothing
// This exists to prevent deployment errors

Deno.serve(() => {
  return new Response('OK', {
    headers: { 'Content-Type': 'text/plain' },
  });
});
