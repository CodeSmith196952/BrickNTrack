export class Pagination {
    searchtext: any;
    page: number | any;
    pageSize: number | any;
    filterRecordCount: number | any;
    totalTransactionCount: number | any
    pageSizes: number[] | any;
  
    constructor(page?: number, totalTransactionCount?: number, pageSize?: number, filterRecordCount?: number, pagesSizes?: number[]) {
  
      this.page = page;
      this.totalTransactionCount = totalTransactionCount;
      this.pageSize = pageSize;
      this.filterRecordCount = filterRecordCount;
      this.pageSizes = pagesSizes
    }
  
  }