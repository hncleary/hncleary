import * as fs from 'fs';
import * as path from 'path';

export class ProjectLink {
  public displayName: string = '';
  public link: string = '';
  public icon: string = '';
}

export class ProjectDetails {
  public image: string = '';
  public displayName: string = '';
  public description: string = '';
  public links: ProjectLink[] = [];
}

export const DEFINED_PROJECTS: ProjectDetails[] = [
  {
    displayName: 'Cavern Collapse',
    image: 'grayson-grappler.png',
    description: 'High score arcade survival game in a collapsing cavern',
    links: [
      {
        displayName: 'itch.io',
        link: 'https://cyranek.itch.io/cavern-collapse',
        icon: 'itchio.png',
      },
      {
        displayName: 'Newgrounds',
        link: 'https://www.newgrounds.com/portal/view/860822',
        icon: 'newgrounds.png',
      },
      {
        displayName: 'iOS',
        link: 'https://apps.apple.com/us/app/cavern-collapse/id6451268649',
        icon: 'apple.png',
      },
      {
        displayName: 'Android',
        link: 'https://play.google.com/store/apps/details?id=cyranek.com.cyranek.caverncollapse&hl=en_US&gl=US',
        icon: 'android.svg',
      },
    ],
  },
  {
    displayName: 'Ski Freak',
    image: 'ski-freak.png',
    description: 'Coming Soon',
    links: [],
  },
  {
    displayName: 'ch8t-GPT',
    image: 'ch8t_gpt_logo.png',
    description: "The world's most powerful LLM AI chat bot powered by divination",
    links: [
      {
        displayName: 'Site',
        link: 'https://ch8tgpt.com/',
        icon: 'globe.png',
      },
      {
        displayName: 'Source',
        link: 'https://github.com/hncleary/eight-ball-gpt',
        icon: 'github.png',
      },
    ],
  },
  {
    displayName: 'Vanity Plate Social',
    image: 'vps-logo.png',
    description: 'Consolidated retrieval and display of social media stats',
    links: [
      {
        displayName: 'Site Source',
        link: 'https://github.com/hncleary/vanity-plate-ng',
        icon: 'github.png',
      },
      {
        displayName: 'Retrieval',
        link: 'https://github.com/hncleary/vanity-plate-pr',
        icon: 'github.png',
      },
      {
        displayName: 'Website',
        link: 'https://www.vanityplate.social/home',
        icon: 'globe.png',
      },
    ],
  },
  {
    displayName: 'Duuzu Key BPM DB',
    image: 'duuzu_db_logo.png',
    description: 'Searchable song key and bpm database website for DJs',
    links: [
      {
        displayName: 'Website',
        link: 'https://black-water-0be05fd10.5.azurestaticapps.net/home',
        icon: 'globe.png',
      },
      {
        displayName: 'Source',
        link: 'https://github.com/hncleary/duuzu-key-bpm-db',
        icon: 'github.png',
      },
    ],
  },
];

const TABLE_TITLE = 'Public Projects';
const TABLE_DESC = 'Personal mini-projects currently published online';
const MAX_LINKS_PER_CELL = 4;
const NON_LINK_COLSPAN = 5;

// Size constants for compact table
const PROJECT_IMAGE_SIZE = '35px'; // Reduced from 50px
const ICON_SIZE = '16px'; // Reduced from 20px
const COMPACT_STYLE = 'style="padding: 4px 8px; font-size: 0.9em; line-height: 1.3;"';
const COMPACT_IMAGE_STYLE = `style="width:${PROJECT_IMAGE_SIZE}; height: auto; max-height: ${PROJECT_IMAGE_SIZE}; object-fit: contain;"`;
const COMPACT_ICON_STYLE = `style="width:${ICON_SIZE}; height: auto; max-height: ${ICON_SIZE}; vertical-align: middle; margin-right: 4px;"`;
const COMPACT_DESC_STYLE = 'style="font-size: 0.85em; color: #666; margin-top: 2px;"';
const COMPACT_TITLE_STYLE = 'style="font-size: 0.95em; margin: 0;"';
const LINKS_GRID_STYLE =
  'style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 8px; align-items: center;"';

