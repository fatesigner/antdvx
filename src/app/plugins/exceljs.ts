/**
 * exceljs
 */

import { configureExceljs } from '@fatesigner/utils/exceljs';

export const Exceljs = {
  install() {
    const fontSize = 8;
    const minWidth = 10;
    const widthRatio = fontSize / 10;
    const defaultRowHeight = 18;

    configureExceljs({
      autoWidth: true,
      theadStyle: {
        alignment: {
          vertical: 'middle',
          horizontal: 'center'
        },
        border: {
          top: {
            style: 'thin',
            color: { argb: 'a9a9a9' }
          },
          bottom: {
            style: 'thin',
            color: { argb: 'a9a9a9' }
          },
          left: {
            style: 'thin',
            color: { argb: 'a9a9a9' }
          },
          right: {
            style: 'thin',
            color: { argb: 'a9a9a9' }
          }
        },
        fill: {
          type: 'gradient',
          gradient: 'angle',
          degree: 0,
          stops: [
            { position: 0, color: { argb: 'd3d3d3' } }, // 单元格渐变色（左）
            { position: 0.5, color: { argb: 'd3d3d3' } }, // 单元格渐变色（中）
            { position: 1, color: { argb: 'd3d3d3' } } // 单元格渐变色（右）
          ]
        },
        font: {
          name: 'Tahoma',
          size: fontSize
        }
      },
      style: {
        alignment: {
          vertical: 'middle',
          horizontal: 'left',
          indent: 0,
          wrapText: true
        },
        font: {
          name: 'Microsoft YaHei UI',
          size: fontSize
        }
      },
      worksheetOptions: {
        properties: {
          defaultRowHeight: 16
        },
        views: [{ showGridLines: true, state: 'frozen', xSplit: 1, ySplit: 1 }]
      }
    });
  }
};
