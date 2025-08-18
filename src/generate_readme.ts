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
const TABLE_DESC = 'Personal projects currently published online';
const MAX_LINKS_PER_CELL = 2;
const NON_LINK_COLSPAN = 5;

const BASE_PROJECT_STR =
  '### Howdy 👋 <p align="left"><img src="https://komarev.com/ghpvc/?username=hncleary" alt="hncleary"/></p>';

/** Writes a string to the README.md file */
export function writeToReadme(content: string, filePath: string = './README.md'): void {
  try {
    const fullPath = path.resolve(filePath);
    fs.writeFileSync(fullPath, content, 'utf8');
  } catch (error) {
    throw error;
  }
}

/** Split an array into an array of arrays of maximum length {{ batchSize }}
 * @NOTE This is used to display {{ batchSize }} number of rendered items per report page */
function getArrayInBatches<T>(arr: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr?.length; i++) {
    if ((i === 0 || i % batchSize === 0) && i + batchSize <= arr.length) {
      const currBatch: T[] = [];
      for (let j = i; j < i + batchSize; j++) {
        currBatch.push(arr[j]);
      }
      batches.push(currBatch);
    } else if ((i === 0 || i % batchSize === 0) && i + batchSize > arr.length) {
      const currBatch: T[] = [];
      for (let j = i; j < arr.length; j++) {
        currBatch.push(arr[j]);
      }
      batches.push(currBatch);
      return batches;
    }
  }
  return batches;
}

function getMaxLinkCount(projects: ProjectDetails[]): number {
  return Math.max(...projects.map(p => p.links.length));
}

function getTableRowProjectStr(project: ProjectDetails, linkCells: number): string {
  let rowStr = '<tr>';
  // Image Cell
  rowStr += `<td><img src="./assets/images/${project.image}" style="width:50px"></td>`;
  // Name + Description
  rowStr += `<td class="display: flex; flex-direction: column;"><div style="font-size: 14px"><b>${project.displayName}</b></div><div><p style="font-size: 14px">${project.description}</p></div></td>`;
  // Links
  const linksBatches = getArrayInBatches(project.links, MAX_LINKS_PER_CELL);
  for (let i = 0; i < linkCells; i++) {
    let batchCell = '<td class="display: flex; flex-direction: column;">';
    if (linksBatches.length > i) {
      for (const link of linksBatches[i]) {
        batchCell += `<a style="font-size: 12px; display: flex; flex-direction: row; align-items: flex-start; justify-content: flex-start; " href="${link.link}"><img style="width:20px" src="./assets/icons/${link.icon}" />${link.displayName}</a></br>`;
      }
    }
    batchCell += '</td>';
    rowStr += batchCell;
  }

  return rowStr;
}

function getTableStr(projects: ProjectDetails[]): string {
  const linkCells = getMaxLinkCount(projects) / MAX_LINKS_PER_CELL;
  const colSpan = NON_LINK_COLSPAN + linkCells;
  let tableStr = '<table align="center">';
  tableStr += `<tr><td colspan="${colSpan}" align="center"><br>${TABLE_TITLE}<br>${TABLE_DESC}</td></tr>`;
  for (const p of projects) {
    tableStr += getTableRowProjectStr(p, linkCells);
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
