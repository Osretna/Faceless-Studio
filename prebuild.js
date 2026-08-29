import fs from 'node:fs';
import path from 'node:path';

export function repairStructure(baseDir = process.cwd()) {
  const root = path.resolve(baseDir);
  const srcDir = path.resolve(root, 'src');
  const compDir = path.resolve(srcDir, 'components');
  const genDir = path.resolve(compDir, 'generator');
  const apiDir = path.resolve(root, 'api');

  // 1. If src/main.tsx is missing but main.tsx exists in root (flat repo upload)
  if (!fs.existsSync(path.resolve(srcDir, 'main.tsx')) && fs.existsSync(path.resolve(root, 'main.tsx'))) {
    console.log('[repairStructure] Flat structure detected from GitHub upload. Restoring directory structure...');
    fs.mkdirSync(genDir, { recursive: true });
    fs.mkdirSync(apiDir, { recursive: true });

    const rootFiles = ['App.tsx', 'main.tsx', 'index.css', 'types.ts', 'mockData.ts', 'translations.ts'];
    const compFiles = [
      'Navbar.tsx', 'Sidebar.tsx', 'Topbar.tsx', 'AuthModal.tsx',
      'OnboardingModal.tsx', 'LandingPage.tsx', 'DashboardView.tsx',
      'CalendarView.tsx', 'AutoPublisherView.tsx', 'PricingView.tsx',
      'SettingsView.tsx', 'HelpCenterView.tsx'
    ];
    const genFiles = ['BrainstormView.tsx', 'ScriptWriterView.tsx', 'VideoCreatorView.tsx', 'CaptionsView.tsx'];

    for (const f of rootFiles) {
      const srcFile = path.resolve(root, f);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.resolve(srcDir, f));
      }
    }

    for (const f of compFiles) {
      const srcFile = path.resolve(root, f);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.resolve(compDir, f));
      }
    }

    for (const f of genFiles) {
      const srcFile = path.resolve(root, f);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.resolve(genDir, f));
      }
    }

    // api/index.ts (if index.ts was uploaded to root)
    const rootIndexTs = path.resolve(root, 'index.ts');
    const apiIndexTs = path.resolve(apiDir, 'index.ts');
    if (fs.existsSync(rootIndexTs) && !fs.existsSync(apiIndexTs)) {
      fs.copyFileSync(rootIndexTs, apiIndexTs);
    }

    console.log('[repairStructure] Directory structure successfully reconstructed.');
  }

  // 2. Ensure main.tsx exists in root that safely re-exports/imports src/main.tsx
  try {
    fs.writeFileSync(path.resolve(root, 'main.tsx'), `import './src/main.tsx';\n`);
  } catch (_) {}

  // 3. Remove bun.lock if present to prevent any package manager conflicts
  const bunLock = path.resolve(root, 'bun.lock');
  if (fs.existsSync(bunLock)) {
    try {
      fs.unlinkSync(bunLock);
      console.log('[repairStructure] Removed legacy bun.lock');
    } catch (_) {}
  }
}

// Run immediately if executed directly
if (process.argv[1] && process.argv[1].endsWith('prebuild.js')) {
  repairStructure();
}
