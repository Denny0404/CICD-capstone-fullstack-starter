export function getVersionInfo() {
  return {
    app: 'backend',
    version: process.env.APP_VERSION || '0.1.0',
    commit: process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : null,
    time: new Date().toISOString()
  };
}
