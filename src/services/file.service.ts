import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_EXTENSION = '.csv';
const KML_EXTENSION = '.kml';


@Injectable()
export class FileService {

  constructor(private file: File) {
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportAsCsvFile(json: any, fileName: string) {

    const array = [Object.keys(json[0])].concat(json)

    var csv = array.map(it => {
      return Object.values(it).toString()
    }).join('\n')

    const data: Blob = new Blob([csv], {
      type: 'text/csv'
    });

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + CSV_EXTENSION);
  }

  public exportAsKmlFile(kml: any, fileName: string) {
    const data: Blob = new Blob([kml], {
      type: 'text'
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + KML_EXTENSION);
  }

  public async readFile(path, fileName) {
    var file;
    this.file.readAsDataURL(path, fileName).then(value => {
      console.log(value)
    })

    return file;
  }

  public download_file(_url: any, fileName) {

    const link = document.createElement('a');
    link.href = _url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}