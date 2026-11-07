#!/usr/bin/env node

/**
 * Agentic World CLI Installer
 * Executado via: npx agentic-world [--global | --local]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Cores ANSI
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const gray = '\x1b[90m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

// Diretório base do pacote (onde o cli está instalado)
const packageRoot = path.resolve(__dirname, '..');
const sourceSkillsDir = path.join(packageRoot, '.agents', 'skills');
const sourceAgentsMd = path.join(packageRoot, 'AGENTS.md');

// Função auxiliar para copiar pastas recursivamente
function copyFolderSync(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });

  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Instalação Global
function installGlobal() {
  const homeDir = os.homedir();
  console.log(`\n${bold}${green}[*] Executando instalação global...${reset}\n`);

  let count = 0;

  // A. Gemini / Antigravity Plugin Global
  try {
    const geminiPluginDir = path.join(homeDir, '.gemini', 'config', 'plugins', 'agentic-world');
    fs.mkdirSync(geminiPluginDir, { recursive: true });

    // Copiar skills
    copyFolderSync(sourceSkillsDir, path.join(geminiPluginDir, 'skills'));

    // Copiar regras (AGENTS.md)
    const rulesDir = path.join(geminiPluginDir, 'rules');
    fs.mkdirSync(rulesDir, { recursive: true });
    if (fs.existsSync(sourceAgentsMd)) {
      fs.copyFileSync(sourceAgentsMd, path.join(rulesDir, 'AGENTS.md'));
    }

    // Criar plugin.json inline para o ecossistema de plugins
    const pluginManifest = {
      name: 'agentic-world',
      description: 'Esteira autônoma de engenharia de software Secure by Design com 9 skills: Orquestrador, PRD, ADR, DevSecOps STRIDE, Spec PlantUML, TDD, Auditoria e Code Review.',
      suggestedPrompts: [
        'Orquestrador, inicie uma nova funcionalidade em modo Ponto de Controle',
        'Orquestrador, execute a esteira completa em modo Fire and Forget',
        'Crie um PRD detalhado para um novo sistema'
      ]
    };
    fs.writeFileSync(path.join(geminiPluginDir, 'plugin.json'), JSON.stringify(pluginManifest, null, 2), 'utf8');

    console.log(`  ${green}✔${reset} Antigravity / Gemini: ${gray}${geminiPluginDir}${reset}`);
    count++;
  } catch (err) {
    console.log(`  ${yellow}⚠${reset} Gemini / Antigravity: ${gray}${err.message}${reset}`);
  }

  // B. Claude Code Global (~/.claude/skills)
  try {
    const claudeSkillsDir = path.join(homeDir, '.claude', 'skills', 'agentic-world');
    fs.mkdirSync(claudeSkillsDir, { recursive: true });
    copyFolderSync(sourceSkillsDir, claudeSkillsDir);
    console.log(`  ${green}✔${reset} Claude Code: ${gray}${claudeSkillsDir}${reset}`);
    count++;
  } catch (err) {
    console.log(`  ${yellow}⚠${reset} Claude Code: ${gray}${err.message}${reset}`);
  }

  // C. Universal Agent Skills (~/.agents/skills)
  try {
    const universalSkillsDir = path.join(homeDir, '.agents', 'skills');
    fs.mkdirSync(universalSkillsDir, { recursive: true });
    copyFolderSync(sourceSkillsDir, universalSkillsDir);
    console.log(`  ${green}✔${reset} Padrão Universal: ${gray}${universalSkillsDir}${reset}`);
    count++;
  } catch (err) {
    console.log(`  ${yellow}⚠${reset} Padrão Universal: ${gray}${err.message}${reset}`);
  }

  printSuccess('Global', count);
}

// 2. Instalação Local (no projeto atual)
function installLocal() {
  const cwd = process.cwd();
  console.log(`\n${bold}${green}[*] Instalando no projeto atual...${reset}\n`);

  try {
    const targetSkillsDir = path.join(cwd, '.agents', 'skills');
    copyFolderSync(sourceSkillsDir, targetSkillsDir);
    console.log(`  ${green}✔${reset} Skills: ${gray}${targetSkillsDir}${reset}`);

    const targetAgentsMd = path.join(cwd, 'AGENTS.md');
    if (!fs.existsSync(targetAgentsMd) && fs.existsSync(sourceAgentsMd)) {
      fs.copyFileSync(sourceAgentsMd, targetAgentsMd);
      console.log(`  ${green}✔${reset} Governança: ${gray}${targetAgentsMd}${reset}`);
    }

    printSuccess('Local', 1);
  } catch (err) {
    console.error(`\n${yellow}Erro ao instalar localmente:${reset} ${err.message}\n`);
    process.exit(1);
  }
}

function printSuccess(mode, count) {
  console.log(`\n${bold}${cyan}🎉 [Sucesso] As 9 skills do Agentic World foram instaladas (${mode})!${reset}`);
  console.log(`${gray}Agentes disponíveis:${reset}`);
  console.log(`  • ${bold}orchestrator-agent${reset}  • ${bold}prd-specialist${reset}  • ${bold}adr-architect${reset}`);
  console.log(`  • ${bold}security-agent${reset}      • ${bold}spec-agent${reset}      • ${bold}test-agent${reset}`);
  console.log(`  • ${bold}dev-agent${reset}           • ${bold}code-auditor${reset}    • ${bold}review-agent${reset}`);
  console.log(`\n${yellow}Basta abrir seu agente de IA e dizer:${reset} "${bold}Orquestrador, inicie uma nova funcionalidade${reset}"\n`);
}

// Header
console.log(`\n${bold}${cyan}🚀 Agentic World — Instalador de Skills de IA (npx agentic-world)${reset}`);
console.log(`${gray}Esteira industrial de desenvolvimento de software para agentes autônomos.${reset}`);

// Parsing de argumentos
const args = process.argv.slice(2);
if (args.includes('--global') || args.includes('-g')) {
  installGlobal();
} else if (args.includes('--local') || args.includes('-l')) {
  installLocal();
} else {
  // Menu Interativo
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n${bold}Onde você deseja instalar as 9 skills?${reset}`);
  console.log(`  ${bold}1)${reset} ${cyan}Globalmente${reset} (Disponível em qualquer projeto para Gemini, Claude e Cursor) ${bold}[Recomendado]${reset}`);
  console.log(`  ${bold}2)${reset} ${cyan}Apenas neste projeto local${reset} (Copia a pasta .agents/ para o diretório atual)`);
  console.log(`  ${bold}3)${reset} Cancelar\n`);

  rl.question(`${bold}Escolha uma opção [1-3] (padrão: 1): ${reset}`, (answer) => {
    rl.close();
    const opt = answer.trim();
    if (opt === '2') {
      installLocal();
    } else if (opt === '3') {
      console.log(`\n${gray}Operação cancelada.${reset}\n`);
    } else {
      installGlobal();
    }
  });
}