const BASE_PROJECT_STR =
  '### Howdy 👋 <p align="left"><img src="https://komarev.com/ghpvc/?username=hncleary" alt="hncleary"/></p>';

/** Writes a string to the README.md file */
export function writeToReadme(content: string, filePath: string = './README.md'): void {
  try {
    const fullPath = path.resolve(filePath);
    fs.writeFileSync(fullPath, formatHTML(content), 'utf8');
  } catch (error) {
    throw error;
  }
}

function formatHTML(html: string): string {
  const formatted: string[] = [];
  const regex = /(<[^>]+>)/g;
  const tokens = html.split(regex).filter(token => token.trim() !== '');
  let indentLevel = 0;
  const indentSize = 2;

  const getIndent = (level: number) => ' '.repeat(level * indentSize);

  tokens.forEach(token => {
    if (token.match(/^<\/\w/)) {
      // Closing tag
      indentLevel = Math.max(indentLevel - 1, 0);
      formatted.push(getIndent(indentLevel) + token);
    } else if (token.match(/^<\w[^>]*[^\/]>$/)) {
      // Opening tag
      formatted.push(getIndent(indentLevel) + token);
      indentLevel++;
    } else {
      // Self-closing tag or text
      formatted.push(getIndent(indentLevel) + token);
    }
  });
  return formatted.join('\n');
}

function getMaxLinkCount(projects: ProjectDetails[]): number {
  const counts = projects.map(p => p.links.length);
  return counts.length > 0 ? Math.max(...counts) : 0;
}

function getTableRowProjectStr(project: ProjectDetails): string {
  let rowStr = `<tr ${COMPACT_STYLE}>`;
  // Image Cell - compact
  rowStr += `<td ${COMPACT_STYLE}><img src="./assets/images/${project.image}" ${COMPACT_IMAGE_STYLE}></td>`;
  // Name + Description - compact
  rowStr += `<td ${COMPACT_STYLE}><div ${COMPACT_TITLE_STYLE}><b>${project.displayName}</b></div><div ${COMPACT_DESC_STYLE}>${project.description}</div></td>`;
  // Links - grid format with max 2 per row
  let batchCell = `<td ${COMPACT_STYLE}>`;
  if (project.links.length > 0) {
    batchCell += `<div ${LINKS_GRID_STYLE}>`;
    for (const link of project.links) {
      batchCell += `<a href="${link.link}"><img ${COMPACT_ICON_STYLE} src="./assets/icons/${link.icon}" />${link.displayName}</a>`;
    }
    batchCell += '</div>';
  }
  batchCell += '</td>';
  rowStr += batchCell;
  rowStr += '</tr>';
  return rowStr;
}

function getTableStr(projects: ProjectDetails[]): string {
  const linkCells = getMaxLinkCount(projects) / MAX_LINKS_PER_CELL;
  const colSpan = NON_LINK_COLSPAN + linkCells;
  const compactTableStyle =
    'style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto;"';
  const compactHeaderStyle = 'style="padding: 6px; text-align: center; font-size: 0.95em;"';
  let tableStr = `<table align="center" ${compactTableStyle}>`;
  tableStr += `<tr><td colspan="${colSpan}" ${compactHeaderStyle}><b>${TABLE_TITLE}</b><br><span style="font-size: 0.85em; color: #666;">${TABLE_DESC}</span></td></tr>`;
  for (const p of projects) {
    tableStr += getTableRowProjectStr(p);
  }
  tableStr += '</table>';
  return tableStr;
}

function main() {
  let content = BASE_PROJECT_STR;
  const tableStr = getTableStr(DEFINED_PROJECTS);
  content += tableStr;
  writeToReadme(content);
}

main();
