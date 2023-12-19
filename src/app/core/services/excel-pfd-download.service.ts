import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
// import { Workbook } from 'exceljs';
import * as Excel from "exceljs"
var FileSaver= require('file-saver');
@Injectable({
  providedIn: 'root'
})
export class ExcelPfdDownloadedService {
  constructor(private datePipe:DatePipe){}


 generateExcel(header:any,apiKeys:any,data:any,pageName?:any,_headerData?:any,columnWidth?:any) {
this.datePipe
  // let keyCenterNo = "";
  // let keyCNo = String.fromCharCode(Math.ceil(apiKeys.length) + 64);

 /*  if (apiKeys.length == 4) {
    keyCenterNo = "D"
  } else {
    keyCenterNo = String.fromCharCode(Math.ceil(apiKeys.length / 2) + 64)
  } */
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(pageName);
  // worksheet.getRow(1).height = 35;
  // worksheet.mergeCells('A1:'+keyCNo+'1')
    //
    // worksheet.mergeCells('A2:'+keyCNo+'2')
    // worksheet.getRow(2).height = 30;
    // worksheet.getCell(keyCNo + '2').value = 'mahakhanij';
    // worksheet.getCell(keyCNo + '2').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(keyCNo + '2').font = { size: 18, bold: true, color: { argb: '315c87' } };

    // worksheet.mergeCells('A3:'+keyCNo+'3')
    // worksheet.getRow(3).height = 25;
    // worksheet.getCell(keyCNo + '3').value = pageName;
    // worksheet.getCell(keyCNo + '3').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(keyCNo + '3').font = { size: 16, bold: true, color: { argb: '000000' } };

    // worksheet.mergeCells('A4:'+keyCNo+'4')
    // worksheet.getCell(keyCNo + '4').value = 'From Date: '+headerData.fromDate+' To Date: '+headerData.fromDate;
    // worksheet.getCell(keyCNo + '4').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(keyCNo + '4').font = { size: 10, bold: true, color: { argb: '000000' } };

    // worksheet.mergeCells('A5:'+keyCNo+'5')
    // worksheet.getCell(keyCNo + '5').value = headerData.key1+': '+headerData.value1+' '+headerData.key2+': '+headerData.value2;
    // worksheet.getCell(keyCNo + '5').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(keyCNo + '5').font = { size: 10, bold: true, color: { argb: '000000' } };

    // worksheet.getCell(keyCNo + '6').value = 'Print Date: '+this.datePipe.transform(new Date(),'dd/MM/yyyy  hh:mm:ss a');
    // worksheet.getCell(keyCNo + '6').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.getCell(keyCNo + '6').font = { size: 9, bold: true, color: { argb: '000000' } };

    const headerRow = worksheet.addRow(header); // Add Header Row
    let result: any = data.map((obj: any) => {
      let filterObj: any = {};
      for (let i: any = 0; i < apiKeys.length; i++) {
        // apiKeys[i]=='Delivered_Quantity'?
        filterObj[apiKeys[i]] = obj[apiKeys[i]];
      }
      return filterObj;
    });
    headerRow.eachCell((cell: any) => { // Cell Style : Fill and Border
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' }, bgColor: { argb: 'C0C0C0' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = { bold: true }
    });

    var headerSize;
    headerSize = columnWidth?columnWidth: [15, 15];

    for (var i = 0; i < headerSize.length; i++) {
      worksheet.getColumn(i + 1).width = headerSize[i];
    }
    result.map((d: any) => {
      worksheet.addRow(Object.values(d));
    });

    // const endRow = worksheet.lastRow?(worksheet.lastRow.number + 1):0;
    // worksheet.getCell(`A${endRow}:B${endRow}`).value ='total';
    // worksheet.getCell(`C${endRow}`).value = { formula: `SUM(C4:C${endRow-1})`, date1904: false }
    // worksheet.getCell(`D${endRow}`).value = { formula: `SUM(D4:D${endRow-1})`, date1904: false }
    // worksheet.getCell(`E${endRow}`).value = { formula: `SUM(E4:E${endRow-1})`, date1904: false }
    // worksheet.getCell(`F${endRow}`).value = { formula: `SUM(F4:F${endRow-1})`, date1904: false }
    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, pageName);
    });
  }
}
