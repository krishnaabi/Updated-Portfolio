export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets
    return env.ASSETS.fetch(request);
  }
};
