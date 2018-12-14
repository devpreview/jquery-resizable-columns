declare interface JqueryResizableColumnsOptions {
    selector?: JQuery,
    store?: any,
    syncHandlers?: boolean,
    resizeFromBody?: boolean,
    maxWidth?: number,
    minWidth?: number
}

declare interface JQuery {
    resizableColumns(options?: JqueryResizableColumnsOptions): JQuery;
}
