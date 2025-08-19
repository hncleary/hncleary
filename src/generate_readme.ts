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
    description: 'The world\'s most powerful LLM AI chat bot powered by divination',
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
      }
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
const TABLE_DESC = 'Personal side-projects currently published online';
const MAX_LINKS_PER_CELL = 4;
const NON_LINK_COLSPAN = 5;

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
  return Math.max(...projects.map(p => p.links.length));
}

function getTableRowProjectStr(project: ProjectDetails): string {
  let rowStr = '<tr>';
  // Image Cell
  rowStr += `<td><img src="./assets/images/${project.image}" style="width:50px"></td>`;
  // Name + Description
  rowStr += `<td class="display: flex; flex-direction: column;"><div><b>${project.displayName}</b></div><div>${project.description}</div></td>`;
  // Links
  let batchCell = '<td class="display: flex; flex-direction: column;">';
  for(const link of project.links) { 
    batchCell += `<a href="${link.link}"><img style="width:20px" src="./assets/icons/${link.icon}" />${link.displayName}</a><br/>`;

  }
  batchCell += '</td>';
  rowStr += batchCell;
  return rowStr;
}

function getTableStr(projects: ProjectDetails[]): string {
  const linkCells = getMaxLinkCount(projects) / MAX_LINKS_PER_CELL;
  const colSpan = NON_LINK_COLSPAN + linkCells;
  let tableStr = '<table align="center">';
  tableStr += `<tr><td colspan="${colSpan}" align="center"><br><b>${TABLE_TITLE}</b><br>${TABLE_DESC}</td></tr>`;
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
