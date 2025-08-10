import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as Excel from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class ExcelServiceService {
  constructor() {}

  exportExcelForResourceHistoryReport(ownerData: any) {
  
    const title = ownerData.title;
    const header = [
      'ResourceType',
      'RFID Tag',
      'Type',
      'Cycles',
      'Start Date',
      'End Date',
      'Filter Name',
    ];
    const data = ownerData.data;

  
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Resource History Report');

   
    worksheet.mergeCells('A1', 'E3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    
    worksheet.mergeCells('F1', 'G3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('F1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

   
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    });

  
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);
    });

    worksheet.getColumn(1).width = 18;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 18;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 17;
    worksheet.getColumn(6).width = 17;
    worksheet.getColumn(7).width = 20;
    worksheet.addRow([]);

    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  exportExcelForDamageReport(ownerData: any) {
 
    const title = ownerData.title;
    const header = [
      'RFID Tag',
      'Resource Type',
      'Sub-Type',
      'Damage Date',
      'Damage Type',
      'Filter Id',
      'Current Status',
      'Repaired Date',
    ];
    const data = ownerData.data;

   
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Damage Report');

   
    worksheet.mergeCells('A1', 'F3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

  
    worksheet.mergeCells('G1', 'H3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('G1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

   
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

   
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 17;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 15;
    worksheet.addRow([]);

    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  exportExcelForGate(gateData: any) {
   
    const title = gateData.title;
    const header = [
      'id',
      'Yard Name',
      'Yard Type',
      'Model Code',
      'Vin',
      'Entry Date',
      'Exit Date',
    ];
    const data = gateData.data;

   
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Yard Transcation Report');

   
    worksheet.mergeCells('A1', 'E3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    
 
    worksheet.mergeCells('F1', 'F3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('F1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

  
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });
    
    
    data.forEach((d: any) => {
    
      var dd = new Date(d[6]);
      var datestring =
        ('0' + dd.getDate()).slice(-2) +
        '-' +
        ('0' + (dd.getMonth() + 1)).slice(-2) +
        '-' +
        dd.getFullYear() +
        ' ' +
        ('0' + dd.getHours()).slice(-2) +
        ':' +
        ('0' + dd.getMinutes()).slice(-2);

      
      let val = null;
      if (d[3] === 1) val = 'OutBound';
      else if (d[3] === 2) val = 'InBound';
      else if (d[3] === 4) val = 'InPlant';

     
      let formattedRowData = [d[0], d[1], d[2], d[3],d[5], datestring,datestring];
      let row = worksheet.addRow(formattedRowData);
    });

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.addRow([]);

   
   
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
  exportExcelForFilterWiseMIS(ownerData: any) {
   
    const title = ownerData.title;
    const header = [
      'Filter',
      'RFID Tag',
      'Res. Type',
      'Sub-Type',
      'Cycles',
      'Repairs',
      'First Used',
    ];
    const data = ownerData.data;

  
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Filter wise MIS');

    
    worksheet.mergeCells('A1', 'E3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    
    worksheet.mergeCells('F1', 'G3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('F1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

   
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);
    });

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 20;
    worksheet.addRow([]);

 
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  exportExcelForstockReport(ownerData: any) {

    const title = ownerData.title;
    const header = [
      'Status',
      'RFID Tag',
      'Resource Type',
      'Sub-Type',
      'Add to Stock',
      'Cycles',
      'Repairs',
    ];
    const data = ownerData.data;

  
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Stock Report');

 
    worksheet.mergeCells('A1', 'E3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

   
    worksheet.mergeCells('F1', 'G3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('G1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

    
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);
    });

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 17;
    worksheet.getColumn(6).width = 10;
    worksheet.addRow([]);


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  exportExcelForCycleCountReport(ownerData: any) {
 
    const title = ownerData.title;
    const header = [
      'Date',
      'Shift Detail',
      'Filter Name',
      'Success',
      'Short Cycles',
      'Long Cycles',
      'Aborted Cycles',
    ];
    const data = ownerData.data;


    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Cycle Count Report');

   
    worksheet.mergeCells('A1', 'D3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

   
    worksheet.mergeCells('E1', 'F3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('E1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

 
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);
    });

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 15;
    worksheet.addRow([]);

    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  exportExcelForEOLReport(ownerData: any) {
 
    const title = ownerData.title;
    const header = [
      'Filter Name',
      'Resource No.',
      'RFID Tag',
      'Res. Type',
      'Sub Type',
      'MFG',
      'Cycle Count',
    ];
    const data = ownerData.data;

 
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('End of Life Report');


    worksheet.mergeCells('A1', 'E3');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    
    worksheet.mergeCells('F1', 'G3');
    let d = new Date();
    let date = d;
    let dateCell = worksheet.getCell('F1');

    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

    
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    });

   
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);
    });

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 13;
    worksheet.addRow([]);

   
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }
}
