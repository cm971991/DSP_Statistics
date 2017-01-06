//(function (factory) {
//    "use strict";
//    if (typeof define === 'function' && define.amd) {
//        define(['jquery'],
//            function ($) {
//                return factory($, window, document)
//            })
//    } else if (typeof exports === 'object') {
//        module.exports = function (root, $) {
//            if (!root) {
//                root = window
//            }
//            if (!$) {
//                $ = typeof window !== 'undefined' ? requir('jquery') : require('jquery')(root)
//            } return factory($, root, root.document)
//        }
//    } else { factory(jQuery, window, document) }
//}(function ($, window, document, undefined) {
//    "use strict"; var DataTable; var _ext; var _Api; var _api_register; var _api_registerPlural; var _re_dic = {}; var _re_new_lines = /[\r\n]/g; var _re_html = /<.*?>/g; var _re_date_start = /^[\w\+\-]/; var _re_date_end = /[\w\+\-]$/; var _re_escape_regex = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join('|\\') + ')', 'g'); var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi; var _empty = function (d) { return !d || d === true || d === '-' ? true : false }; var _intVal = function (s) { var integer = parseInt(s, 10); return !isNaN(integer) && isFinite(s) ? integer : null }; var _numToDecimal = function (num, decimalPoint) { if (!_re_dic[decimalPoint]) { _re_dic[decimalPoint] = new RegExp(_fnEscapeRegex(decimalPoint), 'g') } return typeof num === 'string' && decimalPoint !== '.' ? num.replace(/\./g, '').replace(_re_dic[decimalPoint], '.') : num }; var _isNumber = function (d, decimalPoint, formatted) { var strType = typeof d === 'string'; if (_empty(d)) { return true } if (decimalPoint && strType) { d = _numToDecimal(d, decimalPoint) } if (formatted && strType) { d = d.replace(_re_formatted_numeric, '') } return !isNaN(parseFloat(d)) && isFinite(d) }; var _isHtml = function (d) { return _empty(d) || typeof d === 'string' }; var _htmlNumeric = function (d, decimalPoint, formatted) { if (_empty(d)) { return true } var html = _isHtml(d); return !html ? null : _isNumber(_stripHtml(d), decimalPoint, formatted) ? true : null }; var _pluck = function (a, prop, prop2) { var out = []; var i = 0, ien = a.length; if (prop2 !== undefined) { for (; i < ien; i++) { if (a[i] && a[i][prop]) { out.push(a[i][prop][prop2]) } } } else { for (; i < ien; i++) { if (a[i]) { out.push(a[i][prop]) } } } return out }; var _pluck_order = function (a, order, prop, prop2) { var out = []; var i = 0, ien = order.length; if (prop2 !== undefined) { for (; i < ien; i++) { if (a[order[i]][prop]) { out.push(a[order[i]][prop][prop2]) } } } else { for (; i < ien; i++) { out.push(a[order[i]][prop]) } } return out }; var _range = function (len, start) { var out = []; var end; if (start === undefined) { start = 0; end = len } else { end = start; start = len } for (var i = start; i < end; i++) { out.push(i) } return out }; var _removeEmpty = function (a) { var out = []; for (var i = 0, ien = a.length; i < ien; i++) { if (a[i]) { out.push(a[i]) } } return out }; var _stripHtml = function (d) { return d.replace(_re_html, '') }; var _unique = function (src) { var out = [], val, i, ien = src.length, j, k = 0; again: for (i = 0; i < ien; i++) { val = src[i]; for (j = 0; j < k; j++) { if (out[j] === val) { continue again } } out.push(val); k++ } return out }; function _fnHungarianMap(o) { var hungarian = 'a aa ai ao as b fn i m o s ', match, newKey, map = {}; $.each(o, function (key, val) { match = key.match(/^([^A-Z]+?)([A-Z])/); if (match && hungarian.indexOf(match[1] + ' ') !== -1) { newKey = key.replace(match[0], match[2].toLowerCase()); map[newKey] = key; if (match[1] === 'o') { _fnHungarianMap(o[key]) } } }); o._hungarianMap = map } function _fnCamelToHungarian(src, user, force) { if (!src._hungarianMap) { _fnHungarianMap(src) } var hungarianKey; $.each(user, function (key, val) { hungarianKey = src._hungarianMap[key]; if (hungarianKey !== undefined && (force || user[hungarianKey] === undefined)) { if (hungarianKey.charAt(0) === 'o') { if (!user[hungarianKey]) { user[hungarianKey] = {} } $.extend(true, user[hungarianKey], user[key]); _fnCamelToHungarian(src[hungarianKey], user[hungarianKey], force) } else { user[hungarianKey] = user[key] } } }) } function _fnLanguageCompat(lang) { var defaults = DataTable.defaults.oLanguage; var zeroRecords = lang.sZeroRecords; if (!lang.sEmptyTable && zeroRecords && defaults.sEmptyTable === "No data available in table") { _fnMap(lang, lang, 'sZeroRecords', 'sEmptyTable') } if (!lang.sLoadingRecords && zeroRecords && defaults.sLoadingRecords === "Loading...") { _fnMap(lang, lang, 'sZeroRecords', 'sLoadingRecords') } if (lang.sInfoThousands) { lang.sThousands = lang.sInfoThousands } var decimal = lang.sDecimal; if (decimal) { _addNumericSort(decimal) } } var _fnCompatMap = function (o, knew, old) { if (o[knew] !== undefined) { o[old] = o[knew] } }; function _fnCompatOpts(init) { _fnCompatMap(init, 'ordering', 'bSort'); _fnCompatMap(init, 'orderMulti', 'bSortMulti'); _fnCompatMap(init, 'orderClasses', 'bSortClasses'); _fnCompatMap(init, 'orderCellsTop', 'bSortCellsTop'); _fnCompatMap(init, 'order', 'aaSorting'); _fnCompatMap(init, 'orderFixed', 'aaSortingFixed'); _fnCompatMap(init, 'paging', 'bPaginate'); _fnCompatMap(init, 'pagingType', 'sPaginationType'); _fnCompatMap(init, 'pageLength', 'iDisplayLength'); _fnCompatMap(init, 'searching', 'bFilter'); if (typeof init.sScrollX === 'boolean') { init.sScrollX = init.sScrollX ? '100%' : '' } if (typeof init.scrollX === 'boolean') { init.scrollX = init.scrollX ? '100%' : '' } var searchCols = init.aoSearchCols; if (searchCols) { for (var i = 0, ien = searchCols.length; i < ien; i++) { if (searchCols[i]) { _fnCamelToHungarian(DataTable.models.oSearch, searchCols[i]) } } } } function _fnCompatCols(init) { _fnCompatMap(init, 'orderable', 'bSortable'); _fnCompatMap(init, 'orderData', 'aDataSort'); _fnCompatMap(init, 'orderSequence', 'asSorting'); _fnCompatMap(init, 'orderDataType', 'sortDataType'); var dataSort = init.aDataSort; if (dataSort && !$.isArray(dataSort)) { init.aDataSort = [dataSort] } } function _fnBrowserDetect(settings) { if (!DataTable.__browser) { var browser = {}; DataTable.__browser = browser; var n = $('<div/>').css({ position: 'fixed', top: 0, left: 0, height: 1, width: 1, overflow: 'hidden' }).append($('<div/>').css({ position: 'absolute', top: 1, left: 1, width: 100, overflow: 'scroll' }).append($('<div/>').css({ width: '100%', height: 10 }))).appendTo('body'); var outer = n.children(); var inner = outer.children(); browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth; browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100; browser.bScrollbarLeft = Math.round(inner.offset().left) !== 1; browser.bBounding = n[0].getBoundingClientRect().width ? true : false; n.remove() } $.extend(settings.oBrowser, DataTable.__browser); settings.oScroll.iBarWidth = DataTable.__browser.barWidth } function _fnReduce(that, fn, init, start, end, inc) { var i = start, value, isSet = false; if (init !== undefined) { value = init; isSet = true } while (i !== end) { if (!that.hasOwnProperty(i)) { continue } value = isSet ? fn(value, that[i], i, that) : that[i]; isSet = true; i += inc } return value } function _fnAddColumn(oSettings, nTh) { var oDefaults = DataTable.defaults.column; var iCol = oSettings.aoColumns.length; var oCol = $.extend({}, DataTable.models.oColumn, oDefaults, { "nTh": nTh ? nTh : document.createElement('th'), "sTitle": oDefaults.sTitle ? oDefaults.sTitle : nTh ? nTh.innerHTML : '', "aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol], "mData": oDefaults.mData ? oDefaults.mData : iCol, idx: iCol }); oSettings.aoColumns.push(oCol); var searchCols = oSettings.aoPreSearchCols; searchCols[iCol] = $.extend({}, DataTable.models.oSearch, searchCols[iCol]); _fnColumnOptions(oSettings, iCol, $(nTh).data()) } function _fnColumnOptions(oSettings, iCol, oOptions) { var oCol = oSettings.aoColumns[iCol]; var oClasses = oSettings.oClasses; var th = $(oCol.nTh); if (!oCol.sWidthOrig) { oCol.sWidthOrig = th.attr('width') || null; var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/); if (t) { oCol.sWidthOrig = t[1] } } if (oOptions !== undefined && oOptions !== null) { _fnCompatCols(oOptions); _fnCamelToHungarian(DataTable.defaults.column, oOptions); if (oOptions.mDataProp !== undefined && !oOptions.mData) { oOptions.mData = oOptions.mDataProp } if (oOptions.sType) { oCol._sManualType = oOptions.sType } if (oOptions.className && !oOptions.sClass) { oOptions.sClass = oOptions.className } $.extend(oCol, oOptions); _fnMap(oCol, oOptions, "sWidth", "sWidthOrig"); if (oOptions.iDataSort !== undefined) { oCol.aDataSort = [oOptions.iDataSort] } _fnMap(oCol, oOptions, "aDataSort") } var mDataSrc = oCol.mData; var mData = _fnGetObjectDataFn(mDataSrc); var mRender = oCol.mRender ? _fnGetObjectDataFn(oCol.mRender) : null; var attrTest = function (src) { return typeof src === 'string' && src.indexOf('@') !== -1 }; oCol._bAttrSrc = $.isPlainObject(mDataSrc) && (attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)); oCol.fnGetData = function (rowData, type, meta) { var innerData = mData(rowData, type, undefined, meta); return mRender && type ? mRender(innerData, type, rowData, meta) : innerData }; oCol.fnSetData = function (rowData, val, meta) { return _fnSetObjectDataFn(mDataSrc)(rowData, val, meta) }; if (typeof mDataSrc !== 'number') { oSettings._rowReadObject = true } if (!oSettings.oFeatures.bSort) { oCol.bSortable = false; th.addClass(oClasses.sSortableNone) } var bAsc = $.inArray('asc', oCol.asSorting) !== -1; var bDesc = $.inArray('desc', oCol.asSorting) !== -1; if (!oCol.bSortable || (!bAsc && !bDesc)) { oCol.sSortingClass = oClasses.sSortableNone; oCol.sSortingClassJUI = "" } else if (bAsc && !bDesc) { oCol.sSortingClass = oClasses.sSortableAsc; oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed } else if (!bAsc && bDesc) { oCol.sSortingClass = oClasses.sSortableDesc; oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed } else { oCol.sSortingClass = oClasses.sSortable; oCol.sSortingClassJUI = oClasses.sSortJUI } } function _fnAdjustColumnSizing(settings) { if (settings.oFeatures.bAutoWidth !== false) { var columns = settings.aoColumns; _fnCalculateColumnWidths(settings); for (var i = 0, iLen = columns.length; i < iLen; i++) { columns[i].nTh.style.width = columns[i].sWidth } } var scroll = settings.oScroll; if (scroll.sY !== '' || scroll.sX !== '') { _fnScrollDraw(settings) } _fnCallbackFire(settings, null, 'column-sizing', [settings]) } function _fnVisibleToColumnIndex(oSettings, iMatch) { var aiVis = _fnGetColumns(oSettings, 'bVisible'); return typeof aiVis[iMatch] === 'number' ? aiVis[iMatch] : null } function _fnColumnIndexToVisible(oSettings, iMatch) { var aiVis = _fnGetColumns(oSettings, 'bVisible'); var iPos = $.inArray(iMatch, aiVis); return iPos !== -1 ? iPos : null } function _fnVisbleColumns(oSettings) { return _fnGetColumns(oSettings, 'bVisible').length } function _fnGetColumns(oSettings, sParam) { var a = []; $.map(oSettings.aoColumns, function (val, i) { if (val[sParam]) { a.push(i) } }); return a } function _fnColumnTypes(settings) { var columns = settings.aoColumns; var data = settings.aoData; var types = DataTable.ext.type.detect; var i, ien, j, jen, k, ken; var col, cell, detectedType, cache; for (i = 0, ien = columns.length; i < ien; i++) { col = columns[i]; cache = []; if (!col.sType && col._sManualType) { col.sType = col._sManualType } else if (!col.sType) { for (j = 0, jen = types.length; j < jen; j++) { for (k = 0, ken = data.length; k < ken; k++) { if (cache[k] === undefined) { cache[k] = _fnGetCellData(settings, k, i, 'type') } detectedType = types[j](cache[k], settings); if (!detectedType && j !== types.length - 1) { break } if (detectedType === 'html') { break } } if (detectedType) { col.sType = detectedType; break } } if (!col.sType) { col.sType = 'string' } } } } function _fnApplyColumnDefs(oSettings, aoColDefs, aoCols, fn) { var i, iLen, j, jLen, k, kLen, def; var columns = oSettings.aoColumns; if (aoColDefs) { for (i = aoColDefs.length - 1; i >= 0; i--) { def = aoColDefs[i]; var aTargets = def.targets !== undefined ? def.targets : def.aTargets; if (!$.isArray(aTargets)) { aTargets = [aTargets] } for (j = 0, jLen = aTargets.length; j < jLen; j++) { if (typeof aTargets[j] === 'number' && aTargets[j] >= 0) { while (columns.length <= aTargets[j]) { _fnAddColumn(oSettings) } fn(aTargets[j], def) } else if (typeof aTargets[j] === 'number' && aTargets[j] < 0) { fn(columns.length + aTargets[j], def) } else if (typeof aTargets[j] === 'string') { for (k = 0, kLen = columns.length; k < kLen; k++) { if (aTargets[j] == "_all" || $(columns[k].nTh).hasClass(aTargets[j])) { fn(k, def) } } } } } } if (aoCols) { for (i = 0, iLen = aoCols.length; i < iLen; i++) { fn(i, aoCols[i]) } } } function _fnAddData(oSettings, aDataIn, nTr, anTds) { var iRow = oSettings.aoData.length; var oData = $.extend(true, {}, DataTable.models.oRow, { src: nTr ? 'dom' : 'data', idx: iRow }); oData._aData = aDataIn; oSettings.aoData.push(oData); var nTd, sThisType; var columns = oSettings.aoColumns; for (var i = 0, iLen = columns.length; i < iLen; i++) { columns[i].sType = null } oSettings.aiDisplayMaster.push(iRow); var id = oSettings.rowIdFn(aDataIn); if (id !== undefined) { oSettings.aIds[id] = oData } if (nTr || !oSettings.oFeatures.bDeferRender) { _fnCreateTr(oSettings, iRow, nTr, anTds) } return iRow } function _fnAddTr(settings, trs) { var row; if (!(trs instanceof $)) { trs = $(trs) } return trs.map(function (i, el) { row = _fnGetRowElements(settings, el); return _fnAddData(settings, row.data, el, row.cells) }) } function _fnNodeToDataIndex(oSettings, n) { return (n._DT_RowIndex !== undefined) ? n._DT_RowIndex : null } function _fnNodeToColumnIndex(oSettings, iRow, n) { return $.inArray(n, oSettings.aoData[iRow].anCells) } function _fnGetCellData(settings, rowIdx, colIdx, type) { var draw = settings.iDraw; var col = settings.aoColumns[colIdx]; var rowData = settings.aoData[rowIdx]._aData; var defaultContent = col.sDefaultContent; var cellData = col.fnGetData(rowData, type, { settings: settings, row: rowIdx, col: colIdx }); if (cellData === undefined) { if (settings.iDrawError != draw && defaultContent === null) { _fnLog(settings, 0, "Requested unknown parameter " + (typeof col.mData == 'function' ? '{function}' : "'" + col.mData + "'") + " for row " + rowIdx + ", column " + colIdx, 4); settings.iDrawError = draw } return defaultContent } if ((cellData === rowData || cellData === null) && defaultContent !== null) { cellData = defaultContent } else if (typeof cellData === 'function') { return cellData.call(rowData) } if (cellData === null && type == 'display') { return '' } return cellData } function _fnSetCellData(settings, rowIdx, colIdx, val) { var col = settings.aoColumns[colIdx]; var rowData = settings.aoData[rowIdx]._aData; col.fnSetData(rowData, val, { settings: settings, row: rowIdx, col: colIdx }) } var __reArray = /\[.*?\]$/; var __reFn = /\(\)$/; function _fnSplitObjNotation(str) { return $.map(str.match(/(\\.|[^\.])+/g) || [''], function (s) { return s.replace(/\\./g, '.') }) } function _fnGetObjectDataFn(mSource) { if ($.isPlainObject(mSource)) { var o = {}; $.each(mSource, function (key, val) { if (val) { o[key] = _fnGetObjectDataFn(val) } }); return function (data, type, row, meta) { var t = o[type] || o._; return t !== undefined ? t(data, type, row, meta) : data } } else if (mSource === null) { return function (data) { return data } } else if (typeof mSource === 'function') { return function (data, type, row, meta) { return mSource(data, type, row, meta) } } else if (typeof mSource === 'string' && (mSource.indexOf('.') !== -1 || mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1)) { var fetchData = function (data, type, src) { var arrayNotation, funcNotation, out, innerSrc; if (src !== "") { var a = _fnSplitObjNotation(src); for (var i = 0, iLen = a.length; i < iLen; i++) { arrayNotation = a[i].match(__reArray); funcNotation = a[i].match(__reFn); if (arrayNotation) { a[i] = a[i].replace(__reArray, ''); if (a[i] !== "") { data = data[a[i]] } out = []; a.splice(0, i + 1); innerSrc = a.join('.'); if ($.isArray(data)) { for (var j = 0, jLen = data.length; j < jLen; j++) { out.push(fetchData(data[j], type, innerSrc)) } } var join = arrayNotation[0].substring(1, arrayNotation[0].length - 1); data = (join === "") ? out : out.join(join); break } else if (funcNotation) { a[i] = a[i].replace(__reFn, ''); data = data[a[i]](); continue } if (data === null || data[a[i]] === undefined) { return undefined } data = data[a[i]] } } return data }; return function (data, type) { return fetchData(data, type, mSource) } } else { return function (data, type) { return data[mSource] } } } function _fnSetObjectDataFn(mSource) { if ($.isPlainObject(mSource)) { return _fnSetObjectDataFn(mSource._) } else if (mSource === null) { return function () { } } else if (typeof mSource === 'function') { return function (data, val, meta) { mSource(data, 'set', val, meta) } } else if (typeof mSource === 'string' && (mSource.indexOf('.') !== -1 || mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1)) { var setData = function (data, val, src) { var a = _fnSplitObjNotation(src), b; var aLast = a[a.length - 1]; var arrayNotation, funcNotation, o, innerSrc; for (var i = 0, iLen = a.length - 1; i < iLen; i++) { arrayNotation = a[i].match(__reArray); funcNotation = a[i].match(__reFn); if (arrayNotation) { a[i] = a[i].replace(__reArray, ''); data[a[i]] = []; b = a.slice(); b.splice(0, i + 1); innerSrc = b.join('.'); if ($.isArray(val)) { for (var j = 0, jLen = val.length; j < jLen; j++) { o = {}; setData(o, val[j], innerSrc); data[a[i]].push(o) } } else { data[a[i]] = val } return } else if (funcNotation) { a[i] = a[i].replace(__reFn, ''); data = data[a[i]](val) } if (data[a[i]] === null || data[a[i]] === undefined) { data[a[i]] = {} } data = data[a[i]] } if (aLast.match(__reFn)) { data = data[aLast.replace(__reFn, '')](val) } else { data[aLast.replace(__reArray, '')] = val } }; return function (data, val) { return setData(data, val, mSource) } } else { return function (data, val) { data[mSource] = val } } } function _fnGetDataMaster(settings) { return _pluck(settings.aoData, '_aData') } function _fnClearTable(settings) { settings.aoData.length = 0; settings.aiDisplayMaster.length = 0; settings.aiDisplay.length = 0; settings.aIds = {} } function _fnDeleteIndex(a, iTarget, splice) { var iTargetIndex = -1; for (var i = 0, iLen = a.length; i < iLen; i++) { if (a[i] == iTarget) { iTargetIndex = i } else if (a[i] > iTarget) { a[i]-- } } if (iTargetIndex != -1 && splice === undefined) { a.splice(iTargetIndex, 1) } } function _fnInvalidate(settings, rowIdx, src, colIdx) { var row = settings.aoData[rowIdx]; var i, ien; var cellWrite = function (cell, col) { while (cell.childNodes.length) { cell.removeChild(cell.firstChild) } cell.innerHTML = _fnGetCellData(settings, rowIdx, col, 'display') }; if (src === 'dom' || ((!src || src === 'auto') && row.src === 'dom')) { row._aData = _fnGetRowElements(settings, row, colIdx, colIdx === undefined ? undefined : row._aData).data } else { var cells = row.anCells; if (cells) { if (colIdx !== undefined) { cellWrite(cells[colIdx], colIdx) } else { for (i = 0, ien = cells.length; i < ien; i++) { cellWrite(cells[i], i) } } } } row._aSortData = null; row._aFilterData = null; var cols = settings.aoColumns; if (colIdx !== undefined) { cols[colIdx].sType = null } else { for (i = 0, ien = cols.length; i < ien; i++) { cols[i].sType = null } _fnRowAttributes(settings, row) } } function _fnGetRowElements(settings, row, colIdx, d) { var tds = [], td = row.firstChild, name, col, o, i = 0, contents, columns = settings.aoColumns, objectRead = settings._rowReadObject; d = d !== undefined ? d : objectRead ? {} : []; var attr = function (str, td) { if (typeof str === 'string') { var idx = str.indexOf('@'); if (idx !== -1) { var attr = str.substring(idx + 1); var setter = _fnSetObjectDataFn(str); setter(d, td.getAttribute(attr)) } } }; var cellProcess = function (cell) { if (colIdx === undefined || colIdx === i) { col = columns[i]; contents = $.trim(cell.innerHTML); if (col && col._bAttrSrc) { var setter = _fnSetObjectDataFn(col.mData._); setter(d, contents); attr(col.mData.sort, cell); attr(col.mData.type, cell); attr(col.mData.filter, cell) } else { if (objectRead) { if (!col._setter) { col._setter = _fnSetObjectDataFn(col.mData) } col._setter(d, contents) } else { d[i] = contents } } } i++ }; if (td) { while (td) { name = td.nodeName.toUpperCase(); if (name == "TD" || name == "TH") { cellProcess(td); tds.push(td) } td = td.nextSibling } } else { tds = row.anCells; for (var j = 0, jen = tds.length; j < jen; j++) { cellProcess(tds[j]) } } var rowNode = row.firstChild ? row : row.nTr; if (rowNode) { var id = rowNode.getAttribute('id'); if (id) { _fnSetObjectDataFn(settings.rowId)(d, id) } } return { data: d, cells: tds } } function _fnCreateTr(oSettings, iRow, nTrIn, anTds) { var row = oSettings.aoData[iRow], rowData = row._aData, cells = [], nTr, nTd, oCol, i, iLen; if (row.nTr === null) { nTr = nTrIn || document.createElement('tr'); row.nTr = nTr; row.anCells = cells; nTr._DT_RowIndex = iRow; _fnRowAttributes(oSettings, row); for (i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) { oCol = oSettings.aoColumns[i]; nTd = nTrIn ? anTds[i] : document.createElement(oCol.sCellType); nTd._DT_CellIndex = { row: iRow, column: i }; cells.push(nTd); if (!nTrIn || oCol.mRender || oCol.mData !== i) { nTd.innerHTML = _fnGetCellData(oSettings, iRow, i, 'display') } if (oCol.sClass) { nTd.className += ' ' + oCol.sClass } if (oCol.bVisible && !nTrIn) { nTr.appendChild(nTd) } else if (!oCol.bVisible && nTrIn) { nTd.parentNode.removeChild(nTd) } if (oCol.fnCreatedCell) { oCol.fnCreatedCell.call(oSettings.oInstance, nTd, _fnGetCellData(oSettings, iRow, i), rowData, iRow, i) } } _fnCallbackFire(oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow]) } row.nTr.setAttribute('role', 'row') } function _fnRowAttributes(settings, row) { var tr = row.nTr; var data = row._aData; if (tr) { var id = settings.rowIdFn(data); if (id) { tr.id = id } if (data.DT_RowClass) { var a = data.DT_RowClass.split(' '); row.__rowc = row.__rowc ? _unique(row.__rowc.concat(a)) : a; $(tr).removeClass(row.__rowc.join(' ')).addClass(data.DT_RowClass) } if (data.DT_RowAttr) { $(tr).attr(data.DT_RowAttr) } if (data.DT_RowData) { $(tr).data(data.DT_RowData) } } } function _fnBuildHead(oSettings) { var i, ien, cell, row, column; var thead = oSettings.nTHead; var tfoot = oSettings.nTFoot; var createHeader = $('th, td', thead).length === 0; var classes = oSettings.oClasses; var columns = oSettings.aoColumns; if (createHeader) { row = $('<tr/>').appendTo(thead) } for (i = 0, ien = columns.length; i < ien; i++) { column = columns[i]; cell = $(column.nTh).addClass(column.sClass); if (createHeader) { cell.appendTo(row) } if (oSettings.oFeatures.bSort) { cell.addClass(column.sSortingClass); if (column.bSortable !== false) { cell.attr('tabindex', oSettings.iTabIndex).attr('aria-controls', oSettings.sTableId); _fnSortAttachListener(oSettings, column.nTh, i) } } if (column.sTitle != cell[0].innerHTML) { cell.html(column.sTitle) } _fnRenderer(oSettings, 'header')(oSettings, cell, column, classes) } if (createHeader) { _fnDetectHeader(oSettings.aoHeader, thead) } $(thead).find('>tr').attr('role', 'row'); $(thead).find('>tr>th, >tr>td').addClass(classes.sHeaderTH); $(tfoot).find('>tr>th, >tr>td').addClass(classes.sFooterTH); if (tfoot !== null) { var cells = oSettings.aoFooter[0]; for (i = 0, ien = cells.length; i < ien; i++) { column = columns[i]; column.nTf = cells[i].cell; if (column.sClass) { $(column.nTf).addClass(column.sClass) } } } } function _fnDrawHead(oSettings, aoSource, bIncludeHidden) { var i, iLen, j, jLen, k, kLen, n, nLocalTr; var aoLocal = []; var aApplied = []; var iColumns = oSettings.aoColumns.length; var iRowspan, iColspan; if (!aoSource) { return } if (bIncludeHidden === undefined) { bIncludeHidden = false } for (i = 0, iLen = aoSource.length; i < iLen; i++) { aoLocal[i] = aoSource[i].slice(); aoLocal[i].nTr = aoSource[i].nTr; for (j = iColumns - 1; j >= 0; j--) { if (!oSettings.aoColumns[j].bVisible && !bIncludeHidden) { aoLocal[i].splice(j, 1) } } aApplied.push([]) } for (i = 0, iLen = aoLocal.length; i < iLen; i++) { nLocalTr = aoLocal[i].nTr; if (nLocalTr) { while ((n = nLocalTr.firstChild)) { nLocalTr.removeChild(n) } } for (j = 0, jLen = aoLocal[i].length; j < jLen; j++) { iRowspan = 1; iColspan = 1; if (aApplied[i][j] === undefined) { nLocalTr.appendChild(aoLocal[i][j].cell); aApplied[i][j] = 1; while (aoLocal[i + iRowspan] !== undefined && aoLocal[i][j].cell == aoLocal[i + iRowspan][j].cell) { aApplied[i + iRowspan][j] = 1; iRowspan++ } while (aoLocal[i][j + iColspan] !== undefined && aoLocal[i][j].cell == aoLocal[i][j + iColspan].cell) { for (k = 0; k < iRowspan; k++) { aApplied[i + k][j + iColspan] = 1 } iColspan++ } $(aoLocal[i][j].cell).attr('rowspan', iRowspan).attr('colspan', iColspan) } } } } function _fnDraw(oSettings) { var aPreDraw = _fnCallbackFire(oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings]); if ($.inArray(false, aPreDraw) !== -1) { _fnProcessingDisplay(oSettings, false); return } var i, iLen, n; var anRows = []; var iRowCount = 0; var asStripeClasses = oSettings.asStripeClasses; var iStripes = asStripeClasses.length; var iOpenRows = oSettings.aoOpenRows.length; var oLang = oSettings.oLanguage; var iInitDisplayStart = oSettings.iInitDisplayStart; var bServerSide = _fnDataSource(oSettings) == 'ssp'; var aiDisplay = oSettings.aiDisplay; oSettings.bDrawing = true; if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) { oSettings._iDisplayStart = bServerSide ? iInitDisplayStart : iInitDisplayStart >= oSettings.fnRecordsDisplay() ? 0 : iInitDisplayStart; oSettings.iInitDisplayStart = -1 } var iDisplayStart = oSettings._iDisplayStart; var iDisplayEnd = oSettings.fnDisplayEnd(); if (oSettings.bDeferLoading) { oSettings.bDeferLoading = false; oSettings.iDraw++; _fnProcessingDisplay(oSettings, false) } else if (!bServerSide) { oSettings.iDraw++ } else if (!oSettings.bDestroying && !_fnAjaxUpdate(oSettings)) { return } if (aiDisplay.length !== 0) { var iStart = bServerSide ? 0 : iDisplayStart; var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd; for (var j = iStart; j < iEnd; j++) { var iDataIndex = aiDisplay[j]; var aoData = oSettings.aoData[iDataIndex]; if (aoData.nTr === null) { _fnCreateTr(oSettings, iDataIndex) } var nRow = aoData.nTr; if (iStripes !== 0) { var sStripe = asStripeClasses[iRowCount % iStripes]; if (aoData._sRowStripe != sStripe) { $(nRow).removeClass(aoData._sRowStripe).addClass(sStripe); aoData._sRowStripe = sStripe } } _fnCallbackFire(oSettings, 'aoRowCallback', null, [nRow, aoData._aData, iRowCount, j]); anRows.push(nRow); iRowCount++ } } else { var sZero = oLang.sZeroRecords; if (oSettings.iDraw == 1 && _fnDataSource(oSettings) == 'ajax') { sZero = oLang.sLoadingRecords } else if (oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0) { sZero = oLang.sEmptyTable } anRows[0] = $('<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' }).append($('<td />', { 'valign': 'top', 'colSpan': _fnVisbleColumns(oSettings), 'class': oSettings.oClasses.sRowEmpty }).html(sZero))[0] } _fnCallbackFire(oSettings, 'aoHeaderCallback', 'header', [$(oSettings.nTHead).children('tr')[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]); _fnCallbackFire(oSettings, 'aoFooterCallback', 'footer', [$(oSettings.nTFoot).children('tr')[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]); var body = $(oSettings.nTBody); body.children().detach(); body.append($(anRows)); _fnCallbackFire(oSettings, 'aoDrawCallback', 'draw', [oSettings]); oSettings.bSorted = false; oSettings.bFiltered = false; oSettings.bDrawing = false } function _fnReDraw(settings, holdPosition) { var features = settings.oFeatures, sort = features.bSort, filter = features.bFilter; if (sort) { _fnSort(settings) } if (filter) { _fnFilterComplete(settings, settings.oPreviousSearch) } else { settings.aiDisplay = settings.aiDisplayMaster.slice() } if (holdPosition !== true) { settings._iDisplayStart = 0 } settings._drawHold = holdPosition; _fnDraw(settings); settings._drawHold = false } function _fnAddOptionsHtml(oSettings) { var classes = oSettings.oClasses; var table = $(oSettings.nTable); var holding = $('<div/>').insertBefore(table); var features = oSettings.oFeatures; var insert = $('<div/>', { id: oSettings.sTableId + '_wrapper', 'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' ' + classes.sNoFooter) }); oSettings.nHolding = holding[0]; oSettings.nTableWrapper = insert[0]; oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling; var aDom = oSettings.sDom.split(''); var featureNode, cOption, nNewNode, cNext, sAttr, j; for (var i = 0; i < aDom.length; i++) { featureNode = null; cOption = aDom[i]; if (cOption == '<') { nNewNode = $('<div/>')[0]; cNext = aDom[i + 1]; if (cNext == "'" || cNext == '"') { sAttr = ""; j = 2; while (aDom[i + j] != cNext) { sAttr += aDom[i + j]; j++ } if (sAttr == "H") { sAttr = classes.sJUIHeader } else if (sAttr == "F") { sAttr = classes.sJUIFooter } if (sAttr.indexOf('.') != -1) { var aSplit = sAttr.split('.'); nNewNode.id = aSplit[0].substr(1, aSplit[0].length - 1); nNewNode.className = aSplit[1] } else if (sAttr.charAt(0) == "#") { nNewNode.id = sAttr.substr(1, sAttr.length - 1) } else { nNewNode.className = sAttr } i += j } insert.append(nNewNode); insert = $(nNewNode) } else if (cOption == '>') { insert = insert.parent() } else if (cOption == 'l' && features.bPaginate && features.bLengthChange) { featureNode = _fnFeatureHtmlLength(oSettings) } else if (cOption == 'f' && features.bFilter) { featureNode = _fnFeatureHtmlFilter(oSettings) } else if (cOption == 'r' && features.bProcessing) { featureNode = _fnFeatureHtmlProcessing(oSettings) } else if (cOption == 't') { featureNode = _fnFeatureHtmlTable(oSettings) } else if (cOption == 'i' && features.bInfo) { featureNode = _fnFeatureHtmlInfo(oSettings) } else if (cOption == 'p' && features.bPaginate) { featureNode = _fnFeatureHtmlPaginate(oSettings) } else if (DataTable.ext.feature.length !== 0) { var aoFeatures = DataTable.ext.feature; for (var k = 0, kLen = aoFeatures.length; k < kLen; k++) { if (cOption == aoFeatures[k].cFeature) { featureNode = aoFeatures[k].fnInit(oSettings); break } } } if (featureNode) { var aanFeatures = oSettings.aanFeatures; if (!aanFeatures[cOption]) { aanFeatures[cOption] = [] } aanFeatures[cOption].push(featureNode); insert.append(featureNode) } } holding.replaceWith(insert); oSettings.nHolding = null } function _fnDetectHeader(aLayout, nThead) { var nTrs = $(nThead).children('tr'); var nTr, nCell; var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan; var bUnique; var fnShiftCol = function (a, i, j) { var k = a[i]; while (k[j]) { j++ } return j }; aLayout.splice(0, aLayout.length); for (i = 0, iLen = nTrs.length; i < iLen; i++) { aLayout.push([]) } for (i = 0, iLen = nTrs.length; i < iLen; i++) { nTr = nTrs[i]; iColumn = 0; nCell = nTr.firstChild; while (nCell) { if (nCell.nodeName.toUpperCase() == "TD" || nCell.nodeName.toUpperCase() == "TH") { iColspan = nCell.getAttribute('colspan') * 1; iRowspan = nCell.getAttribute('rowspan') * 1; iColspan = (!iColspan || iColspan === 0 || iColspan === 1) ? 1 : iColspan; iRowspan = (!iRowspan || iRowspan === 0 || iRowspan === 1) ? 1 : iRowspan; iColShifted = fnShiftCol(aLayout, i, iColumn); bUnique = iColspan === 1 ? true : false; for (l = 0; l < iColspan; l++) { for (k = 0; k < iRowspan; k++) { aLayout[i + k][iColShifted + l] = { "cell": nCell, "unique": bUnique }; aLayout[i + k].nTr = nTr } } } nCell = nCell.nextSibling } } } function _fnGetUniqueThs(oSettings, nHeader, aLayout) { var aReturn = []; if (!aLayout) { aLayout = oSettings.aoHeader; if (nHeader) { aLayout = []; _fnDetectHeader(aLayout, nHeader) } } for (var i = 0, iLen = aLayout.length; i < iLen; i++) { for (var j = 0, jLen = aLayout[i].length; j < jLen; j++) { if (aLayout[i][j].unique && (!aReturn[j] || !oSettings.bSortCellsTop)) { aReturn[j] = aLayout[i][j].cell } } } return aReturn } function _fnBuildAjax(oSettings, data, fn) { _fnCallbackFire(oSettings, 'aoServerParams', 'serverParams', [data]); if (data && $.isArray(data)) { var tmp = {}; var rbracket = /(.*?)\[\]$/; $.each(data, function (key, val) { var match = val.name.match(rbracket); if (match) { var name = match[0]; if (!tmp[name]) { tmp[name] = [] } tmp[name].push(val.value) } else { tmp[val.name] = val.value } }); data = tmp } var ajaxData; var ajax = oSettings.ajax; var instance = oSettings.oInstance; var callback = function (json) { _fnCallbackFire(oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR]); fn(json) }; if ($.isPlainObject(ajax) && ajax.data) { ajaxData = ajax.data; var newData = $.isFunction(ajaxData) ? ajaxData(data, oSettings) : ajaxData; data = $.isFunction(ajaxData) && newData ? newData : $.extend(true, data, newData); delete ajax.data } var baseAjax = { "data": data, "success": function (json) { var error = json.error || json.sError; if (error) { _fnLog(oSettings, 0, error) } oSettings.json = json; callback(json) }, "dataType": "json", "cache": false, "type": oSettings.sServerMethod, "error": function (xhr, error, thrown) { var ret = _fnCallbackFire(oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR]); if ($.inArray(true, ret) === -1) { if (error == "parsererror") { _fnLog(oSettings, 0, 'Invalid JSON response', 1) } else if (xhr.readyState === 4) { _fnLog(oSettings, 0, 'Ajax error', 7) } } _fnProcessingDisplay(oSettings, false) } }; oSettings.oAjaxData = data; _fnCallbackFire(oSettings, null, 'preXhr', [oSettings, data]); if (oSettings.fnServerData) { oSettings.fnServerData.call(instance, oSettings.sAjaxSource, $.map(data, function (val, key) { return { name: key, value: val } }), callback, oSettings) } else if (oSettings.sAjaxSource || typeof ajax === 'string') { oSettings.jqXHR = $.ajax($.extend(baseAjax, { url: ajax || oSettings.sAjaxSource })) } else if ($.isFunction(ajax)) { oSettings.jqXHR = ajax.call(instance, data, callback, oSettings) } else { oSettings.jqXHR = $.ajax($.extend(baseAjax, ajax)); ajax.data = ajaxData } } function _fnAjaxUpdate(settings) { if (settings.bAjaxDataGet) { settings.iDraw++; _fnProcessingDisplay(settings, true); _fnBuildAjax(settings, _fnAjaxParameters(settings), function (json) { _fnAjaxUpdateDraw(settings, json) }); return false } return true } function _fnAjaxParameters(settings) { var columns = settings.aoColumns, columnCount = columns.length, features = settings.oFeatures, preSearch = settings.oPreviousSearch, preColSearch = settings.aoPreSearchCols, i, data = [], dataProp, column, columnSearch, sort = _fnSortFlatten(settings), displayStart = settings._iDisplayStart, displayLength = features.bPaginate !== false ? settings._iDisplayLength : -1; var param = function (name, value) { data.push({ 'name': name, 'value': value }) }; param('sEcho', settings.iDraw); param('iColumns', columnCount); param('sColumns', _pluck(columns, 'sName').join(',')); param('iDisplayStart', displayStart); param('iDisplayLength', displayLength); var d = { draw: settings.iDraw, columns: [], order: [], start: displayStart, length: displayLength, search: { value: preSearch.sSearch, regex: preSearch.bRegex } }; for (i = 0; i < columnCount; i++) { column = columns[i]; columnSearch = preColSearch[i]; dataProp = typeof column.mData == "function" ? 'function' : column.mData; d.columns.push({ data: dataProp, name: column.sName, searchable: column.bSearchable, orderable: column.bSortable, search: { value: columnSearch.sSearch, regex: columnSearch.bRegex } }); param("mDataProp_" + i, dataProp); if (features.bFilter) { param('sSearch_' + i, columnSearch.sSearch); param('bRegex_' + i, columnSearch.bRegex); param('bSearchable_' + i, column.bSearchable) } if (features.bSort) { param('bSortable_' + i, column.bSortable) } } if (features.bFilter) { param('sSearch', preSearch.sSearch); param('bRegex', preSearch.bRegex) } if (features.bSort) { $.each(sort, function (i, val) { d.order.push({ column: val.col, dir: val.dir }); param('iSortCol_' + i, val.col); param('sSortDir_' + i, val.dir) }); param('iSortingCols', sort.length) } var legacy = DataTable.ext.legacy.ajax; if (legacy === null) { return settings.sAjaxSource ? data : d } return legacy ? data : d } function _fnAjaxUpdateDraw(settings, json) { var compat = function (old, modern) { return json[old] !== undefined ? json[old] : json[modern] }; var data = _fnAjaxDataSrc(settings, json); var draw = compat('sEcho', 'draw'); var recordsTotal = compat('iTotalRecords', 'recordsTotal'); var recordsFiltered = compat('iTotalDisplayRecords', 'recordsFiltered'); if (draw) { if (draw * 1 < settings.iDraw) { return } settings.iDraw = draw * 1 } _fnClearTable(settings); settings._iRecordsTotal = parseInt(recordsTotal, 10); settings._iRecordsDisplay = parseInt(recordsFiltered, 10); for (var i = 0, ien = data.length; i < ien; i++) { _fnAddData(settings, data[i]) } settings.aiDisplay = settings.aiDisplayMaster.slice(); settings.bAjaxDataGet = false; _fnDraw(settings); if (!settings._bInitComplete) { _fnInitComplete(settings, json) } settings.bAjaxDataGet = true; _fnProcessingDisplay(settings, false) } function _fnAjaxDataSrc(oSettings, json) { var dataSrc = $.isPlainObject(oSettings.ajax) && oSettings.ajax.dataSrc !== undefined ? oSettings.ajax.dataSrc : oSettings.sAjaxDataProp; if (dataSrc === 'data') { return json.aaData || json[dataSrc] } return dataSrc !== "" ? _fnGetObjectDataFn(dataSrc)(json) : json } function _fnFeatureHtmlFilter(settings) { var classes = settings.oClasses; var tableId = settings.sTableId; var language = settings.oLanguage; var previousSearch = settings.oPreviousSearch; var features = settings.aanFeatures; var input = '<input type="search" class="' + classes.sFilterInput + '"/>'; var str = language.sSearch; str = str.match(/_INPUT_/) ? str.replace('_INPUT_', input) : str + input; var filter = $('<div/>', { 'id': !features.f ? tableId + '_filter' : null, 'class': classes.sFilter }).append($('<label/>').append(str)); var searchFn = function () { var n = features.f; var val = !this.value ? "" : this.value; if (val != previousSearch.sSearch) { _fnFilterComplete(settings, { "sSearch": val, "bRegex": previousSearch.bRegex, "bSmart": previousSearch.bSmart, "bCaseInsensitive": previousSearch.bCaseInsensitive }); settings._iDisplayStart = 0; _fnDraw(settings) } }; var searchDelay = settings.searchDelay !== null ? settings.searchDelay : _fnDataSource(settings) === 'ssp' ? 400 : 0; var jqFilter = $('input', filter).val(previousSearch.sSearch).attr('placeholder', language.sSearchPlaceholder).bind('keyup.DT search.DT input.DT paste.DT cut.DT', searchDelay ? _fnThrottle(searchFn, searchDelay) : searchFn).bind('keypress.DT', function (e) { if (e.keyCode == 13) { return false } }).attr('aria-controls', tableId); $(settings.nTable).on('search.dt.DT', function (ev, s) { if (settings === s) { try { if (jqFilter[0] !== document.activeElement) { jqFilter.val(previousSearch.sSearch) } } catch (e) { } } }); return filter[0] } function _fnFilterComplete(oSettings, oInput, iForce) { var oPrevSearch = oSettings.oPreviousSearch; var aoPrevSearch = oSettings.aoPreSearchCols; var fnSaveFilter = function (oFilter) { oPrevSearch.sSearch = oFilter.sSearch; oPrevSearch.bRegex = oFilter.bRegex; oPrevSearch.bSmart = oFilter.bSmart; oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive }; var fnRegex = function (o) { return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex }; _fnColumnTypes(oSettings); if (_fnDataSource(oSettings) != 'ssp') { _fnFilter(oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive); fnSaveFilter(oInput); for (var i = 0; i < aoPrevSearch.length; i++) { _fnFilterColumn(oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]), aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive) } _fnFilterCustom(oSettings) } else { fnSaveFilter(oInput) } oSettings.bFiltered = true; _fnCallbackFire(oSettings, null, 'search', [oSettings]) } function _fnFilterCustom(settings) { var filters = DataTable.ext.search; var displayRows = settings.aiDisplay; var row, rowIdx; for (var i = 0, ien = filters.length; i < ien; i++) { var rows = []; for (var j = 0, jen = displayRows.length; j < jen; j++) { rowIdx = displayRows[j]; row = settings.aoData[rowIdx]; if (filters[i](settings, row._aFilterData, rowIdx, row._aData, j)) { rows.push(rowIdx) } } displayRows.length = 0; $.merge(displayRows, rows) } } function _fnFilterColumn(settings, searchStr, colIdx, regex, smart, caseInsensitive) { if (searchStr === '') { return } var data; var display = settings.aiDisplay; var rpSearch = _fnFilterCreateSearch(searchStr, regex, smart, caseInsensitive); for (var i = display.length - 1; i >= 0; i--) { data = settings.aoData[display[i]]._aFilterData[colIdx]; if (!rpSearch.test(data)) { display.splice(i, 1) } } } function _fnFilter(settings, input, force, regex, smart, caseInsensitive) { var rpSearch = _fnFilterCreateSearch(input, regex, smart, caseInsensitive); var prevSearch = settings.oPreviousSearch.sSearch; var displayMaster = settings.aiDisplayMaster; var display, invalidated, i; if (DataTable.ext.search.length !== 0) { force = true } invalidated = _fnFilterData(settings); if (input.length <= 0) { settings.aiDisplay = displayMaster.slice() } else { if (invalidated || force || prevSearch.length > input.length || input.indexOf(prevSearch) !== 0 || settings.bSorted) { settings.aiDisplay = displayMaster.slice() } display = settings.aiDisplay; for (i = display.length - 1; i >= 0; i--) { if (!rpSearch.test(settings.aoData[display[i]]._sFilterRow)) { display.splice(i, 1) } } } } function _fnFilterCreateSearch(search, regex, smart, caseInsensitive) { search = regex ? search : _fnEscapeRegex(search); if (smart) { var a = $.map(search.match(/"[^"]+"|[^ ]+/g) || [''], function (word) { if (word.charAt(0) === '"') { var m = word.match(/^"(.*)"$/); word = m ? m[1] : word } return word.replace('"', '') }); search = '^(?=.*?' + a.join(')(?=.*?') + ').*$' } return new RegExp(search, caseInsensitive ? 'i' : '') } function _fnEscapeRegex(sVal) { return sVal.replace(_re_escape_regex, '\\$1') } var __filter_div = $('<div>')[0]; var __filter_div_textContent = __filter_div.textContent !== undefined; function _fnFilterData(settings) { var columns = settings.aoColumns; var column; var i, j, ien, jen, filterData, cellData, row; var fomatters = DataTable.ext.type.search; var wasInvalidated = false; for (i = 0, ien = settings.aoData.length; i < ien; i++) { row = settings.aoData[i]; if (!row._aFilterData) { filterData = []; for (j = 0, jen = columns.length; j < jen; j++) { column = columns[j]; if (column.bSearchable) { cellData = _fnGetCellData(settings, i, j, 'filter'); if (fomatters[column.sType]) { cellData = fomatters[column.sType](cellData) } if (cellData === null) { cellData = '' } if (typeof cellData !== 'string' && cellData.toString) { cellData = cellData.toString() } } else { cellData = '' } if (cellData.indexOf && cellData.indexOf('&') !== -1) { __filter_div.innerHTML = cellData; cellData = __filter_div_textContent ? __filter_div.textContent : __filter_div.innerText } if (cellData.replace) { cellData = cellData.replace(/[\r\n]/g, '') } filterData.push(cellData) } row._aFilterData = filterData; row._sFilterRow = filterData.join('  '); wasInvalidated = true } } return wasInvalidated } function _fnSearchToCamel(obj) { return { search: obj.sSearch, smart: obj.bSmart, regex: obj.bRegex, caseInsensitive: obj.bCaseInsensitive } } function _fnSearchToHung(obj) { return { sSearch: obj.search, bSmart: obj.smart, bRegex: obj.regex, bCaseInsensitive: obj.caseInsensitive } } function _fnFeatureHtmlInfo(settings) { var tid = settings.sTableId, nodes = settings.aanFeatures.i, n = $('<div/>', { 'class': settings.oClasses.sInfo, 'id': !nodes ? tid + '_info' : null }); if (!nodes) { settings.aoDrawCallback.push({ "fn": _fnUpdateInfo, "sName": "information" }); n.attr('role', 'status').attr('aria-live', 'polite'); $(settings.nTable).attr('aria-describedby', tid + '_info') } return n[0] } function _fnUpdateInfo(settings) { var nodes = settings.aanFeatures.i; if (nodes.length === 0) { return } var lang = settings.oLanguage, start = settings._iDisplayStart + 1, end = settings.fnDisplayEnd(), max = settings.fnRecordsTotal(), total = settings.fnRecordsDisplay(), out = total ? lang.sInfo : lang.sInfoEmpty; if (total !== max) { out += ' ' + lang.sInfoFiltered } out += lang.sInfoPostFix; out = _fnInfoMacros(settings, out); var callback = lang.fnInfoCallback; if (callback !== null) { out = callback.call(settings.oInstance, settings, start, end, max, total, out) } $(nodes).html(out) } function _fnInfoMacros(settings, str) { var formatter = settings.fnFormatNumber, start = settings._iDisplayStart + 1, len = settings._iDisplayLength, vis = settings.fnRecordsDisplay(), all = len === -1; return str.replace(/_START_/g, formatter.call(settings, start)).replace(/_END_/g, formatter.call(settings, settings.fnDisplayEnd())).replace(/_MAX_/g, formatter.call(settings, settings.fnRecordsTotal())).replace(/_TOTAL_/g, formatter.call(settings, vis)).replace(/_PAGE_/g, formatter.call(settings, all ? 1 : Math.ceil(start / len))).replace(/_PAGES_/g, formatter.call(settings, all ? 1 : Math.ceil(vis / len))) } function _fnInitialise(settings) { var i, iLen, iAjaxStart = settings.iInitDisplayStart; var columns = settings.aoColumns, column; var features = settings.oFeatures; var deferLoading = settings.bDeferLoading; if (!settings.bInitialised) { setTimeout(function () { _fnInitialise(settings) }, 200); return } _fnAddOptionsHtml(settings); _fnBuildHead(settings); _fnDrawHead(settings, settings.aoHeader); _fnDrawHead(settings, settings.aoFooter); _fnProcessingDisplay(settings, true); if (features.bAutoWidth) { _fnCalculateColumnWidths(settings) } for (i = 0, iLen = columns.length; i < iLen; i++) { column = columns[i]; if (column.sWidth) { column.nTh.style.width = _fnStringToCss(column.sWidth) } } _fnCallbackFire(settings, null, 'preInit', [settings]); _fnReDraw(settings); var dataSrc = _fnDataSource(settings); if (dataSrc != 'ssp' || deferLoading) { if (dataSrc == 'ajax') { _fnBuildAjax(settings, [], function (json) { var aData = _fnAjaxDataSrc(settings, json); for (i = 0; i < aData.length; i++) { _fnAddData(settings, aData[i]) } settings.iInitDisplayStart = iAjaxStart; _fnReDraw(settings); _fnProcessingDisplay(settings, false); _fnInitComplete(settings, json) }, settings) } else { _fnProcessingDisplay(settings, false); _fnInitComplete(settings) } } } function _fnInitComplete(settings, json) { settings._bInitComplete = true; if (json || settings.oInit.aaData) { _fnAdjustColumnSizing(settings) } _fnCallbackFire(settings, null, 'plugin-init', [settings, json]); _fnCallbackFire(settings, 'aoInitComplete', 'init', [settings, json]) } function _fnLengthChange(settings, val) { var len = parseInt(val, 10); settings._iDisplayLength = len; _fnLengthOverflow(settings); _fnCallbackFire(settings, null, 'length', [settings, len]) } function _fnFeatureHtmlLength(settings) { var classes = settings.oClasses, tableId = settings.sTableId, menu = settings.aLengthMenu, d2 = $.isArray(menu[0]), lengths = d2 ? menu[0] : menu, language = d2 ? menu[1] : menu; var select = $('<select/>', { 'name': tableId + '_length', 'aria-controls': tableId, 'class': classes.sLengthSelect }); for (var i = 0, ien = lengths.length; i < ien; i++) { select[0][i] = new Option(language[i], lengths[i]) } var div = $('<div><label/></div>').addClass(classes.sLength); if (!settings.aanFeatures.l) { div[0].id = tableId + '_length' } div.children().append(settings.oLanguage.sLengthMenu.replace('_MENU_', select[0].outerHTML)); $('select', div).val(settings._iDisplayLength).bind('change.DT', function (e) { _fnLengthChange(settings, $(this).val()); _fnDraw(settings) }); $(settings.nTable).bind('length.dt.DT', function (e, s, len) { if (settings === s) { $('select', div).val(len) } }); return div[0] } function _fnFeatureHtmlPaginate(settings) { var type = settings.sPaginationType, plugin = DataTable.ext.pager[type], modern = typeof plugin === 'function', redraw = function (settings) { _fnDraw(settings) }, node = $('<div/>').addClass(settings.oClasses.sPaging + type)[0], features = settings.aanFeatures; if (!modern) { plugin.fnInit(settings, node, redraw) } if (!features.p) { node.id = settings.sTableId + '_paginate'; settings.aoDrawCallback.push({ "fn": function (settings) { if (modern) { var start = settings._iDisplayStart, len = settings._iDisplayLength, visRecords = settings.fnRecordsDisplay(), all = len === -1, page = all ? 0 : Math.ceil(start / len), pages = all ? 1 : Math.ceil(visRecords / len), buttons = plugin(page, pages), i, ien; for (i = 0, ien = features.p.length; i < ien; i++) { _fnRenderer(settings, 'pageButton')(settings, features.p[i], i, buttons, page, pages) } } else { plugin.fnUpdate(settings, redraw) } }, "sName": "pagination" }) } return node } function _fnPageChange(settings, action, redraw) { var start = settings._iDisplayStart, len = settings._iDisplayLength, records = settings.fnRecordsDisplay(); if (records === 0 || len === -1) { start = 0 } else if (typeof action === "number") { start = action * len; if (start > records) { start = 0 } } else if (action == "first") { start = 0 } else if (action == "previous") { start = len >= 0 ? start - len : 0; if (start < 0) { start = 0 } } else if (action == "next") { if (start + len < records) { start += len } } else if (action == "last") { start = Math.floor((records - 1) / len) * len } else { _fnLog(settings, 0, "Unknown paging action: " + action, 5) } var changed = settings._iDisplayStart !== start; settings._iDisplayStart = start; if (changed) { _fnCallbackFire(settings, null, 'page', [settings]); if (redraw) { _fnDraw(settings) } } return changed } function _fnFeatureHtmlProcessing(settings) { Loading(true); } function Loading(bool) {
//        var ajaxbg = top.$("#loading");
//        top.$("#loading").css("left", (top.$('body').width() - top.$("#loading").width()) / 2);
//        if (bool) {
//            ajaxbg.show();
//        } else {
//            ajaxbg.hide();
//        }
//    } function _fnProcessingDisplay(settings, show) {
//        Loading(false);
//    } function _fnFeatureHtmlTable(settings) { var table = $(settings.nTable); table.attr('role', 'grid'); var scroll = settings.oScroll; if (scroll.sX === '' && scroll.sY === '') { return settings.nTable } var scrollX = scroll.sX; var scrollY = scroll.sY; var classes = settings.oClasses; var caption = table.children('caption'); var captionSide = caption.length ? caption[0]._captionSide : null; var headerClone = $(table[0].cloneNode(false)); var footerClone = $(table[0].cloneNode(false)); var footer = table.children('tfoot'); var _div = '<div/>'; var size = function (s) { return !s ? null : _fnStringToCss(s) }; if (!footer.length) { footer = null } var scroller = $(_div, { 'class': classes.sScrollWrapper }).append($(_div, { 'class': classes.sScrollHead }).css({ overflow: 'hidden', position: 'relative', border: 0, width: scrollX ? size(scrollX) : '100%' }).append($(_div, { 'class': classes.sScrollHeadInner }).css({ 'box-sizing': 'content-box', width: scroll.sXInner || '100%' }).append(headerClone.removeAttr('id').css('margin-left', 0).append(captionSide === 'top' ? caption : null).append(table.children('thead'))))).append($(_div, { 'class': classes.sScrollBody }).css({ position: 'relative', overflow: 'auto', width: size(scrollX) }).append(table)); if (footer) { scroller.append($(_div, { 'class': classes.sScrollFoot }).css({ overflow: 'hidden', border: 0, width: scrollX ? size(scrollX) : '100%' }).append($(_div, { 'class': classes.sScrollFootInner }).append(footerClone.removeAttr('id').css('margin-left', 0).append(captionSide === 'bottom' ? caption : null).append(table.children('tfoot'))))) } var children = scroller.children(); var scrollHead = children[0]; var scrollBody = children[1]; var scrollFoot = footer ? children[2] : null; if (scrollX) { $(scrollBody).on('scroll.DT', function (e) { var scrollLeft = this.scrollLeft; scrollHead.scrollLeft = scrollLeft; if (footer) { scrollFoot.scrollLeft = scrollLeft } }) } $(scrollBody).css(scrollY && scroll.bCollapse ? 'max-height' : 'height', scrollY); settings.nScrollHead = scrollHead; settings.nScrollBody = scrollBody; settings.nScrollFoot = scrollFoot; settings.aoDrawCallback.push({ "fn": _fnScrollDraw, "sName": "scrolling" }); return scroller[0] } function _fnScrollDraw(settings) { var scroll = settings.oScroll, scrollX = scroll.sX, scrollXInner = scroll.sXInner, scrollY = scroll.sY, barWidth = scroll.iBarWidth, divHeader = $(settings.nScrollHead), divHeaderStyle = divHeader[0].style, divHeaderInner = divHeader.children('div'), divHeaderInnerStyle = divHeaderInner[0].style, divHeaderTable = divHeaderInner.children('table'), divBodyEl = settings.nScrollBody, divBody = $(divBodyEl), divBodyStyle = divBodyEl.style, divFooter = $(settings.nScrollFoot), divFooterInner = divFooter.children('div'), divFooterTable = divFooterInner.children('table'), header = $(settings.nTHead), table = $(settings.nTable), tableEl = table[0], tableStyle = tableEl.style, footer = settings.nTFoot ? $(settings.nTFoot) : null, browser = settings.oBrowser, ie67 = browser.bScrollOversize, headerTrgEls, footerTrgEls, headerSrcEls, footerSrcEls, headerCopy, footerCopy, headerWidths = [], footerWidths = [], headerContent = [], idx, correction, sanityWidth, zeroOut = function (nSizer) { var style = nSizer.style; style.paddingTop = "0"; style.paddingBottom = "0"; style.borderTopWidth = "0"; style.borderBottomWidth = "0"; style.height = 0 }; var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight; if (settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined) { settings.scrollBarVis = scrollBarVis; _fnAdjustColumnSizing(settings); return } else { settings.scrollBarVis = scrollBarVis } table.children('thead, tfoot').remove(); headerCopy = header.clone().prependTo(table); headerTrgEls = header.find('tr'); headerSrcEls = headerCopy.find('tr'); headerCopy.find('th, td').removeAttr('tabindex'); if (footer) { footerCopy = footer.clone().prependTo(table); footerTrgEls = footer.find('tr'); footerSrcEls = footerCopy.find('tr') } if (!scrollX) { divBodyStyle.width = '100%'; divHeader[0].style.width = '100%' } $.each(_fnGetUniqueThs(settings, headerCopy), function (i, el) { idx = _fnVisibleToColumnIndex(settings, i); el.style.width = settings.aoColumns[idx].sWidth }); if (footer) { _fnApplyToChildren(function (n) { n.style.width = "" }, footerSrcEls) } sanityWidth = table.outerWidth(); if (scrollX === "") { tableStyle.width = "100%"; if (ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) { tableStyle.width = _fnStringToCss(table.outerWidth() - barWidth) } sanityWidth = table.outerWidth() } else if (scrollXInner !== "") { tableStyle.width = _fnStringToCss(scrollXInner); sanityWidth = table.outerWidth() } _fnApplyToChildren(zeroOut, headerSrcEls); _fnApplyToChildren(function (nSizer) { headerContent.push(nSizer.innerHTML); headerWidths.push(_fnStringToCss($(nSizer).css('width'))) }, headerSrcEls); _fnApplyToChildren(function (nToSize, i) { nToSize.style.width = headerWidths[i] }, headerTrgEls); $(headerSrcEls).height(0); if (footer) { _fnApplyToChildren(zeroOut, footerSrcEls); _fnApplyToChildren(function (nSizer) { footerWidths.push(_fnStringToCss($(nSizer).css('width'))) }, footerSrcEls); _fnApplyToChildren(function (nToSize, i) { nToSize.style.width = footerWidths[i] }, footerTrgEls); $(footerSrcEls).height(0) } _fnApplyToChildren(function (nSizer, i) { nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + headerContent[i] + '</div>'; nSizer.style.width = headerWidths[i] }, headerSrcEls); if (footer) { _fnApplyToChildren(function (nSizer, i) { nSizer.innerHTML = ""; nSizer.style.width = footerWidths[i] }, footerSrcEls) } if (table.outerWidth() < sanityWidth) { correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) ? sanityWidth + barWidth : sanityWidth; if (ie67 && (divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) { tableStyle.width = _fnStringToCss(correction - barWidth) } if (scrollX === "" || scrollXInner !== "") { _fnLog(settings, 1, 'Possible column misalignment', 6) } } else { correction = '100%' } divBodyStyle.width = _fnStringToCss(correction); divHeaderStyle.width = _fnStringToCss(correction); if (footer) { settings.nScrollFoot.style.width = _fnStringToCss(correction) } if (!scrollY) { if (ie67) { divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + barWidth) } } var iOuterWidth = table.outerWidth(); divHeaderTable[0].style.width = _fnStringToCss(iOuterWidth); divHeaderInnerStyle.width = _fnStringToCss(iOuterWidth); var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll"; var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right'); divHeaderInnerStyle[padding] = bScrolling ? barWidth + "px" : "0px"; if (footer) { divFooterTable[0].style.width = _fnStringToCss(iOuterWidth); divFooterInner[0].style.width = _fnStringToCss(iOuterWidth); divFooterInner[0].style[padding] = bScrolling ? barWidth + "px" : "0px" } divBody.scroll(); if ((settings.bSorted || settings.bFiltered) && !settings._drawHold) { divBodyEl.scrollTop = 0 } } function _fnApplyToChildren(fn, an1, an2) { var index = 0, i = 0, iLen = an1.length; var nNode1, nNode2; while (i < iLen) { nNode1 = an1[i].firstChild; nNode2 = an2 ? an2[i].firstChild : null; while (nNode1) { if (nNode1.nodeType === 1) { if (an2) { fn(nNode1, nNode2, index) } else { fn(nNode1, index) } index++ } nNode1 = nNode1.nextSibling; nNode2 = an2 ? nNode2.nextSibling : null } i++ } } var __re_html_remove = /<.*?>/g; function _fnCalculateColumnWidths(oSettings) { var table = oSettings.nTable, columns = oSettings.aoColumns, scroll = oSettings.oScroll, scrollY = scroll.sY, scrollX = scroll.sX, scrollXInner = scroll.sXInner, columnCount = columns.length, visibleColumns = _fnGetColumns(oSettings, 'bVisible'), headerCells = $('th', oSettings.nTHead), tableWidthAttr = table.getAttribute('width'), tableContainer = table.parentNode, userInputs = false, i, column, columnIdx, width, outerWidth, browser = oSettings.oBrowser, ie67 = browser.bScrollOversize; var styleWidth = table.style.width; if (styleWidth && styleWidth.indexOf('%') !== -1) { tableWidthAttr = styleWidth } for (i = 0; i < visibleColumns.length; i++) { column = columns[visibleColumns[i]]; if (column.sWidth !== null) { column.sWidth = _fnConvertToWidth(column.sWidthOrig, tableContainer); userInputs = true } } if (ie67 || !userInputs && !scrollX && !scrollY && columnCount == _fnVisbleColumns(oSettings) && columnCount == headerCells.length) { for (i = 0; i < columnCount; i++) { var colIdx = _fnVisibleToColumnIndex(oSettings, i); if (colIdx !== null) { columns[colIdx].sWidth = _fnStringToCss(headerCells.eq(i).width()) } } } else { var tmpTable = $(table).clone().css('visibility', 'hidden').removeAttr('id'); tmpTable.find('tbody tr').remove(); var tr = $('<tr/>').appendTo(tmpTable.find('tbody')); tmpTable.find('thead, tfoot').remove(); tmpTable.append($(oSettings.nTHead).clone()).append($(oSettings.nTFoot).clone()); tmpTable.find('tfoot th, tfoot td').css('width', ''); headerCells = _fnGetUniqueThs(oSettings, tmpTable.find('thead')[0]); for (i = 0; i < visibleColumns.length; i++) { column = columns[visibleColumns[i]]; headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ? _fnStringToCss(column.sWidthOrig) : ''; if (column.sWidthOrig && scrollX) { $(headerCells[i]).append($('<div/>').css({ width: column.sWidthOrig, margin: 0, padding: 0, border: 0, height: 1 })) } } if (oSettings.aoData.length) { for (i = 0; i < visibleColumns.length; i++) { columnIdx = visibleColumns[i]; column = columns[columnIdx]; $(_fnGetWidestNode(oSettings, columnIdx)).clone(false).append(column.sContentPadding).appendTo(tr) } } var holder = $('<div/>').css(scrollX || scrollY ? { position: 'absolute', top: 0, left: 0, height: 1, right: 0, overflow: 'hidden' } : {}).append(tmpTable).appendTo(tableContainer); if (scrollX && scrollXInner) { tmpTable.width(scrollXInner) } else if (scrollX) { tmpTable.css('width', 'auto'); tmpTable.removeAttr('width'); if (tmpTable.width() < tableContainer.clientWidth && tableWidthAttr) { tmpTable.width(tableContainer.clientWidth) } } else if (scrollY) { tmpTable.width(tableContainer.clientWidth) } else if (tableWidthAttr) { tmpTable.width(tableWidthAttr) } var total = 0; for (i = 0; i < visibleColumns.length; i++) { var cell = $(headerCells[i]); var border = cell.outerWidth() - cell.width(); var bounding = browser.bBounding ? Math.ceil(headerCells[i].getBoundingClientRect().width) : cell.outerWidth(); total += bounding; columns[visibleColumns[i]].sWidth = _fnStringToCss(bounding - border) } table.style.width = _fnStringToCss(total); holder.remove() } if (tableWidthAttr) { table.style.width = _fnStringToCss(tableWidthAttr) } if ((tableWidthAttr || scrollX) && !oSettings._reszEvt) { var bindResize = function () { $(window).bind('resize.DT-' + oSettings.sInstance, _fnThrottle(function () { _fnAdjustColumnSizing(oSettings) })) }; if (ie67) { setTimeout(bindResize, 1000) } else { bindResize() } oSettings._reszEvt = true } } function _fnThrottle(fn, freq) { var frequency = freq !== undefined ? freq : 200, last, timer; return function () { var that = this, now = +new Date(), args = arguments; if (last && now < last + frequency) { clearTimeout(timer); timer = setTimeout(function () { last = undefined; fn.apply(that, args) }, frequency) } else { last = now; fn.apply(that, args) } } } function _fnConvertToWidth(width, parent) { if (!width) { return 0 } var n = $('<div/>').css('width', _fnStringToCss(width)).appendTo(parent || document.body); var val = n[0].offsetWidth; n.remove(); return val } function _fnGetWidestNode(settings, colIdx) { var idx = _fnGetMaxLenString(settings, colIdx); if (idx < 0) { return null } var data = settings.aoData[idx]; return !data.nTr ? $('<td/>').html(_fnGetCellData(settings, idx, colIdx, 'display'))[0] : data.anCells[colIdx] } function _fnGetMaxLenString(settings, colIdx) { var s, max = -1, maxIdx = -1; for (var i = 0, ien = settings.aoData.length; i < ien; i++) { s = _fnGetCellData(settings, i, colIdx, 'display') + ''; s = s.replace(__re_html_remove, ''); s = s.replace(/&nbsp;/g, ' '); if (s.length > max) { max = s.length; maxIdx = i } } return maxIdx } function _fnStringToCss(s) { if (s === null) { return '0px' } if (typeof s == 'number') { return s < 0 ? '0px' : s + 'px' } return s.match(/\d$/) ? s + 'px' : s } function _fnSortFlatten(settings) { var i, iLen, k, kLen, aSort = [], aiOrig = [], aoColumns = settings.aoColumns, aDataSort, iCol, sType, srcCol, fixed = settings.aaSortingFixed, fixedObj = $.isPlainObject(fixed), nestedSort = [], add = function (a) { if (a.length && !$.isArray(a[0])) { nestedSort.push(a) } else { $.merge(nestedSort, a) } }; if ($.isArray(fixed)) { add(fixed) } if (fixedObj && fixed.pre) { add(fixed.pre) } add(settings.aaSorting); if (fixedObj && fixed.post) { add(fixed.post) } for (i = 0; i < nestedSort.length; i++) { srcCol = nestedSort[i][0]; aDataSort = aoColumns[srcCol].aDataSort; for (k = 0, kLen = aDataSort.length; k < kLen; k++) { iCol = aDataSort[k]; sType = aoColumns[iCol].sType || 'string'; if (nestedSort[i]._idx === undefined) { nestedSort[i]._idx = $.inArray(nestedSort[i][1], aoColumns[iCol].asSorting) } aSort.push({ src: srcCol, col: iCol, dir: nestedSort[i][1], index: nestedSort[i]._idx, type: sType, formatter: DataTable.ext.type.order[sType + "-pre"] }) } } return aSort } function _fnSort(oSettings) { var i, ien, iLen, j, jLen, k, kLen, sDataType, nTh, aiOrig = [], oExtSort = DataTable.ext.type.order, aoData = oSettings.aoData, aoColumns = oSettings.aoColumns, aDataSort, data, iCol, sType, oSort, formatters = 0, sortCol, displayMaster = oSettings.aiDisplayMaster, aSort; _fnColumnTypes(oSettings); aSort = _fnSortFlatten(oSettings); for (i = 0, ien = aSort.length; i < ien; i++) { sortCol = aSort[i]; if (sortCol.formatter) { formatters++ } _fnSortData(oSettings, sortCol.col) } if (_fnDataSource(oSettings) != 'ssp' && aSort.length !== 0) { for (i = 0, iLen = displayMaster.length; i < iLen; i++) { aiOrig[displayMaster[i]] = i } if (formatters === aSort.length) { displayMaster.sort(function (a, b) { var x, y, k, test, sort, len = aSort.length, dataA = aoData[a]._aSortData, dataB = aoData[b]._aSortData; for (k = 0; k < len; k++) { sort = aSort[k]; x = dataA[sort.col]; y = dataB[sort.col]; test = x < y ? -1 : x > y ? 1 : 0; if (test !== 0) { return sort.dir === 'asc' ? test : -test } } x = aiOrig[a]; y = aiOrig[b]; return x < y ? -1 : x > y ? 1 : 0 }) } else { displayMaster.sort(function (a, b) { var x, y, k, l, test, sort, fn, len = aSort.length, dataA = aoData[a]._aSortData, dataB = aoData[b]._aSortData; for (k = 0; k < len; k++) { sort = aSort[k]; x = dataA[sort.col]; y = dataB[sort.col]; fn = oExtSort[sort.type + "-" + sort.dir] || oExtSort["string-" + sort.dir]; test = fn(x, y); if (test !== 0) { return test } } x = aiOrig[a]; y = aiOrig[b]; return x < y ? -1 : x > y ? 1 : 0 }) } } oSettings.bSorted = true } function _fnSortAria(settings) { var label; var nextSort; var columns = settings.aoColumns; var aSort = _fnSortFlatten(settings); var oAria = settings.oLanguage.oAria; for (var i = 0, iLen = columns.length; i < iLen; i++) { var col = columns[i]; var asSorting = col.asSorting; var sTitle = col.sTitle.replace(/<.*?>/g, ""); var th = col.nTh; th.removeAttribute('aria-sort'); if (col.bSortable) { if (aSort.length > 0 && aSort[0].col == i) { th.setAttribute('aria-sort', aSort[0].dir == "asc" ? "ascending" : "descending"); nextSort = asSorting[aSort[0].index + 1] || asSorting[0] } else { nextSort = asSorting[0] } label = sTitle + (nextSort === "asc" ? oAria.sSortAscending : oAria.sSortDescending) } else { label = sTitle } th.setAttribute('aria-label', label) } } function _fnSortListener(settings, colIdx, append, callback) { var col = settings.aoColumns[colIdx]; var sorting = settings.aaSorting; var asSorting = col.asSorting; var nextSortIdx; var next = function (a, overflow) { var idx = a._idx; if (idx === undefined) { idx = $.inArray(a[1], asSorting) } return idx + 1 < asSorting.length ? idx + 1 : overflow ? null : 0 }; if (typeof sorting[0] === 'number') { sorting = settings.aaSorting = [sorting] } if (append && settings.oFeatures.bSortMulti) { var sortIdx = $.inArray(colIdx, _pluck(sorting, '0')); if (sortIdx !== -1) { nextSortIdx = next(sorting[sortIdx], true); if (nextSortIdx === null && sorting.length === 1) { nextSortIdx = 0 } if (nextSortIdx === null) { sorting.splice(sortIdx, 1) } else { sorting[sortIdx][1] = asSorting[nextSortIdx]; sorting[sortIdx]._idx = nextSortIdx } } else { sorting.push([colIdx, asSorting[0], 0]); sorting[sorting.length - 1]._idx = 0 } } else if (sorting.length && sorting[0][0] == colIdx) { nextSortIdx = next(sorting[0]); sorting.length = 1; sorting[0][1] = asSorting[nextSortIdx]; sorting[0]._idx = nextSortIdx } else { sorting.length = 0; sorting.push([colIdx, asSorting[0]]); sorting[0]._idx = 0 } _fnReDraw(settings); if (typeof callback == 'function') { callback(settings) } } function _fnSortAttachListener(settings, attachTo, colIdx, callback) { var col = settings.aoColumns[colIdx]; _fnBindAction(attachTo, {}, function (e) { if (col.bSortable === false) { return } if (settings.oFeatures.bProcessing) { _fnProcessingDisplay(settings, true); setTimeout(function () { _fnSortListener(settings, colIdx, e.shiftKey, callback); if (_fnDataSource(settings) !== 'ssp') { _fnProcessingDisplay(settings, false) } }, 0) } else { _fnSortListener(settings, colIdx, e.shiftKey, callback) } }) } function _fnSortingClasses(settings) { var oldSort = settings.aLastSort; var sortClass = settings.oClasses.sSortColumn; var sort = _fnSortFlatten(settings); var features = settings.oFeatures; var i, ien, colIdx; if (features.bSort && features.bSortClasses) { for (i = 0, ien = oldSort.length; i < ien; i++) { colIdx = oldSort[i].src; $(_pluck(settings.aoData, 'anCells', colIdx)).removeClass(sortClass + (i < 2 ? i + 1 : 3)) } for (i = 0, ien = sort.length; i < ien; i++) { colIdx = sort[i].src; $(_pluck(settings.aoData, 'anCells', colIdx)).addClass(sortClass + (i < 2 ? i + 1 : 3)) } } settings.aLastSort = sort } function _fnSortData(settings, idx) { var column = settings.aoColumns[idx]; var customSort = DataTable.ext.order[column.sSortDataType]; var customData; if (customSort) { customData = customSort.call(settings.oInstance, settings, idx, _fnColumnIndexToVisible(settings, idx)) } var row, cellData; var formatter = DataTable.ext.type.order[column.sType + "-pre"]; for (var i = 0, ien = settings.aoData.length; i < ien; i++) { row = settings.aoData[i]; if (!row._aSortData) { row._aSortData = [] } if (!row._aSortData[idx] || customSort) { cellData = customSort ? customData[i] : _fnGetCellData(settings, i, idx, 'sort'); row._aSortData[idx] = formatter ? formatter(cellData) : cellData } } } function _fnSaveState(settings) { if (!settings.oFeatures.bStateSave || settings.bDestroying) { return } var state = { time: +new Date(), start: settings._iDisplayStart, length: settings._iDisplayLength, order: $.extend(true, [], settings.aaSorting), search: _fnSearchToCamel(settings.oPreviousSearch), columns: $.map(settings.aoColumns, function (col, i) { return { visible: col.bVisible, search: _fnSearchToCamel(settings.aoPreSearchCols[i]) } }) }; _fnCallbackFire(settings, "aoStateSaveParams", 'stateSaveParams', [settings, state]); settings.oSavedState = state; settings.fnStateSaveCallback.call(settings.oInstance, settings, state) } function _fnLoadState(settings, oInit) { var i, ien; var columns = settings.aoColumns; if (!settings.oFeatures.bStateSave) { return } var state = settings.fnStateLoadCallback.call(settings.oInstance, settings); if (!state || !state.time) { return } var abStateLoad = _fnCallbackFire(settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state]); if ($.inArray(false, abStateLoad) !== -1) { return } var duration = settings.iStateDuration; if (duration > 0 && state.time < +new Date() - (duration * 1000)) { return } if (columns.length !== state.columns.length) { return } settings.oLoadedState = $.extend(true, {}, state); if (state.start !== undefined) { settings._iDisplayStart = state.start; settings.iInitDisplayStart = state.start } if (state.length !== undefined) { settings._iDisplayLength = state.length } if (state.order !== undefined) { settings.aaSorting = []; $.each(state.order, function (i, col) { settings.aaSorting.push(col[0] >= columns.length ? [0, col[1]] : col) }) } if (state.search !== undefined) { $.extend(settings.oPreviousSearch, _fnSearchToHung(state.search)) } for (i = 0, ien = state.columns.length; i < ien; i++) { var col = state.columns[i]; if (col.visible !== undefined) { columns[i].bVisible = col.visible } if (col.search !== undefined) { $.extend(settings.aoPreSearchCols[i], _fnSearchToHung(col.search)) } } _fnCallbackFire(settings, 'aoStateLoaded', 'stateLoaded', [settings, state]) } function _fnSettingsFromNode(table) { var settings = DataTable.settings; var idx = $.inArray(table, _pluck(settings, 'nTable')); return idx !== -1 ? settings[idx] : null } function _fnLog(settings, level, msg, tn) { msg = 'DataTables warning: ' + (settings ? 'table id=' + settings.sTableId + ' - ' : '') + msg; if (tn) { msg += '. For more information about this error, please see http://datatables.net/tn/' + tn } if (!level) { var ext = DataTable.ext; var type = ext.sErrMode || ext.errMode; if (settings) { _fnCallbackFire(settings, null, 'error', [settings, tn, msg]) } if (type == 'alert') { alert(msg) } else if (type == 'throw') { throw new Error(msg); } else if (typeof type == 'function') { type(settings, tn, msg) } } else if (window.console && console.log) { console.log(msg) } } function _fnMap(ret, src, name, mappedName) { if ($.isArray(name)) { $.each(name, function (i, val) { if ($.isArray(val)) { _fnMap(ret, src, val[0], val[1]) } else { _fnMap(ret, src, val) } }); return } if (mappedName === undefined) { mappedName = name } if (src[name] !== undefined) { ret[mappedName] = src[name] } } function _fnExtend(out, extender, breakRefs) { var val; for (var prop in extender) { if (extender.hasOwnProperty(prop)) { val = extender[prop]; if ($.isPlainObject(val)) { if (!$.isPlainObject(out[prop])) { out[prop] = {} } $.extend(true, out[prop], val) } else if (breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val)) { out[prop] = val.slice() } else { out[prop] = val } } } return out } function _fnBindAction(n, oData, fn) { $(n).bind('click.DT', oData, function (e) { n.blur(); fn(e) }).bind('keypress.DT', oData, function (e) { if (e.which === 13) { e.preventDefault(); fn(e) } }).bind('selectstart.DT', function () { return false }) } function _fnCallbackReg(oSettings, sStore, fn, sName) { if (fn) { oSettings[sStore].push({ "fn": fn, "sName": sName }) } } function _fnCallbackFire(settings, callbackArr, eventName, args) { var ret = []; if (callbackArr) { ret = $.map(settings[callbackArr].slice().reverse(), function (val, i) { return val.fn.apply(settings.oInstance, args) }) } if (eventName !== null) { var e = $.Event(eventName + '.dt'); $(settings.nTable).trigger(e, args); ret.push(e.result) } return ret } function _fnLengthOverflow(settings) { var start = settings._iDisplayStart, end = settings.fnDisplayEnd(), len = settings._iDisplayLength; if (start >= end) { start = end - len } start -= (start % len); if (len === -1 || start < 0) { start = 0 } settings._iDisplayStart = start } function _fnRenderer(settings, type) { var renderer = settings.renderer; var host = DataTable.ext.renderer[type]; if ($.isPlainObject(renderer) && renderer[type]) { return host[renderer[type]] || host._ } else if (typeof renderer === 'string') { return host[renderer] || host._ } return host._ } function _fnDataSource(settings) { if (settings.oFeatures.bServerSide) { return 'ssp' } else if (settings.ajax || settings.sAjaxSource) { return 'ajax' } return 'dom' } DataTable = function (options) { this.$ = function (sSelector, oOpts) { return this.api(true).$(sSelector, oOpts) }; this._ = function (sSelector, oOpts) { return this.api(true).rows(sSelector, oOpts).data() }; this.api = function (traditional) { return traditional ? new _Api(_fnSettingsFromNode(this[_ext.iApiIndex])) : new _Api(this) }; this.fnAddData = function (data, redraw) { var api = this.api(true); var rows = $.isArray(data) && ($.isArray(data[0]) || $.isPlainObject(data[0])) ? api.rows.add(data) : api.row.add(data); if (redraw === undefined || redraw) { api.draw() } return rows.flatten().toArray() }; this.fnAdjustColumnSizing = function (bRedraw) { var api = this.api(true).columns.adjust(); var settings = api.settings()[0]; var scroll = settings.oScroll; if (bRedraw === undefined || bRedraw) { api.draw(false) } else if (scroll.sX !== "" || scroll.sY !== "") { _fnScrollDraw(settings) } }; this.fnClearTable = function (bRedraw) { var api = this.api(true).clear(); if (bRedraw === undefined || bRedraw) { api.draw() } }; this.fnClose = function (nTr) { this.api(true).row(nTr).child.hide() }; this.fnDeleteRow = function (target, callback, redraw) { var api = this.api(true); var rows = api.rows(target); var settings = rows.settings()[0]; var data = settings.aoData[rows[0][0]]; rows.remove(); if (callback) { callback.call(this, settings, data) } if (redraw === undefined || redraw) { api.draw() } return data }; this.fnDestroy = function (remove) { this.api(true).destroy(remove) }; this.fnDraw = function (complete) { this.api(true).draw(complete) }; this.fnFilter = function (sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive) { var api = this.api(true); if (iColumn === null || iColumn === undefined) { api.search(sInput, bRegex, bSmart, bCaseInsensitive) } else { api.column(iColumn).search(sInput, bRegex, bSmart, bCaseInsensitive) } api.draw() }; this.fnGetData = function (src, col) { var api = this.api(true); if (src !== undefined) { var type = src.nodeName ? src.nodeName.toLowerCase() : ''; return col !== undefined || type == 'td' || type == 'th' ? api.cell(src, col).data() : api.row(src).data() || null } return api.data().toArray() }; this.fnGetNodes = function (iRow) { var api = this.api(true); return iRow !== undefined ? api.row(iRow).node() : api.rows().nodes().flatten().toArray() }; this.fnGetPosition = function (node) { var api = this.api(true); var nodeName = node.nodeName.toUpperCase(); if (nodeName == 'TR') { return api.row(node).index() } else if (nodeName == 'TD' || nodeName == 'TH') { var cell = api.cell(node).index(); return [cell.row, cell.columnVisible, cell.column] } return null }; this.fnIsOpen = function (nTr) { return this.api(true).row(nTr).child.isShown() }; this.fnOpen = function (nTr, mHtml, sClass) { return this.api(true).row(nTr).child(mHtml, sClass).show().child()[0] }; this.fnPageChange = function (mAction, bRedraw) { var api = this.api(true).page(mAction); if (bRedraw === undefined || bRedraw) { api.draw(false) } }; this.fnSetColumnVis = function (iCol, bShow, bRedraw) { var api = this.api(true).column(iCol).visible(bShow); if (bRedraw === undefined || bRedraw) { api.columns.adjust().draw() } }; this.fnSettings = function () { return _fnSettingsFromNode(this[_ext.iApiIndex]) }; this.fnSort = function (aaSort) { this.api(true).order(aaSort).draw() }; this.fnSortListener = function (nNode, iColumn, fnCallback) { this.api(true).order.listener(nNode, iColumn, fnCallback) }; this.fnUpdate = function (mData, mRow, iColumn, bRedraw, bAction) { var api = this.api(true); if (iColumn === undefined || iColumn === null) { api.row(mRow).data(mData) } else { api.cell(mRow, iColumn).data(mData) } if (bAction === undefined || bAction) { api.columns.adjust() } if (bRedraw === undefined || bRedraw) { api.draw() } return 0 }; this.fnVersionCheck = _ext.fnVersionCheck; var _that = this; var emptyInit = options === undefined; var len = this.length; if (emptyInit) { options = {} } this.oApi = this.internal = _ext.internal; for (var fn in DataTable.ext.internal) { if (fn) { this[fn] = _fnExternApiFunc(fn) } } this.each(function () { var o = {}; var oInit = len > 1 ? _fnExtend(o, options, true) : options; var i = 0, iLen, j, jLen, k, kLen; var sId = this.getAttribute('id'); var bInitHandedOff = false; var defaults = DataTable.defaults; var $this = $(this); if (this.nodeName.toLowerCase() != 'table') { _fnLog(null, 0, 'Non-table node initialisation (' + this.nodeName + ')', 2); return } _fnCompatOpts(defaults); _fnCompatCols(defaults.column); _fnCamelToHungarian(defaults, defaults, true); _fnCamelToHungarian(defaults.column, defaults.column, true); _fnCamelToHungarian(defaults, $.extend(oInit, $this.data())); var allSettings = DataTable.settings; for (i = 0, iLen = allSettings.length; i < iLen; i++) { var s = allSettings[i]; if (s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this)) { var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve; var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy; if (emptyInit || bRetrieve) { return s.oInstance } else if (bDestroy) { s.oInstance.fnDestroy(); break } else { _fnLog(s, 0, 'Cannot reinitialise DataTable', 3); return } } if (s.sTableId == this.id) { allSettings.splice(i, 1); break } } if (sId === null || sId === "") { sId = "DataTables_Table_" + (DataTable.ext._unique++); this.id = sId } var oSettings = $.extend(true, {}, DataTable.models.oSettings, { "sDestroyWidth": $this[0].style.width, "sInstance": sId, "sTableId": sId }); oSettings.nTable = this; oSettings.oApi = _that.internal; oSettings.oInit = oInit; allSettings.push(oSettings); oSettings.oInstance = (_that.length === 1) ? _that : $this.dataTable(); _fnCompatOpts(oInit); if (oInit.oLanguage) { _fnLanguageCompat(oInit.oLanguage) } if (oInit.aLengthMenu && !oInit.iDisplayLength) { oInit.iDisplayLength = $.isArray(oInit.aLengthMenu[0]) ? oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0] } oInit = _fnExtend($.extend(true, {}, defaults), oInit); _fnMap(oSettings.oFeatures, oInit, ["bPaginate", "bLengthChange", "bFilter", "bSort", "bSortMulti", "bInfo", "bProcessing", "bAutoWidth", "bSortClasses", "bServerSide", "bDeferRender"]); _fnMap(oSettings, oInit, ["asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed", "aLengthMenu", "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", "rowId", ["iCookieDuration", "iStateDuration"], ["oSearch", "oPreviousSearch"], ["aoSearchCols", "aoPreSearchCols"], ["iDisplayLength", "_iDisplayLength"], ["bJQueryUI", "bJUI"]]); _fnMap(oSettings.oScroll, oInit, [["sScrollX", "sX"], ["sScrollXInner", "sXInner"], ["sScrollY", "sY"], ["bScrollCollapse", "bCollapse"]]); _fnMap(oSettings.oLanguage, oInit, "fnInfoCallback"); _fnCallbackReg(oSettings, 'aoDrawCallback', oInit.fnDrawCallback, 'user'); _fnCallbackReg(oSettings, 'aoServerParams', oInit.fnServerParams, 'user'); _fnCallbackReg(oSettings, 'aoStateSaveParams', oInit.fnStateSaveParams, 'user'); _fnCallbackReg(oSettings, 'aoStateLoadParams', oInit.fnStateLoadParams, 'user'); _fnCallbackReg(oSettings, 'aoStateLoaded', oInit.fnStateLoaded, 'user'); _fnCallbackReg(oSettings, 'aoRowCallback', oInit.fnRowCallback, 'user'); _fnCallbackReg(oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow, 'user'); _fnCallbackReg(oSettings, 'aoHeaderCallback', oInit.fnHeaderCallback, 'user'); _fnCallbackReg(oSettings, 'aoFooterCallback', oInit.fnFooterCallback, 'user'); _fnCallbackReg(oSettings, 'aoInitComplete', oInit.fnInitComplete, 'user'); _fnCallbackReg(oSettings, 'aoPreDrawCallback', oInit.fnPreDrawCallback, 'user'); oSettings.rowIdFn = _fnGetObjectDataFn(oInit.rowId); _fnBrowserDetect(oSettings); var oClasses = oSettings.oClasses; if (oInit.bJQueryUI) { $.extend(oClasses, DataTable.ext.oJUIClasses, oInit.oClasses); if (oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip") { oSettings.sDom = '<"H"lfr>t<"F"ip>' } if (!oSettings.renderer) { oSettings.renderer = 'jqueryui' } else if ($.isPlainObject(oSettings.renderer) && !oSettings.renderer.header) { oSettings.renderer.header = 'jqueryui' } } else { $.extend(oClasses, DataTable.ext.classes, oInit.oClasses) } $this.addClass(oClasses.sTable); if (oSettings.iInitDisplayStart === undefined) { oSettings.iInitDisplayStart = oInit.iDisplayStart; oSettings._iDisplayStart = oInit.iDisplayStart } if (oInit.iDeferLoading !== null) { oSettings.bDeferLoading = true; var tmp = $.isArray(oInit.iDeferLoading); oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading; oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading } var oLanguage = oSettings.oLanguage; $.extend(true, oLanguage, oInit.oLanguage); if (oLanguage.sUrl !== "") { $.ajax({ dataType: 'json', url: oLanguage.sUrl, success: function (json) { _fnLanguageCompat(json); _fnCamelToHungarian(defaults.oLanguage, json); $.extend(true, oLanguage, json); _fnInitialise(oSettings) }, error: function () { _fnInitialise(oSettings) } }); bInitHandedOff = true } if (oInit.asStripeClasses === null) { oSettings.asStripeClasses = [oClasses.sStripeOdd, oClasses.sStripeEven] } var stripeClasses = oSettings.asStripeClasses; var rowOne = $this.children('tbody').find('tr').eq(0); if ($.inArray(true, $.map(stripeClasses, function (el, i) { return rowOne.hasClass(el) })) !== -1) { $('tbody tr', this).removeClass(stripeClasses.join(' ')); oSettings.asDestroyStripes = stripeClasses.slice() } var anThs = []; var aoColumnsInit; var nThead = this.getElementsByTagName('thead'); if (nThead.length !== 0) { _fnDetectHeader(oSettings.aoHeader, nThead[0]); anThs = _fnGetUniqueThs(oSettings) } if (oInit.aoColumns === null) { aoColumnsInit = []; for (i = 0, iLen = anThs.length; i < iLen; i++) { aoColumnsInit.push(null) } } else { aoColumnsInit = oInit.aoColumns } for (i = 0, iLen = aoColumnsInit.length; i < iLen; i++) { _fnAddColumn(oSettings, anThs ? anThs[i] : null) } _fnApplyColumnDefs(oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) { _fnColumnOptions(oSettings, iCol, oDef) }); if (rowOne.length) { var a = function (cell, name) { return cell.getAttribute('data-' + name) !== null ? name : null }; $(rowOne[0]).children('th, td').each(function (i, cell) { var col = oSettings.aoColumns[i]; if (col.mData === i) { var sort = a(cell, 'sort') || a(cell, 'order'); var filter = a(cell, 'filter') || a(cell, 'search'); if (sort !== null || filter !== null) { col.mData = { _: i + '.display', sort: sort !== null ? i + '.@data-' + sort : undefined, type: sort !== null ? i + '.@data-' + sort : undefined, filter: filter !== null ? i + '.@data-' + filter : undefined }; _fnColumnOptions(oSettings, i) } } }) } var features = oSettings.oFeatures; if (oInit.bStateSave) { features.bStateSave = true; _fnLoadState(oSettings, oInit); _fnCallbackReg(oSettings, 'aoDrawCallback', _fnSaveState, 'state_save') } if (oInit.aaSorting === undefined) { var sorting = oSettings.aaSorting; for (i = 0, iLen = sorting.length; i < iLen; i++) { sorting[i][1] = oSettings.aoColumns[i].asSorting[0] } } _fnSortingClasses(oSettings); if (features.bSort) { _fnCallbackReg(oSettings, 'aoDrawCallback', function () { if (oSettings.bSorted) { var aSort = _fnSortFlatten(oSettings); var sortedColumns = {}; $.each(aSort, function (i, val) { sortedColumns[val.src] = val.dir }); _fnCallbackFire(oSettings, null, 'order', [oSettings, aSort, sortedColumns]); _fnSortAria(oSettings) } }) } _fnCallbackReg(oSettings, 'aoDrawCallback', function () { if (oSettings.bSorted || _fnDataSource(oSettings) === 'ssp' || features.bDeferRender) { _fnSortingClasses(oSettings) } }, 'sc'); var captions = $this.children('caption').each(function () { this._captionSide = $this.css('caption-side') }); var thead = $this.children('thead'); if (thead.length === 0) { thead = $('<thead/>').appendTo(this) } oSettings.nTHead = thead[0]; var tbody = $this.children('tbody'); if (tbody.length === 0) { tbody = $('<tbody/>').appendTo(this) } oSettings.nTBody = tbody[0]; var tfoot = $this.children('tfoot'); if (tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "")) { tfoot = $('<tfoot/>').appendTo(this) } if (tfoot.length === 0 || tfoot.children().length === 0) { $this.addClass(oClasses.sNoFooter) } else if (tfoot.length > 0) { oSettings.nTFoot = tfoot[0]; _fnDetectHeader(oSettings.aoFooter, oSettings.nTFoot) } if (oInit.aaData) { for (i = 0; i < oInit.aaData.length; i++) { _fnAddData(oSettings, oInit.aaData[i]) } } else if (oSettings.bDeferLoading || _fnDataSource(oSettings) == 'dom') { _fnAddTr(oSettings, $(oSettings.nTBody).children('tr')) } oSettings.aiDisplay = oSettings.aiDisplayMaster.slice(); oSettings.bInitialised = true; if (bInitHandedOff === false) { _fnInitialise(oSettings) } }); _that = null; return this }; var __apiStruct = []; var __arrayProto = Array.prototype; var _toSettings = function (mixed) { var idx, jq; var settings = DataTable.settings; var tables = $.map(settings, function (el, i) { return el.nTable }); if (!mixed) { return [] } else if (mixed.nTable && mixed.oApi) { return [mixed] } else if (mixed.nodeName && mixed.nodeName.toLowerCase() === 'table') { idx = $.inArray(mixed, tables); return idx !== -1 ? [settings[idx]] : null } else if (mixed && typeof mixed.settings === 'function') { return mixed.settings().toArray() } else if (typeof mixed === 'string') { jq = $(mixed) } else if (mixed instanceof $) { jq = mixed } if (jq) { return jq.map(function (i) { idx = $.inArray(this, tables); return idx !== -1 ? settings[idx] : null }).toArray() } }; _Api = function (context, data) { if (!(this instanceof _Api)) { return new _Api(context, data) } var settings = []; var ctxSettings = function (o) { var a = _toSettings(o); if (a) { settings = settings.concat(a) } }; if ($.isArray(context)) { for (var i = 0, ien = context.length; i < ien; i++) { ctxSettings(context[i]) } } else { ctxSettings(context) } this.context = _unique(settings); if (data) { $.merge(this, data) } this.selector = { rows: null, cols: null, opts: null }; _Api.extend(this, this, __apiStruct) }; DataTable.Api = _Api; $.extend(_Api.prototype, { any: function () { return this.count() !== 0 }, concat: __arrayProto.concat, context: [], count: function () { return this.flatten().length }, each: function (fn) { for (var i = 0, ien = this.length; i < ien; i++) { fn.call(this, this[i], i, this) } return this }, eq: function (idx) { var ctx = this.context; return ctx.length > idx ? new _Api(ctx[idx], this[idx]) : null }, filter: function (fn) { var a = []; if (__arrayProto.filter) { a = __arrayProto.filter.call(this, fn, this) } else { for (var i = 0, ien = this.length; i < ien; i++) { if (fn.call(this, this[i], i, this)) { a.push(this[i]) } } } return new _Api(this.context, a) }, flatten: function () { var a = []; return new _Api(this.context, a.concat.apply(a, this.toArray())) }, join: __arrayProto.join, indexOf: __arrayProto.indexOf || function (obj, start) { for (var i = (start || 0), ien = this.length; i < ien; i++) { if (this[i] === obj) { return i } } return -1 }, iterator: function (flatten, type, fn, alwaysNew) { var a = [], ret, i, ien, j, jen, context = this.context, rows, items, item, selector = this.selector; if (typeof flatten === 'string') { alwaysNew = fn; fn = type; type = flatten; flatten = false } for (i = 0, ien = context.length; i < ien; i++) { var apiInst = new _Api(context[i]); if (type === 'table') { ret = fn.call(apiInst, context[i], i); if (ret !== undefined) { a.push(ret) } } else if (type === 'columns' || type === 'rows') { ret = fn.call(apiInst, context[i], this[i], i); if (ret !== undefined) { a.push(ret) } } else if (type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell') { items = this[i]; if (type === 'column-rows') { rows = _selector_row_indexes(context[i], selector.opts) } for (j = 0, jen = items.length; j < jen; j++) { item = items[j]; if (type === 'cell') { ret = fn.call(apiInst, context[i], item.row, item.column, i, j) } else { ret = fn.call(apiInst, context[i], item, i, j, rows) } if (ret !== undefined) { a.push(ret) } } } } if (a.length || alwaysNew) { var api = new _Api(context, flatten ? a.concat.apply([], a) : a); var apiSelector = api.selector; apiSelector.rows = selector.rows; apiSelector.cols = selector.cols; apiSelector.opts = selector.opts; return api } return this }, lastIndexOf: __arrayProto.lastIndexOf || function (obj, start) { return this.indexOf.apply(this.toArray.reverse(), arguments) }, length: 0, map: function (fn) { var a = []; if (__arrayProto.map) { a = __arrayProto.map.call(this, fn, this) } else { for (var i = 0, ien = this.length; i < ien; i++) { a.push(fn.call(this, this[i], i)) } } return new _Api(this.context, a) }, pluck: function (prop) { return this.map(function (el) { return el[prop] }) }, pop: __arrayProto.pop, push: __arrayProto.push, reduce: __arrayProto.reduce || function (fn, init) { return _fnReduce(this, fn, init, 0, this.length, 1) }, reduceRight: __arrayProto.reduceRight || function (fn, init) { return _fnReduce(this, fn, init, this.length - 1, -1, -1) }, reverse: __arrayProto.reverse, selector: null, shift: __arrayProto.shift, sort: __arrayProto.sort, splice: __arrayProto.splice, toArray: function () { return __arrayProto.slice.call(this) }, to$: function () { return $(this) }, toJQuery: function () { return $(this) }, unique: function () { return new _Api(this.context, _unique(this)) }, unshift: __arrayProto.unshift }); _Api.extend = function (scope, obj, ext) { if (!ext.length || !obj || (!(obj instanceof _Api) && !obj.__dt_wrapper)) { return } var i, ien, j, jen, struct, inner, methodScoping = function (scope, fn, struc) { return function () { var ret = fn.apply(scope, arguments); _Api.extend(ret, ret, struc.methodExt); return ret } }; for (i = 0, ien = ext.length; i < ien; i++) { struct = ext[i]; obj[struct.name] = typeof struct.val === 'function' ? methodScoping(scope, struct.val, struct) : $.isPlainObject(struct.val) ? {} : struct.val; obj[struct.name].__dt_wrapper = true; _Api.extend(scope, obj[struct.name], struct.propExt) } }; _Api.register = _api_register = function (name, val) { if ($.isArray(name)) { for (var j = 0, jen = name.length; j < jen; j++) { _Api.register(name[j], val) } return } var i, ien, heir = name.split('.'), struct = __apiStruct, key, method; var find = function (src, name) { for (var i = 0, ien = src.length; i < ien; i++) { if (src[i].name === name) { return src[i] } } return null }; for (i = 0, ien = heir.length; i < ien; i++) { method = heir[i].indexOf('()') !== -1; key = method ? heir[i].replace('()', '') : heir[i]; var src = find(struct, key); if (!src) { src = { name: key, val: {}, methodExt: [], propExt: [] }; struct.push(src) } if (i === ien - 1) { src.val = val } else { struct = method ? src.methodExt : src.propExt } } }; _Api.registerPlural = _api_registerPlural = function (pluralName, singularName, val) { _Api.register(pluralName, val); _Api.register(singularName, function () { var ret = val.apply(this, arguments); if (ret === this) { return this } else if (ret instanceof _Api) { return ret.length ? $.isArray(ret[0]) ? new _Api(ret.context, ret[0]) : ret[0] : undefined } return ret }) }; var __table_selector = function (selector, a) { if (typeof selector === 'number') { return [a[selector]] } var nodes = $.map(a, function (el, i) { return el.nTable }); return $(nodes).filter(selector).map(function (i) { var idx = $.inArray(this, nodes); return a[idx] }).toArray() }; _api_register('tables()', function (selector) { return selector ? new _Api(__table_selector(selector, this.context)) : this }); _api_register('table()', function (selector) { var tables = this.tables(selector); var ctx = tables.context; return ctx.length ? new _Api(ctx[0]) : tables }); _api_registerPlural('tables().nodes()', 'table().node()', function () { return this.iterator('table', function (ctx) { return ctx.nTable }, 1) }); _api_registerPlural('tables().body()', 'table().body()', function () { return this.iterator('table', function (ctx) { return ctx.nTBody }, 1) }); _api_registerPlural('tables().header()', 'table().header()', function () { return this.iterator('table', function (ctx) { return ctx.nTHead }, 1) }); _api_registerPlural('tables().footer()', 'table().footer()', function () { return this.iterator('table', function (ctx) { return ctx.nTFoot }, 1) }); _api_registerPlural('tables().containers()', 'table().container()', function () { return this.iterator('table', function (ctx) { return ctx.nTableWrapper }, 1) }); _api_register('draw()', function (paging) { return this.iterator('table', function (settings) { if (paging === 'page') { _fnDraw(settings) } else { if (typeof paging === 'string') { paging = paging === 'full-hold' ? false : true } _fnReDraw(settings, paging === false) } }) }); _api_register('page()', function (action) { if (action === undefined) { return this.page.info().page } return this.iterator('table', function (settings) { _fnPageChange(settings, action) }) }); _api_register('page.info()', function (action) { if (this.context.length === 0) { return undefined } var settings = this.context[0], start = settings._iDisplayStart, len = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1, visRecords = settings.fnRecordsDisplay(), all = len === -1; return { "page": all ? 0 : Math.floor(start / len), "pages": all ? 1 : Math.ceil(visRecords / len), "start": start, "end": settings.fnDisplayEnd(), "length": len, "recordsTotal": settings.fnRecordsTotal(), "recordsDisplay": visRecords, "serverSide": _fnDataSource(settings) === 'ssp' } }); _api_register('page.len()', function (len) { if (len === undefined) { return this.context.length !== 0 ? this.context[0]._iDisplayLength : undefined } return this.iterator('table', function (settings) { _fnLengthChange(settings, len) }) }); var __reload = function (settings, holdPosition, callback) { if (callback) { var api = new _Api(settings); api.one('draw', function () { callback(api.ajax.json()) }) } if (_fnDataSource(settings) == 'ssp') { _fnReDraw(settings, holdPosition) } else { _fnProcessingDisplay(settings, true); var xhr = settings.jqXHR; if (xhr && xhr.readyState !== 4) { xhr.abort() } _fnBuildAjax(settings, [], function (json) { _fnClearTable(settings); var data = _fnAjaxDataSrc(settings, json); for (var i = 0, ien = data.length; i < ien; i++) { _fnAddData(settings, data[i]) } _fnReDraw(settings, holdPosition); _fnProcessingDisplay(settings, false) }) } }; _api_register('ajax.json()', function () { var ctx = this.context; if (ctx.length > 0) { return ctx[0].json } }); _api_register('ajax.params()', function () { var ctx = this.context; if (ctx.length > 0) { return ctx[0].oAjaxData } }); _api_register('ajax.reload()', function (callback, resetPaging) { return this.iterator('table', function (settings) { __reload(settings, resetPaging === false, callback) }) }); _api_register('ajax.url()', function (url) { var ctx = this.context; if (url === undefined) { if (ctx.length === 0) { return undefined } ctx = ctx[0]; return ctx.ajax ? $.isPlainObject(ctx.ajax) ? ctx.ajax.url : ctx.ajax : ctx.sAjaxSource } return this.iterator('table', function (settings) { if ($.isPlainObject(settings.ajax)) { settings.ajax.url = url } else { settings.ajax = url } }) }); _api_register('ajax.url().load()', function (callback, resetPaging) { return this.iterator('table', function (ctx) { __reload(ctx, resetPaging === false, callback) }) }); var _selector_run = function (type, selector, selectFn, settings, opts) { var out = [], res, a, i, ien, j, jen, selectorType = typeof selector; if (!selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined) { selector = [selector] } for (i = 0, ien = selector.length; i < ien; i++) { a = selector[i] && selector[i].split ? selector[i].split(',') : [selector[i]]; for (j = 0, jen = a.length; j < jen; j++) { res = selectFn(typeof a[j] === 'string' ? $.trim(a[j]) : a[j]); if (res && res.length) { out = out.concat(res) } } } var ext = _ext.selector[type]; if (ext.length) { for (i = 0, ien = ext.length; i < ien; i++) { out = ext[i](settings, opts, out) } } return _unique(out) }; var _selector_opts = function (opts) { if (!opts) { opts = {} } if (opts.filter && opts.search === undefined) { opts.search = opts.filter } return $.extend({ search: 'none', order: 'current', page: 'all' }, opts) }; var _selector_first = function (inst) { for (var i = 0, ien = inst.length; i < ien; i++) { if (inst[i].length > 0) { inst[0] = inst[i]; inst[0].length = 1; inst.length = 1; inst.context = [inst.context[i]]; return inst } } inst.length = 0; return inst }; var _selector_row_indexes = function (settings, opts) { var i, ien, tmp, a = [], displayFiltered = settings.aiDisplay, displayMaster = settings.aiDisplayMaster; var search = opts.search, order = opts.order, page = opts.page; if (_fnDataSource(settings) == 'ssp') { return search === 'removed' ? [] : _range(0, displayMaster.length) } else if (page == 'current') { for (i = settings._iDisplayStart, ien = settings.fnDisplayEnd() ; i < ien; i++) { a.push(displayFiltered[i]) } } else if (order == 'current' || order == 'applied') { a = search == 'none' ? displayMaster.slice() : search == 'applied' ? displayFiltered.slice() : $.map(displayMaster, function (el, i) { return $.inArray(el, displayFiltered) === -1 ? el : null }) } else if (order == 'index' || order == 'original') { for (i = 0, ien = settings.aoData.length; i < ien; i++) { if (search == 'none') { a.push(i) } else { tmp = $.inArray(i, displayFiltered); if ((tmp === -1 && search == 'removed') || (tmp >= 0 && search == 'applied')) { a.push(i) } } } } return a }; var __row_selector = function (settings, selector, opts) { var run = function (sel) { var selInt = _intVal(sel); var i, ien; if (selInt !== null && !opts) { return [selInt] } var rows = _selector_row_indexes(settings, opts); if (selInt !== null && $.inArray(selInt, rows) !== -1) { return [selInt] } else if (!sel) { return rows } if (typeof sel === 'function') { return $.map(rows, function (idx) { var row = settings.aoData[idx]; return sel(idx, row._aData, row.nTr) ? idx : null }) } var nodes = _removeEmpty(_pluck_order(settings.aoData, rows, 'nTr')); if (sel.nodeName) { if ($.inArray(sel, nodes) !== -1) { return [sel._DT_RowIndex] } } if (typeof sel === 'string' && sel.charAt(0) === '#') { var rowObj = settings.aIds[sel.replace(/^#/, '')]; if (rowObj !== undefined) { return [rowObj.idx] } } return $(nodes).filter(sel).map(function () { return this._DT_RowIndex }).toArray() }; return _selector_run('row', selector, run, settings, opts) }; _api_register('rows()', function (selector, opts) { if (selector === undefined) { selector = '' } else if ($.isPlainObject(selector)) { opts = selector; selector = '' } opts = _selector_opts(opts); var inst = this.iterator('table', function (settings) { return __row_selector(settings, selector, opts) }, 1); inst.selector.rows = selector; inst.selector.opts = opts; return inst }); _api_register('rows().nodes()', function () { return this.iterator('row', function (settings, row) { return settings.aoData[row].nTr || undefined }, 1) }); _api_register('rows().data()', function () { return this.iterator(true, 'rows', function (settings, rows) { return _pluck_order(settings.aoData, rows, '_aData') }, 1) }); _api_registerPlural('rows().cache()', 'row().cache()', function (type) { return this.iterator('row', function (settings, row) { var r = settings.aoData[row]; return type === 'search' ? r._aFilterData : r._aSortData }, 1) }); _api_registerPlural('rows().invalidate()', 'row().invalidate()', function (src) { return this.iterator('row', function (settings, row) { _fnInvalidate(settings, row, src) }) }); _api_registerPlural('rows().indexes()', 'row().index()', function () { return this.iterator('row', function (settings, row) { return row }, 1) }); _api_registerPlural('rows().ids()', 'row().id()', function (hash) { var a = []; var context = this.context; for (var i = 0, ien = context.length; i < ien; i++) { for (var j = 0, jen = this[i].length; j < jen; j++) { var id = context[i].rowIdFn(context[i].aoData[this[i][j]]._aData); a.push((hash === true ? '#' : '') + id) } } return new _Api(context, a) }); _api_registerPlural('rows().remove()', 'row().remove()', function () { var that = this; this.iterator('row', function (settings, row, thatIdx) { var data = settings.aoData; var rowData = data[row]; var i, ien, j, jen; var loopRow, loopCells; data.splice(row, 1); for (i = 0, ien = data.length; i < ien; i++) { loopRow = data[i]; loopCells = loopRow.anCells; if (loopRow.nTr !== null) { loopRow.nTr._DT_RowIndex = i } if (loopCells !== null) { for (j = 0, jen = loopCells.length; j < jen; j++) { loopCells[j]._DT_CellIndex.row = i } } } _fnDeleteIndex(settings.aiDisplayMaster, row); _fnDeleteIndex(settings.aiDisplay, row); _fnDeleteIndex(that[thatIdx], row, false); _fnLengthOverflow(settings); var id = settings.rowIdFn(rowData._aData); if (id !== undefined) { delete settings.aIds[id] } }); this.iterator('table', function (settings) { for (var i = 0, ien = settings.aoData.length; i < ien; i++) { settings.aoData[i].idx = i } }); return this }); _api_register('rows.add()', function (rows) { var newRows = this.iterator('table', function (settings) { var row, i, ien; var out = []; for (i = 0, ien = rows.length; i < ien; i++) { row = rows[i]; if (row.nodeName && row.nodeName.toUpperCase() === 'TR') { out.push(_fnAddTr(settings, row)[0]) } else { out.push(_fnAddData(settings, row)) } } return out }, 1); var modRows = this.rows(-1); modRows.pop(); $.merge(modRows, newRows); return modRows }); _api_register('row()', function (selector, opts) { return _selector_first(this.rows(selector, opts)) }); _api_register('row().data()', function (data) { var ctx = this.context; if (data === undefined) { return ctx.length && this.length ? ctx[0].aoData[this[0]]._aData : undefined } ctx[0].aoData[this[0]]._aData = data; _fnInvalidate(ctx[0], this[0], 'data'); return this }); _api_register('row().node()', function () { var ctx = this.context; return ctx.length && this.length ? ctx[0].aoData[this[0]].nTr || null : null }); _api_register('row.add()', function (row) { if (row instanceof $ && row.length) { row = row[0] } var rows = this.iterator('table', function (settings) { if (row.nodeName && row.nodeName.toUpperCase() === 'TR') { return _fnAddTr(settings, row)[0] } return _fnAddData(settings, row) }); return this.row(rows[0]) }); var __details_add = function (ctx, row, data, klass) { var rows = []; var addRow = function (r, k) { if ($.isArray(r) || r instanceof $) { for (var i = 0, ien = r.length; i < ien; i++) { addRow(r[i], k) } return } if (r.nodeName && r.nodeName.toLowerCase() === 'tr') { rows.push(r) } else { var created = $('<tr><td/></tr>').addClass(k); $('td', created).addClass(k).html(r)[0].colSpan = _fnVisbleColumns(ctx); rows.push(created[0]) } }; addRow(data, klass); if (row._details) { row._details.remove() } row._details = $(rows); if (row._detailsShow) { row._details.insertAfter(row.nTr) } }; var __details_remove = function (api, idx) { var ctx = api.context; if (ctx.length) { var row = ctx[0].aoData[idx !== undefined ? idx : api[0]]; if (row && row._details) { row._details.remove(); row._detailsShow = undefined; row._details = undefined } } }; var __details_display = function (api, show) { var ctx = api.context; if (ctx.length && api.length) { var row = ctx[0].aoData[api[0]]; if (row._details) { row._detailsShow = show; if (show) { row._details.insertAfter(row.nTr) } else { row._details.detach() } __details_events(ctx[0]) } } }; var __details_events = function (settings) { var api = new _Api(settings); var namespace = '.dt.DT_details'; var drawEvent = 'draw' + namespace; var colvisEvent = 'column-visibility' + namespace; var destroyEvent = 'destroy' + namespace; var data = settings.aoData; api.off(drawEvent + ' ' + colvisEvent + ' ' + destroyEvent); if (_pluck(data, '_details').length > 0) { api.on(drawEvent, function (e, ctx) { if (settings !== ctx) { return } api.rows({ page: 'current' }).eq(0).each(function (idx) { var row = data[idx]; if (row._detailsShow) { row._details.insertAfter(row.nTr) } }) }); api.on(colvisEvent, function (e, ctx, idx, vis) { if (settings !== ctx) { return } var row, visible = _fnVisbleColumns(ctx); for (var i = 0, ien = data.length; i < ien; i++) { row = data[i]; if (row._details) { row._details.children('td[colspan]').attr('colspan', visible) } } }); api.on(destroyEvent, function (e, ctx) { if (settings !== ctx) { return } for (var i = 0, ien = data.length; i < ien; i++) { if (data[i]._details) { __details_remove(api, i) } } }) } }; var _emp = ''; var _child_obj = _emp + 'row().child'; var _child_mth = _child_obj + '()'; _api_register(_child_mth, function (data, klass) { var ctx = this.context; if (data === undefined) { return ctx.length && this.length ? ctx[0].aoData[this[0]]._details : undefined } else if (data === true) { this.child.show() } else if (data === false) { __details_remove(this) } else if (ctx.length && this.length) { __details_add(ctx[0], ctx[0].aoData[this[0]], data, klass) } return this }); _api_register([_child_obj + '.show()', _child_mth + '.show()'], function (show) { __details_display(this, true); return this }); _api_register([_child_obj + '.hide()', _child_mth + '.hide()'], function () { __details_display(this, false); return this }); _api_register([_child_obj + '.remove()', _child_mth + '.remove()'], function () { __details_remove(this); return this }); _api_register(_child_obj + '.isShown()', function () { var ctx = this.context; if (ctx.length && this.length) { return ctx[0].aoData[this[0]]._detailsShow || false } return false }); var __re_column_selector = /^(.+):(name|visIdx|visible)$/; var __columnData = function (settings, column, r1, r2, rows) { var a = []; for (var row = 0, ien = rows.length; row < ien; row++) { a.push(_fnGetCellData(settings, rows[row], column)) } return a }; var __column_selector = function (settings, selector, opts) { var columns = settings.aoColumns, names = _pluck(columns, 'sName'), nodes = _pluck(columns, 'nTh'); var run = function (s) { var selInt = _intVal(s); if (s === '') { return _range(columns.length) } if (selInt !== null) { return [selInt >= 0 ? selInt : columns.length + selInt] } if (typeof s === 'function') { var rows = _selector_row_indexes(settings, opts); return $.map(columns, function (col, idx) { return s(idx, __columnData(settings, idx, 0, 0, rows), nodes[idx]) ? idx : null }) } var match = typeof s === 'string' ? s.match(__re_column_selector) : ''; if (match) { switch (match[2]) { case 'visIdx': case 'visible': var idx = parseInt(match[1], 10); if (idx < 0) { var visColumns = $.map(columns, function (col, i) { return col.bVisible ? i : null }); return [visColumns[visColumns.length + idx]] } return [_fnVisibleToColumnIndex(settings, idx)]; case 'name': return $.map(names, function (name, i) { return name === match[1] ? i : null }) } } else { return $(nodes).filter(s).map(function () { return $.inArray(this, nodes) }).toArray() } }; return _selector_run('column', selector, run, settings, opts) }; var __setColumnVis = function (settings, column, vis, recalc) { var cols = settings.aoColumns, col = cols[column], data = settings.aoData, row, cells, i, ien, tr; if (vis === undefined) { return col.bVisible } if (col.bVisible === vis) { return } if (vis) { var insertBefore = $.inArray(true, _pluck(cols, 'bVisible'), column + 1); for (i = 0, ien = data.length; i < ien; i++) { tr = data[i].nTr; cells = data[i].anCells; if (tr) { tr.insertBefore(cells[column], cells[insertBefore] || null) } } } else { $(_pluck(settings.aoData, 'anCells', column)).detach() } col.bVisible = vis; _fnDrawHead(settings, settings.aoHeader); _fnDrawHead(settings, settings.aoFooter); if (recalc === undefined || recalc) { _fnAdjustColumnSizing(settings); if (settings.oScroll.sX || settings.oScroll.sY) { _fnScrollDraw(settings) } } _fnCallbackFire(settings, null, 'column-visibility', [settings, column, vis, recalc]); _fnSaveState(settings) }; _api_register('columns()', function (selector, opts) { if (selector === undefined) { selector = '' } else if ($.isPlainObject(selector)) { opts = selector; selector = '' } opts = _selector_opts(opts); var inst = this.iterator('table', function (settings) { return __column_selector(settings, selector, opts) }, 1); inst.selector.cols = selector; inst.selector.opts = opts; return inst }); _api_registerPlural('columns().header()', 'column().header()', function (selector, opts) { return this.iterator('column', function (settings, column) { return settings.aoColumns[column].nTh }, 1) }); _api_registerPlural('columns().footer()', 'column().footer()', function (selector, opts) { return this.iterator('column', function (settings, column) { return settings.aoColumns[column].nTf }, 1) }); _api_registerPlural('columns().data()', 'column().data()', function () { return this.iterator('column-rows', __columnData, 1) }); _api_registerPlural('columns().dataSrc()', 'column().dataSrc()', function () { return this.iterator('column', function (settings, column) { return settings.aoColumns[column].mData }, 1) }); _api_registerPlural('columns().cache()', 'column().cache()', function (type) { return this.iterator('column-rows', function (settings, column, i, j, rows) { return _pluck_order(settings.aoData, rows, type === 'search' ? '_aFilterData' : '_aSortData', column) }, 1) }); _api_registerPlural('columns().nodes()', 'column().nodes()', function () { return this.iterator('column-rows', function (settings, column, i, j, rows) { return _pluck_order(settings.aoData, rows, 'anCells', column) }, 1) }); _api_registerPlural('columns().visible()', 'column().visible()', function (vis, calc) { return this.iterator('column', function (settings, column) { if (vis === undefined) { return settings.aoColumns[column].bVisible } __setColumnVis(settings, column, vis, calc) }) }); _api_registerPlural('columns().indexes()', 'column().index()', function (type) { return this.iterator('column', function (settings, column) { return type === 'visible' ? _fnColumnIndexToVisible(settings, column) : column }, 1) }); _api_register('columns.adjust()', function () { return this.iterator('table', function (settings) { _fnAdjustColumnSizing(settings) }, 1) }); _api_register('column.index()', function (type, idx) { if (this.context.length !== 0) { var ctx = this.context[0]; if (type === 'fromVisible' || type === 'toData') { return _fnVisibleToColumnIndex(ctx, idx) } else if (type === 'fromData' || type === 'toVisible') { return _fnColumnIndexToVisible(ctx, idx) } } }); _api_register('column()', function (selector, opts) { return _selector_first(this.columns(selector, opts)) }); var __cell_selector = function (settings, selector, opts) { var data = settings.aoData; var rows = _selector_row_indexes(settings, opts); var cells = _removeEmpty(_pluck_order(data, rows, 'anCells')); var allCells = $([].concat.apply([], cells)); var row; var columns = settings.aoColumns.length; var a, i, ien, j, o, host; var run = function (s) { var fnSelector = typeof s === 'function'; if (s === null || s === undefined || fnSelector) { a = []; for (i = 0, ien = rows.length; i < ien; i++) { row = rows[i]; for (j = 0; j < columns; j++) { o = { row: row, column: j }; if (fnSelector) { host = data[row]; if (s(o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null)) { a.push(o) } } else { a.push(o) } } } return a } if ($.isPlainObject(s)) { return [s] } return allCells.filter(s).map(function (i, el) { return { row: el._DT_CellIndex.row, column: el._DT_CellIndex.column } }).toArray() }; return _selector_run('cell', selector, run, settings, opts) }; _api_register('cells()', function (rowSelector, columnSelector, opts) { if ($.isPlainObject(rowSelector)) { if (rowSelector.row === undefined) { opts = rowSelector; rowSelector = null } else { opts = columnSelector; columnSelector = null } } if ($.isPlainObject(columnSelector)) { opts = columnSelector; columnSelector = null } if (columnSelector === null || columnSelector === undefined) { return this.iterator('table', function (settings) { return __cell_selector(settings, rowSelector, _selector_opts(opts)) }) } var columns = this.columns(columnSelector, opts); var rows = this.rows(rowSelector, opts); var a, i, ien, j, jen; var cells = this.iterator('table', function (settings, idx) { a = []; for (i = 0, ien = rows[idx].length; i < ien; i++) { for (j = 0, jen = columns[idx].length; j < jen; j++) { a.push({ row: rows[idx][i], column: columns[idx][j] }) } } return a }, 1); $.extend(cells.selector, { cols: columnSelector, rows: rowSelector, opts: opts }); return cells }); _api_registerPlural('cells().nodes()', 'cell().node()', function () { return this.iterator('cell', function (settings, row, column) { var cells = settings.aoData[row].anCells; return cells ? cells[column] : undefined }, 1) }); _api_register('cells().data()', function () { return this.iterator('cell', function (settings, row, column) { return _fnGetCellData(settings, row, column) }, 1) }); _api_registerPlural('cells().cache()', 'cell().cache()', function (type) { type = type === 'search' ? '_aFilterData' : '_aSortData'; return this.iterator('cell', function (settings, row, column) { return settings.aoData[row][type][column] }, 1) }); _api_registerPlural('cells().render()', 'cell().render()', function (type) { return this.iterator('cell', function (settings, row, column) { return _fnGetCellData(settings, row, column, type) }, 1) }); _api_registerPlural('cells().indexes()', 'cell().index()', function () { return this.iterator('cell', function (settings, row, column) { return { row: row, column: column, columnVisible: _fnColumnIndexToVisible(settings, column) } }, 1) }); _api_registerPlural('cells().invalidate()', 'cell().invalidate()', function (src) { return this.iterator('cell', function (settings, row, column) { _fnInvalidate(settings, row, src, column) }) }); _api_register('cell()', function (rowSelector, columnSelector, opts) { return _selector_first(this.cells(rowSelector, columnSelector, opts)) }); _api_register('cell().data()', function (data) { var ctx = this.context; var cell = this[0]; if (data === undefined) { return ctx.length && cell.length ? _fnGetCellData(ctx[0], cell[0].row, cell[0].column) : undefined } _fnSetCellData(ctx[0], cell[0].row, cell[0].column, data); _fnInvalidate(ctx[0], cell[0].row, 'data', cell[0].column); return this }); _api_register('order()', function (order, dir) { var ctx = this.context; if (order === undefined) { return ctx.length !== 0 ? ctx[0].aaSorting : undefined } if (typeof order === 'number') { order = [[order, dir]] } else if (!$.isArray(order[0])) { order = Array.prototype.slice.call(arguments) } return this.iterator('table', function (settings) { settings.aaSorting = order.slice() }) }); _api_register('order.listener()', function (node, column, callback) { return this.iterator('table', function (settings) { _fnSortAttachListener(settings, node, column, callback) }) }); _api_register('order.fixed()', function (set) { if (!set) { var ctx = this.context; var fixed = ctx.length ? ctx[0].aaSortingFixed : undefined; return $.isArray(fixed) ? { pre: fixed } : fixed } return this.iterator('table', function (settings) { settings.aaSortingFixed = $.extend(true, {}, set) }) }); _api_register(['columns().order()', 'column().order()'], function (dir) { var that = this; return this.iterator('table', function (settings, i) { var sort = []; $.each(that[i], function (j, col) { sort.push([col, dir]) }); settings.aaSorting = sort }) }); _api_register('search()', function (input, regex, smart, caseInsen) { var ctx = this.context; if (input === undefined) { return ctx.length !== 0 ? ctx[0].oPreviousSearch.sSearch : undefined } return this.iterator('table', function (settings) { if (!settings.oFeatures.bFilter) { return } _fnFilterComplete(settings, $.extend({}, settings.oPreviousSearch, { "sSearch": input + "", "bRegex": regex === null ? false : regex, "bSmart": smart === null ? true : smart, "bCaseInsensitive": caseInsen === null ? true : caseInsen }), 1) }) }); _api_registerPlural('columns().search()', 'column().search()', function (input, regex, smart, caseInsen) { return this.iterator('column', function (settings, column) { var preSearch = settings.aoPreSearchCols; if (input === undefined) { return preSearch[column].sSearch } if (!settings.oFeatures.bFilter) { return } $.extend(preSearch[column], { "sSearch": input + "", "bRegex": regex === null ? false : regex, "bSmart": smart === null ? true : smart, "bCaseInsensitive": caseInsen === null ? true : caseInsen }); _fnFilterComplete(settings, settings.oPreviousSearch, 1) }) }); _api_register('state()', function () { return this.context.length ? this.context[0].oSavedState : null }); _api_register('state.clear()', function () { return this.iterator('table', function (settings) { settings.fnStateSaveCallback.call(settings.oInstance, settings, {}) }) }); _api_register('state.loaded()', function () { return this.context.length ? this.context[0].oLoadedState : null }); _api_register('state.save()', function () { return this.iterator('table', function (settings) { _fnSaveState(settings) }) }); DataTable.versionCheck = DataTable.fnVersionCheck = function (version) { var aThis = DataTable.version.split('.'); var aThat = version.split('.'); var iThis, iThat; for (var i = 0, iLen = aThat.length; i < iLen; i++) { iThis = parseInt(aThis[i], 10) || 0; iThat = parseInt(aThat[i], 10) || 0; if (iThis === iThat) { continue } return iThis > iThat } return true }; DataTable.isDataTable = DataTable.fnIsDataTable = function (table) { var t = $(table).get(0); var is = false; $.each(DataTable.settings, function (i, o) { var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null; var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null; if (o.nTable === t || head === t || foot === t) { is = true } }); return is }; DataTable.tables = DataTable.fnTables = function (visible) { var api = false; if ($.isPlainObject(visible)) { api = visible.api; visible = visible.visible } var a = $.map(DataTable.settings, function (o) { if (!visible || (visible && $(o.nTable).is(':visible'))) { return o.nTable } }); return api ? new _Api(a) : a }; DataTable.util = { throttle: _fnThrottle, escapeRegex: _fnEscapeRegex }; DataTable.camelToHungarian = _fnCamelToHungarian; _api_register('$()', function (selector, opts) { var rows = this.rows(opts).nodes(), jqRows = $(rows); return $([].concat(jqRows.filter(selector).toArray(), jqRows.find(selector).toArray())) }); $.each(['on', 'one', 'off'], function (i, key) { _api_register(key + '()', function () { var args = Array.prototype.slice.call(arguments); if (!args[0].match(/\.dt\b/)) { args[0] += '.dt' } var inst = $(this.tables().nodes()); inst[key].apply(inst, args); return this }) }); _api_register('clear()', function () { return this.iterator('table', function (settings) { _fnClearTable(settings) }) }); _api_register('settings()', function () { return new _Api(this.context, this.context) }); _api_register('init()', function () { var ctx = this.context; return ctx.length ? ctx[0].oInit : null }); _api_register('data()', function () { return this.iterator('table', function (settings) { return _pluck(settings.aoData, '_aData') }).flatten() }); _api_register('destroy()', function (remove) { remove = remove || false; return this.iterator('table', function (settings) { var orig = settings.nTableWrapper.parentNode; var classes = settings.oClasses; var table = settings.nTable; var tbody = settings.nTBody; var thead = settings.nTHead; var tfoot = settings.nTFoot; var jqTable = $(table); var jqTbody = $(tbody); var jqWrapper = $(settings.nTableWrapper); var rows = $.map(settings.aoData, function (r) { return r.nTr }); var i, ien; settings.bDestroying = true; _fnCallbackFire(settings, "aoDestroyCallback", "destroy", [settings]); if (!remove) { new _Api(settings).columns().visible(true) } jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT'); $(window).unbind('.DT-' + settings.sInstance); if (table != thead.parentNode) { jqTable.children('thead').detach(); jqTable.append(thead) } if (tfoot && table != tfoot.parentNode) { jqTable.children('tfoot').detach(); jqTable.append(tfoot) } settings.aaSorting = []; settings.aaSortingFixed = []; _fnSortingClasses(settings); $(rows).removeClass(settings.asStripeClasses.join(' ')); $('th, td', thead).removeClass(classes.sSortable + ' ' + classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone); if (settings.bJUI) { $('th span.' + classes.sSortIcon + ', td span.' + classes.sSortIcon, thead).detach(); $('th, td', thead).each(function () { var wrapper = $('div.' + classes.sSortJUIWrapper, this); $(this).append(wrapper.contents()); wrapper.detach() }) } jqTbody.children().detach(); jqTbody.append(rows); var removedMethod = remove ? 'remove' : 'detach'; jqTable[removedMethod](); jqWrapper[removedMethod](); if (!remove && orig) { orig.insertBefore(table, settings.nTableReinsertBefore); jqTable.css('width', settings.sDestroyWidth).removeClass(classes.sTable); ien = settings.asDestroyStripes.length; if (ien) { jqTbody.children().each(function (i) { $(this).addClass(settings.asDestroyStripes[i % ien]) }) } } var idx = $.inArray(settings, DataTable.settings); if (idx !== -1) { DataTable.settings.splice(idx, 1) } }) }); $.each(['column', 'row', 'cell'], function (i, type) { _api_register(type + 's().every()', function (fn) { var opts = this.selector.opts; var api = this; return this.iterator(type, function (settings, arg1, arg2, arg3, arg4) { fn.call(api[type](arg1, type === 'cell' ? arg2 : opts, type === 'cell' ? opts : undefined), arg1, arg2, arg3, arg4) }) }) }); _api_register('i18n()', function (token, def, plural) { var ctx = this.context[0]; var resolved = _fnGetObjectDataFn(token)(ctx.oLanguage); if (resolved === undefined) { resolved = def } if (plural !== undefined && $.isPlainObject(resolved)) { resolved = resolved[plural] !== undefined ? resolved[plural] : resolved._ } return resolved.replace('%d', plural) }); DataTable.version = "1.10.10"; DataTable.settings = []; DataTable.models = {}; DataTable.models.oSearch = { "bCaseInsensitive": true, "sSearch": "", "bRegex": false, "bSmart": true }; DataTable.models.oRow = { "nTr": null, "anCells": null, "_aData": [], "_aSortData": null, "_aFilterData": null, "_sFilterRow": null, "_sRowStripe": "", "src": null, "idx": -1 }; DataTable.models.oColumn = { "idx": null, "aDataSort": null, "asSorting": null, "bSearchable": null, "bSortable": null, "bVisible": null, "_sManualType": null, "_bAttrSrc": false, "fnCreatedCell": null, "fnGetData": null, "fnSetData": null, "mData": null, "mRender": null, "nTh": null, "nTf": null, "sClass": null, "sContentPadding": null, "sDefaultContent": null, "sName": null, "sSortDataType": 'std', "sSortingClass": null, "sSortingClassJUI": null, "sTitle": null, "sType": null, "sWidth": null, "sWidthOrig": null }; DataTable.defaults = { "aaData": null, "aaSorting": [[0, 'asc']], "aaSortingFixed": [], "ajax": null, "aLengthMenu": [10, 25, 50, 100], "aoColumns": null, "aoColumnDefs": null, "aoSearchCols": [], "asStripeClasses": null, "bAutoWidth": true, "bDeferRender": false, "bDestroy": false, "bFilter": true, "bInfo": true, "bJQueryUI": false, "bLengthChange": true, "bPaginate": true, "bProcessing": false, "bRetrieve": false, "bScrollCollapse": false, "bServerSide": false, "bSort": true, "bSortMulti": true, "bSortCellsTop": false, "bSortClasses": true, "bStateSave": false, "fnCreatedRow": null, "fnDrawCallback": null, "fnFooterCallback": null, "fnFormatNumber": function (toFormat) { return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands) }, "fnHeaderCallback": null, "fnInfoCallback": null, "fnInitComplete": null, "fnPreDrawCallback": null, "fnRowCallback": null, "fnServerData": null, "fnServerParams": null, "fnStateLoadCallback": function (settings) { try { return JSON.parse((settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem('DataTables_' + settings.sInstance + '_' + location.pathname)) } catch (e) { } }, "fnStateLoadParams": null, "fnStateLoaded": null, "fnStateSaveCallback": function (settings, data) { try { (settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem('DataTables_' + settings.sInstance + '_' + location.pathname, JSON.stringify(data)) } catch (e) { } }, "fnStateSaveParams": null, "iStateDuration": 7200, "iDeferLoading": null, "iDisplayLength": 10, "iDisplayStart": 0, "iTabIndex": 0, "oClasses": {}, "oLanguage": { "oAria": { "sSortAscending": ": activate to sort column ascending", "sSortDescending": ": activate to sort column descending" }, "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": "Next", "sPrevious": "Previous" }, "sEmptyTable": "No data available in table", "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries", "sInfoEmpty": "Showing 0 to 0 of 0 entries", "sInfoFiltered": "(filtered from _MAX_ total entries)", "sInfoPostFix": "", "sDecimal": "", "sThousands": ",", "sLengthMenu": "Show _MENU_ entries", "sLoadingRecords": "Loading...", "sProcessing": "Processing...", "sSearch": "Search:", "sSearchPlaceholder": "", "sUrl": "", "sZeroRecords": "No matching records found" }, "oSearch": $.extend({}, DataTable.models.oSearch), "sAjaxDataProp": "data", "sAjaxSource": null, "sDom": "lfrtip", "searchDelay": null, "sPaginationType": "simple_numbers", "sScrollX": "", "sScrollXInner": "", "sScrollY": "", "sServerMethod": "GET", "renderer": null, "rowId": "DT_RowId" }; _fnHungarianMap(DataTable.defaults); DataTable.defaults.column = { "aDataSort": null, "iDataSort": -1, "asSorting": ['asc', 'desc'], "bSearchable": true, "bSortable": true, "bVisible": true, "fnCreatedCell": null, "mData": null, "mRender": null, "sCellType": "td", "sClass": "", "sContentPadding": "", "sDefaultContent": null, "sName": "", "sSortDataType": "std", "sTitle": null, "sType": null, "sWidth": null }; _fnHungarianMap(DataTable.defaults.column); DataTable.models.oSettings = { "oFeatures": { "bAutoWidth": null, "bDeferRender": null, "bFilter": null, "bInfo": null, "bLengthChange": null, "bPaginate": null, "bProcessing": null, "bServerSide": null, "bSort": null, "bSortMulti": null, "bSortClasses": null, "bStateSave": null }, "oScroll": { "bCollapse": null, "iBarWidth": 0, "sX": null, "sXInner": null, "sY": null }, "oLanguage": { "fnInfoCallback": null }, "oBrowser": { "bScrollOversize": false, "bScrollbarLeft": false, "bBounding": false, "barWidth": 0 }, "ajax": null, "aanFeatures": [], "aoData": [], "aiDisplay": [], "aiDisplayMaster": [], "aIds": {}, "aoColumns": [], "aoHeader": [], "aoFooter": [], "oPreviousSearch": {}, "aoPreSearchCols": [], "aaSorting": null, "aaSortingFixed": [], "asStripeClasses": null, "asDestroyStripes": [], "sDestroyWidth": 0, "aoRowCallback": [], "aoHeaderCallback": [], "aoFooterCallback": [], "aoDrawCallback": [], "aoRowCreatedCallback": [], "aoPreDrawCallback": [], "aoInitComplete": [], "aoStateSaveParams": [], "aoStateLoadParams": [], "aoStateLoaded": [], "sTableId": "", "nTable": null, "nTHead": null, "nTFoot": null, "nTBody": null, "nTableWrapper": null, "bDeferLoading": false, "bInitialised": false, "aoOpenRows": [], "sDom": null, "searchDelay": null, "sPaginationType": "two_button", "iStateDuration": 0, "aoStateSave": [], "aoStateLoad": [], "oSavedState": null, "oLoadedState": null, "sAjaxSource": null, "sAjaxDataProp": null, "bAjaxDataGet": true, "jqXHR": null, "json": undefined, "oAjaxData": undefined, "fnServerData": null, "aoServerParams": [], "sServerMethod": null, "fnFormatNumber": null, "aLengthMenu": null, "iDraw": 0, "bDrawing": false, "iDrawError": -1, "_iDisplayLength": 10, "_iDisplayStart": 0, "_iRecordsTotal": 0, "_iRecordsDisplay": 0, "bJUI": null, "oClasses": {}, "bFiltered": false, "bSorted": false, "bSortCellsTop": null, "oInit": null, "aoDestroyCallback": [], "fnRecordsTotal": function () { return _fnDataSource(this) == 'ssp' ? this._iRecordsTotal * 1 : this.aiDisplayMaster.length }, "fnRecordsDisplay": function () { return _fnDataSource(this) == 'ssp' ? this._iRecordsDisplay * 1 : this.aiDisplay.length }, "fnDisplayEnd": function () { var len = this._iDisplayLength, start = this._iDisplayStart, calc = start + len, records = this.aiDisplay.length, features = this.oFeatures, paginate = features.bPaginate; if (features.bServerSide) { return paginate === false || len === -1 ? start + records : Math.min(start + len, this._iRecordsDisplay) } else { return !paginate || calc > records || len === -1 ? records : calc } }, "oInstance": null, "sInstance": null, "iTabIndex": 0, "nScrollHead": null, "nScrollFoot": null, "aLastSort": [], "oPlugins": {}, "rowIdFn": null, "rowId": null }; DataTable.ext = _ext = { buttons: {}, classes: {}, builder: "-source-", errMode: "alert", feature: [], search: [], selector: { cell: [], column: [], row: [] }, internal: {}, legacy: { ajax: null }, pager: {}, renderer: { pageButton: {}, header: {} }, order: {}, type: { detect: [], search: {}, order: {} }, _unique: 0, fnVersionCheck: DataTable.fnVersionCheck, iApiIndex: 0, oJUIClasses: {}, sVersion: DataTable.version }; $.extend(_ext, { afnFiltering: _ext.search, aTypes: _ext.type.detect, ofnSearch: _ext.type.search, oSort: _ext.type.order, afnSortData: _ext.order, aoFeatures: _ext.feature, oApi: _ext.internal, oStdClasses: _ext.classes, oPagination: _ext.pager }); $.extend(DataTable.ext.classes, { "sTable": "dataTable", "sNoFooter": "no-footer", "sPageButton": "paginate_button", "sPageButtonActive": "current", "sPageButtonDisabled": "disabled", "sStripeOdd": "odd", "sStripeEven": "even", "sRowEmpty": "dataTables_empty", "sWrapper": "dataTables_wrapper", "sFilter": "dataTables_filter", "sInfo": "dataTables_info", "sPaging": "dataTables_paginate paging_", "sLength": "dataTables_length", "sProcessing": "dataTables_processing", "sSortAsc": "sorting_asc", "sSortDesc": "sorting_desc", "sSortable": "sorting", "sSortableAsc": "sorting_asc_disabled", "sSortableDesc": "sorting_desc_disabled", "sSortableNone": "sorting_disabled", "sSortColumn": "sorting_", "sFilterInput": "", "sLengthSelect": "", "sScrollWrapper": "dataTables_scroll", "sScrollHead": "dataTables_scrollHead", "sScrollHeadInner": "dataTables_scrollHeadInner", "sScrollBody": "dataTables_scrollBody", "sScrollFoot": "dataTables_scrollFoot", "sScrollFootInner": "dataTables_scrollFootInner", "sHeaderTH": "", "sFooterTH": "", "sSortJUIAsc": "", "sSortJUIDesc": "", "sSortJUI": "", "sSortJUIAscAllowed": "", "sSortJUIDescAllowed": "", "sSortJUIWrapper": "", "sSortIcon": "", "sJUIHeader": "", "sJUIFooter": "" }); (function () { var _empty = ''; _empty = ''; var _stateDefault = _empty + 'ui-state-default'; var _sortIcon = _empty + 'css_right ui-icon ui-icon-'; var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix'; $.extend(DataTable.ext.oJUIClasses, DataTable.ext.classes, { "sPageButton": "fg-button ui-button " + _stateDefault, "sPageButtonActive": "ui-state-disabled", "sPageButtonDisabled": "ui-state-disabled", "sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_", "sSortAsc": _stateDefault + " sorting_asc", "sSortDesc": _stateDefault + " sorting_desc", "sSortable": _stateDefault + " sorting", "sSortableAsc": _stateDefault + " sorting_asc_disabled", "sSortableDesc": _stateDefault + " sorting_desc_disabled", "sSortableNone": _stateDefault + " sorting_disabled", "sSortJUIAsc": _sortIcon + "triangle-1-n", "sSortJUIDesc": _sortIcon + "triangle-1-s", "sSortJUI": _sortIcon + "carat-2-n-s", "sSortJUIAscAllowed": _sortIcon + "carat-1-n", "sSortJUIDescAllowed": _sortIcon + "carat-1-s", "sSortJUIWrapper": "DataTables_sort_wrapper", "sSortIcon": "DataTables_sort_icon", "sScrollHead": "dataTables_scrollHead " + _stateDefault, "sScrollFoot": "dataTables_scrollFoot " + _stateDefault, "sHeaderTH": _stateDefault, "sFooterTH": _stateDefault, "sJUIHeader": _headerFooter + " ui-corner-tl ui-corner-tr", "sJUIFooter": _headerFooter + " ui-corner-bl ui-corner-br" }) }()); var extPagination = DataTable.ext.pager; function _numbers(page, pages) { var numbers = [], buttons = extPagination.numbers_length, half = Math.floor(buttons / 2), i = 1; if (pages <= buttons) { numbers = _range(0, pages) } else if (page <= half) { numbers = _range(0, buttons - 2); numbers.push('ellipsis'); numbers.push(pages - 1) } else if (page >= pages - 1 - half) { numbers = _range(pages - (buttons - 2), pages); numbers.splice(0, 0, 'ellipsis'); numbers.splice(0, 0, 0) } else { numbers = _range(page - half + 2, page + half - 1); numbers.push('ellipsis'); numbers.push(pages - 1); numbers.splice(0, 0, 'ellipsis'); numbers.splice(0, 0, 0) } numbers.DT_el = 'span'; return numbers } $.extend(extPagination, { simple: function (page, pages) { return ['previous', 'next'] }, full: function (page, pages) { return ['first', 'previous', 'next', 'last'] }, numbers: function (page, pages) { return [_numbers(page, pages)] }, simple_numbers: function (page, pages) { return ['previous', _numbers(page, pages), 'next'] }, full_numbers: function (page, pages) { return ['first', 'previous', _numbers(page, pages), 'next', 'last'] }, _numbers: _numbers, numbers_length: 7 }); $.extend(true, DataTable.ext.renderer, { pageButton: { _: function (settings, host, idx, buttons, page, pages) { var classes = settings.oClasses; var lang = settings.oLanguage.oPaginate; var aria = settings.oLanguage.oAria.paginate || {}; var btnDisplay, btnClass, counter = 0; var attach = function (container, buttons) { var i, ien, node, button; var clickHandler = function (e) { _fnPageChange(settings, e.data.action, true) }; for (i = 0, ien = buttons.length; i < ien; i++) { button = buttons[i]; if ($.isArray(button)) { var inner = $('<' + (button.DT_el || 'div') + '/>').appendTo(container); attach(inner, button) } else { btnDisplay = null; btnClass = ''; switch (button) { case 'ellipsis': container.append('<span class="ellipsis">&#x2026;</span>'); break; case 'first': btnDisplay = lang.sFirst; btnClass = button + (page > 0 ? '' : ' ' + classes.sPageButtonDisabled); break; case 'previous': btnDisplay = lang.sPrevious; btnClass = button + (page > 0 ? '' : ' ' + classes.sPageButtonDisabled); break; case 'next': btnDisplay = lang.sNext; btnClass = button + (page < pages - 1 ? '' : ' ' + classes.sPageButtonDisabled); break; case 'last': btnDisplay = lang.sLast; btnClass = button + (page < pages - 1 ? '' : ' ' + classes.sPageButtonDisabled); break; default: btnDisplay = button + 1; btnClass = page === button ? classes.sPageButtonActive : ''; break } if (btnDisplay !== null) { node = $('<a>', { 'class': classes.sPageButton + ' ' + btnClass, 'aria-controls': settings.sTableId, 'aria-label': aria[button], 'data-dt-idx': counter, 'tabindex': settings.iTabIndex, 'id': idx === 0 && typeof button === 'string' ? settings.sTableId + '_' + button : null }).html(btnDisplay).appendTo(container); _fnBindAction(node, { action: button }, clickHandler); counter++ } } } }; var activeEl; try { activeEl = $(host).find(document.activeElement).data('dt-idx') } catch (e) { } attach($(host).empty(), buttons); if (activeEl) { $(host).find('[data-dt-idx=' + activeEl + ']').focus() } } } }); $.extend(DataTable.ext.type.detect, [function (d, settings) { var decimal = settings.oLanguage.sDecimal; return _isNumber(d, decimal) ? 'num' + decimal : null }, function (d, settings) { if (d && !(d instanceof Date) && (!_re_date_start.test(d) || !_re_date_end.test(d))) { return null } var parsed = Date.parse(d); return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null }, function (d, settings) { var decimal = settings.oLanguage.sDecimal; return _isNumber(d, decimal, true) ? 'num-fmt' + decimal : null }, function (d, settings) { var decimal = settings.oLanguage.sDecimal; return _htmlNumeric(d, decimal) ? 'html-num' + decimal : null }, function (d, settings) { var decimal = settings.oLanguage.sDecimal; return _htmlNumeric(d, decimal, true) ? 'html-num-fmt' + decimal : null }, function (d, settings) { return _empty(d) || (typeof d === 'string' && d.indexOf('<') !== -1) ? 'html' : null }]); $.extend(DataTable.ext.type.search, { html: function (data) { return _empty(data) ? data : typeof data === 'string' ? data.replace(_re_new_lines, " ").replace(_re_html, "") : '' }, string: function (data) { return _empty(data) ? data : typeof data === 'string' ? data.replace(_re_new_lines, " ") : data } }); var __numericReplace = function (d, decimalPlace, re1, re2) { if (d !== 0 && (!d || d === '-')) { return -Infinity } if (decimalPlace) { d = _numToDecimal(d, decimalPlace) } if (d.replace) { if (re1) { d = d.replace(re1, '') } if (re2) { d = d.replace(re2, '') } } return d * 1 }; function _addNumericSort(decimalPlace) { $.each({ "num": function (d) { return __numericReplace(d, decimalPlace) }, "num-fmt": function (d) { return __numericReplace(d, decimalPlace, _re_formatted_numeric) }, "html-num": function (d) { return __numericReplace(d, decimalPlace, _re_html) }, "html-num-fmt": function (d) { return __numericReplace(d, decimalPlace, _re_html, _re_formatted_numeric) } }, function (key, fn) { _ext.type.order[key + decimalPlace + '-pre'] = fn; if (key.match(/^html\-/)) { _ext.type.search[key + decimalPlace] = _ext.type.search.html } }) } $.extend(_ext.type.order, { "date-pre": function (d) { return Date.parse(d) || 0 }, "html-pre": function (a) { return _empty(a) ? '' : a.replace ? a.replace(/<.*?>/g, "").toLowerCase() : a + '' }, "string-pre": function (a) { return _empty(a) ? '' : typeof a === 'string' ? a.toLowerCase() : !a.toString ? '' : a.toString() }, "string-asc": function (x, y) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)) }, "string-desc": function (x, y) { return ((x < y) ? 1 : ((x > y) ? -1 : 0)) } }); _addNumericSort(''); $.extend(true, DataTable.ext.renderer, { header: { _: function (settings, cell, column, classes) { $(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) { if (settings !== ctx) { return } var colIdx = column.idx; cell.removeClass(column.sSortingClass + ' ' + classes.sSortAsc + ' ' + classes.sSortDesc).addClass(columns[colIdx] == 'asc' ? classes.sSortAsc : columns[colIdx] == 'desc' ? classes.sSortDesc : column.sSortingClass) }) }, jqueryui: function (settings, cell, column, classes) { $('<div/>').addClass(classes.sSortJUIWrapper).append(cell.contents()).append($('<span/>').addClass(classes.sSortIcon + ' ' + column.sSortingClassJUI)).appendTo(cell); $(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) { if (settings !== ctx) { return } var colIdx = column.idx; cell.removeClass(classes.sSortAsc + " " + classes.sSortDesc).addClass(columns[colIdx] == 'asc' ? classes.sSortAsc : columns[colIdx] == 'desc' ? classes.sSortDesc : column.sSortingClass); cell.find('span.' + classes.sSortIcon).removeClass(classes.sSortJUIAsc + " " + classes.sSortJUIDesc + " " + classes.sSortJUI + " " + classes.sSortJUIAscAllowed + " " + classes.sSortJUIDescAllowed).addClass(columns[colIdx] == 'asc' ? classes.sSortJUIAsc : columns[colIdx] == 'desc' ? classes.sSortJUIDesc : column.sSortingClassJUI) }) } } }); DataTable.render = { number: function (thousands, decimal, precision, prefix, postfix) { return { display: function (d) { if (typeof d !== 'number' && typeof d !== 'string') { return d } var negative = d < 0 ? '-' : ''; var flo = parseFloat(d); if (isNaN(flo)) { return d } d = Math.abs(flo); var intPart = parseInt(d, 10); var floatPart = precision ? decimal + (d - intPart).toFixed(precision).substring(2) : ''; return negative + (prefix || '') + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + floatPart + (postfix || '') } } }, text: function () { return { display: function (d) { return typeof d === 'string' ? d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : d } } } }; function _fnExternApiFunc(fn) { return function () { var args = [_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments)); return DataTable.ext.internal[fn].apply(this, args) } } $.extend(DataTable.ext.internal, { _fnExternApiFunc: _fnExternApiFunc, _fnBuildAjax: _fnBuildAjax, _fnAjaxUpdate: _fnAjaxUpdate, _fnAjaxParameters: _fnAjaxParameters, _fnAjaxUpdateDraw: _fnAjaxUpdateDraw, _fnAjaxDataSrc: _fnAjaxDataSrc, _fnAddColumn: _fnAddColumn, _fnColumnOptions: _fnColumnOptions, _fnAdjustColumnSizing: _fnAdjustColumnSizing, _fnVisibleToColumnIndex: _fnVisibleToColumnIndex, _fnColumnIndexToVisible: _fnColumnIndexToVisible, _fnVisbleColumns: _fnVisbleColumns, _fnGetColumns: _fnGetColumns, _fnColumnTypes: _fnColumnTypes, _fnApplyColumnDefs: _fnApplyColumnDefs, _fnHungarianMap: _fnHungarianMap, _fnCamelToHungarian: _fnCamelToHungarian, _fnLanguageCompat: _fnLanguageCompat, _fnBrowserDetect: _fnBrowserDetect, _fnAddData: _fnAddData, _fnAddTr: _fnAddTr, _fnNodeToDataIndex: _fnNodeToDataIndex, _fnNodeToColumnIndex: _fnNodeToColumnIndex, _fnGetCellData: _fnGetCellData, _fnSetCellData: _fnSetCellData, _fnSplitObjNotation: _fnSplitObjNotation, _fnGetObjectDataFn: _fnGetObjectDataFn, _fnSetObjectDataFn: _fnSetObjectDataFn, _fnGetDataMaster: _fnGetDataMaster, _fnClearTable: _fnClearTable, _fnDeleteIndex: _fnDeleteIndex, _fnInvalidate: _fnInvalidate, _fnGetRowElements: _fnGetRowElements, _fnCreateTr: _fnCreateTr, _fnBuildHead: _fnBuildHead, _fnDrawHead: _fnDrawHead, _fnDraw: _fnDraw, _fnReDraw: _fnReDraw, _fnAddOptionsHtml: _fnAddOptionsHtml, _fnDetectHeader: _fnDetectHeader, _fnGetUniqueThs: _fnGetUniqueThs, _fnFeatureHtmlFilter: _fnFeatureHtmlFilter, _fnFilterComplete: _fnFilterComplete, _fnFilterCustom: _fnFilterCustom, _fnFilterColumn: _fnFilterColumn, _fnFilter: _fnFilter, _fnFilterCreateSearch: _fnFilterCreateSearch, _fnEscapeRegex: _fnEscapeRegex, _fnFilterData: _fnFilterData, _fnFeatureHtmlInfo: _fnFeatureHtmlInfo, _fnUpdateInfo: _fnUpdateInfo, _fnInfoMacros: _fnInfoMacros, _fnInitialise: _fnInitialise, _fnInitComplete: _fnInitComplete, _fnLengthChange: _fnLengthChange, _fnFeatureHtmlLength: _fnFeatureHtmlLength, _fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate, _fnPageChange: _fnPageChange, _fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing, _fnProcessingDisplay: _fnProcessingDisplay, _fnFeatureHtmlTable: _fnFeatureHtmlTable, _fnScrollDraw: _fnScrollDraw, _fnApplyToChildren: _fnApplyToChildren, _fnCalculateColumnWidths: _fnCalculateColumnWidths, _fnThrottle: _fnThrottle, _fnConvertToWidth: _fnConvertToWidth, _fnGetWidestNode: _fnGetWidestNode, _fnGetMaxLenString: _fnGetMaxLenString, _fnStringToCss: _fnStringToCss, _fnSortFlatten: _fnSortFlatten, _fnSort: _fnSort, _fnSortAria: _fnSortAria, _fnSortListener: _fnSortListener, _fnSortAttachListener: _fnSortAttachListener, _fnSortingClasses: _fnSortingClasses, _fnSortData: _fnSortData, _fnSaveState: _fnSaveState, _fnLoadState: _fnLoadState, _fnSettingsFromNode: _fnSettingsFromNode, _fnLog: _fnLog, _fnMap: _fnMap, _fnBindAction: _fnBindAction, _fnCallbackReg: _fnCallbackReg, _fnCallbackFire: _fnCallbackFire, _fnLengthOverflow: _fnLengthOverflow, _fnRenderer: _fnRenderer, _fnDataSource: _fnDataSource, _fnRowAttributes: _fnRowAttributes, _fnCalculateEnd: function () { } }); $.fn.dataTable = DataTable; DataTable.$ = $; $.fn.dataTableSettings = DataTable.settings; $.fn.dataTableExt = DataTable.ext; $.fn.DataTable = function (opts) { return $(this).dataTable(opts).api() }; $.each(DataTable, function (prop, val) { $.fn.DataTable[prop] = val }); return $.fn.dataTable
//}));

/*!
 DataTables 1.10.10
 漏2008-2015 SpryMedia Ltd - datatables.net/license
*/
(function (h) {
    "function" === typeof define && define.amd ? define(["jquery"], function (E) {
        return h(E, window, document)
    }) : "object" === typeof exports ? module.exports = function (E, H) {
        E || (E = window);
        H || (H = "undefined" !== typeof window ? require("jquery") : require("jquery")(E));
        return h(H, E, E.document)
    } : h(jQuery, window, document)
})(function (h, E, H, k) {
    function Y(a) {
        var b, c, d = {};
        h.each(a, function (e) {
            if ((b = e.match(/^([^A-Z]+?)([A-Z])/)) && -1 !== "a aa ai ao as b fn i m o s ".indexOf(b[1] + " ")) c = e.replace(b[0], b[2].toLowerCase()),
            d[c] = e, "o" === b[1] && Y(a[e])
        });
        a._hungarianMap = d
    }

    function J(a, b, c) {
        a._hungarianMap || Y(a);
        var d;
        h.each(b, function (e) {
            d = a._hungarianMap[e];
            if (d !== k && (c || b[d] === k)) "o" === d.charAt(0) ? (b[d] || (b[d] = {}), h.extend(!0, b[d], b[e]), J(a[d], b[d], c)) : b[d] = b[e]
        })
    }

    function Fa(a) {
        var b = m.defaults.oLanguage,
            c = a.sZeroRecords;
        !a.sEmptyTable && (c && "No data available in table" === b.sEmptyTable) && F(a, a, "sZeroRecords", "sEmptyTable");
        !a.sLoadingRecords && (c && "Loading..." === b.sLoadingRecords) && F(a, a, "sZeroRecords", "sLoadingRecords");
        a.sInfoThousands && (a.sThousands = a.sInfoThousands);
        (a = a.sDecimal) && db(a)
    }

    function eb(a) {
        A(a, "ordering", "bSort");
        A(a, "orderMulti", "bSortMulti");
        A(a, "orderClasses", "bSortClasses");
        A(a, "orderCellsTop", "bSortCellsTop");
        A(a, "order", "aaSorting");
        A(a, "orderFixed", "aaSortingFixed");
        A(a, "paging", "bPaginate");
        A(a, "pagingType", "sPaginationType");
        A(a, "pageLength", "iDisplayLength");
        A(a, "searching", "bFilter");
        "boolean" === typeof a.sScrollX && (a.sScrollX = a.sScrollX ? "100%" : "");
        "boolean" === typeof a.scrollX && (a.scrollX =
            a.scrollX ? "100%" : "");
        if (a = a.aoSearchCols)
            for (var b = 0, c = a.length; b < c; b++) a[b] && J(m.models.oSearch, a[b])
    }

    function fb(a) {
        A(a, "orderable", "bSortable");
        A(a, "orderData", "aDataSort");
        A(a, "orderSequence", "asSorting");
        A(a, "orderDataType", "sortDataType");
        var b = a.aDataSort;
        b && !h.isArray(b) && (a.aDataSort = [b])
    }

    function gb(a) {
        if (!m.__browser) {
            var b = {};
            m.__browser = b;
            var c = h("<div/>").css({
                position: "fixed",
                top: 0,
                left: 0,
                height: 1,
                width: 1,
                overflow: "hidden"
            }).append(h("<div/>").css({
                position: "absolute",
                top: 1,
                left: 1,
                width: 100,
                overflow: "scroll"
            }).append(h("<div/>").css({
                width: "100%",
                height: 10
            }))).appendTo("body"),
                d = c.children(),
                e = d.children();
            b.barWidth = d[0].offsetWidth - d[0].clientWidth;
            b.bScrollOversize = 100 === e[0].offsetWidth && 100 !== d[0].clientWidth;
            b.bScrollbarLeft = 1 !== Math.round(e.offset().left);
            b.bBounding = c[0].getBoundingClientRect().width ? !0 : !1;
            c.remove()
        }
        h.extend(a.oBrowser, m.__browser);
        a.oScroll.iBarWidth = m.__browser.barWidth
    }

    function hb(a, b, c, d, e, f) {
        var g, j = !1;
        c !== k && (g = c, j = !0);
        for (; d !== e;) a.hasOwnProperty(d) &&
            (g = j ? b(g, a[d], d, a) : a[d], j = !0, d += f);
        return g
    }

    function Ga(a, b) {
        var c = m.defaults.column,
            d = a.aoColumns.length,
            c = h.extend({}, m.models.oColumn, c, {
                nTh: b ? b : H.createElement("th"),
                sTitle: c.sTitle ? c.sTitle : b ? b.innerHTML : "",
                aDataSort: c.aDataSort ? c.aDataSort : [d],
                mData: c.mData ? c.mData : d,
                idx: d
            });
        a.aoColumns.push(c);
        c = a.aoPreSearchCols;
        c[d] = h.extend({}, m.models.oSearch, c[d]);
        la(a, d, h(b).data())
    }

    function la(a, b, c) {
        var b = a.aoColumns[b],
            d = a.oClasses,
            e = h(b.nTh);
        if (!b.sWidthOrig) {
            b.sWidthOrig = e.attr("width") || null;
            var f =
                (e.attr("style") || "").match(/width:\s*(\d+[pxem%]+)/);
            f && (b.sWidthOrig = f[1])
        }
        c !== k && null !== c && (fb(c), J(m.defaults.column, c), c.mDataProp !== k && !c.mData && (c.mData = c.mDataProp), c.sType && (b._sManualType = c.sType), c.className && !c.sClass && (c.sClass = c.className), h.extend(b, c), F(b, c, "sWidth", "sWidthOrig"), c.iDataSort !== k && (b.aDataSort = [c.iDataSort]), F(b, c, "aDataSort"));
        var g = b.mData,
            j = Q(g),
            i = b.mRender ? Q(b.mRender) : null,
            c = function (a) {
                return "string" === typeof a && -1 !== a.indexOf("@")
            };
        b._bAttrSrc = h.isPlainObject(g) &&
            (c(g.sort) || c(g.type) || c(g.filter));
        b.fnGetData = function (a, b, c) {
            var d = j(a, b, k, c);
            return i && b ? i(d, b, a, c) : d
        };
        b.fnSetData = function (a, b, c) {
            return R(g)(a, b, c)
        };
        "number" !== typeof g && (a._rowReadObject = !0);
        a.oFeatures.bSort || (b.bSortable = !1, e.addClass(d.sSortableNone));
        a = -1 !== h.inArray("asc", b.asSorting);
        c = -1 !== h.inArray("desc", b.asSorting);
        !b.bSortable || !a && !c ? (b.sSortingClass = d.sSortableNone, b.sSortingClassJUI = "") : a && !c ? (b.sSortingClass = d.sSortableAsc, b.sSortingClassJUI = d.sSortJUIAscAllowed) : !a && c ? (b.sSortingClass =
            d.sSortableDesc, b.sSortingClassJUI = d.sSortJUIDescAllowed) : (b.sSortingClass = d.sSortable, b.sSortingClassJUI = d.sSortJUI)
    }

    function U(a) {
        if (!1 !== a.oFeatures.bAutoWidth) {
            var b = a.aoColumns;
            Ha(a);
            for (var c = 0, d = b.length; c < d; c++) b[c].nTh.style.width = b[c].sWidth
        }
        b = a.oScroll;
        ("" !== b.sY || "" !== b.sX) && Z(a);
        v(a, null, "column-sizing", [a])
    }

    function $(a, b) {
        var c = aa(a, "bVisible");
        return "number" === typeof c[b] ? c[b] : null
    }

    function ba(a, b) {
        var c = aa(a, "bVisible"),
            c = h.inArray(b, c);
        return -1 !== c ? c : null
    }

    function ca(a) {
        return aa(a,
            "bVisible").length
    }

    function aa(a, b) {
        var c = [];
        h.map(a.aoColumns, function (a, e) {
            a[b] && c.push(e)
        });
        return c
    }

    function Ia(a) {
        var b = a.aoColumns,
            c = a.aoData,
            d = m.ext.type.detect,
            e, f, g, j, i, h, l, q, u;
        e = 0;
        for (f = b.length; e < f; e++)
            if (l = b[e], u = [], !l.sType && l._sManualType) l.sType = l._sManualType;
            else if (!l.sType) {
                g = 0;
                for (j = d.length; g < j; g++) {
                    i = 0;
                    for (h = c.length; i < h; i++) {
                        u[i] === k && (u[i] = B(a, i, e, "type"));
                        q = d[g](u[i], a);
                        if (!q && g !== d.length - 1) break;
                        if ("html" === q) break
                    }
                    if (q) {
                        l.sType = q;
                        break
                    }
                }
                l.sType || (l.sType = "string")
            }
    }

    function ib(a,
        b, c, d) {
        var e, f, g, j, i, o, l = a.aoColumns;
        if (b)
            for (e = b.length - 1; 0 <= e; e--) {
                o = b[e];
                var q = o.targets !== k ? o.targets : o.aTargets;
                h.isArray(q) || (q = [q]);
                f = 0;
                for (g = q.length; f < g; f++)
                    if ("number" === typeof q[f] && 0 <= q[f]) {
                        for (; l.length <= q[f];) Ga(a);
                        d(q[f], o)
                    } else if ("number" === typeof q[f] && 0 > q[f]) d(l.length + q[f], o);
                    else if ("string" === typeof q[f]) {
                        j = 0;
                        for (i = l.length; j < i; j++) ("_all" == q[f] || h(l[j].nTh).hasClass(q[f])) && d(j, o)
                    }
            }
        if (c) {
            e = 0;
            for (a = c.length; e < a; e++) d(e, c[e])
        }
    }

    function N(a, b, c, d) {
        var e = a.aoData.length,
            f = h.extend(!0, {}, m.models.oRow, {
                src: c ? "dom" : "data",
                idx: e
            });
        f._aData = b;
        a.aoData.push(f);
        for (var g = a.aoColumns, j = 0, i = g.length; j < i; j++) g[j].sType = null;
        a.aiDisplayMaster.push(e);
        b = a.rowIdFn(b);
        b !== k && (a.aIds[b] = f);
        (c || !a.oFeatures.bDeferRender) && Ja(a, e, c, d);
        return e
    }

    function ma(a, b) {
        var c;
        b instanceof h || (b = h(b));
        return b.map(function (b, e) {
            c = Ka(a, e);
            return N(a, c.data, e, c.cells)
        })
    }

    function B(a, b, c, d) {
        var e = a.iDraw,
            f = a.aoColumns[c],
            g = a.aoData[b]._aData,
            j = f.sDefaultContent,
            i = f.fnGetData(g, d, {
                settings: a,
                row: b,
                col: c
            });
        if (i === k) return a.iDrawError != e && null === j && (K(a, 0, "Requested unknown parameter " + ("function" == typeof f.mData ? "{function}" : "'" + f.mData + "'") + " for row " + b + ", column " + c, 4), a.iDrawError = e), j;
        if ((i === g || null === i) && null !== j) i = j;
        else if ("function" === typeof i) return i.call(g);
        return null === i && "display" == d ? "" : i
    }

    function jb(a, b, c, d) {
        a.aoColumns[c].fnSetData(a.aoData[b]._aData, d, {
            settings: a,
            row: b,
            col: c
        })
    }

    function La(a) {
        return h.map(a.match(/(\\.|[^\.])+/g) || [""], function (a) {
            return a.replace(/\\./g, ".")
        })
    }

    function Q(a) {
        if (h.isPlainObject(a)) {
            var b = {};
            h.each(a, function (a, c) {
                c && (b[a] = Q(c))
            });
            return function (a, c, f, g) {
                var j = b[c] || b._;
                return j !== k ? j(a, c, f, g) : a
            }
        }
        if (null === a) return function (a) {
            return a
        };
        if ("function" === typeof a) return function (b, c, f, g) {
            return a(b, c, f, g)
        };
        if ("string" === typeof a && (-1 !== a.indexOf(".") || -1 !== a.indexOf("[") || -1 !== a.indexOf("("))) {
            var c = function (a, b, f) {
                var g, j;
                if ("" !== f) {
                    j = La(f);
                    for (var i = 0, o = j.length; i < o; i++) {
                        f = j[i].match(da);
                        g = j[i].match(V);
                        if (f) {
                            j[i] = j[i].replace(da, "");
                            "" !== j[i] && (a = a[j[i]]);
                            g = [];
                            j.splice(0, i + 1);
                            j =
                                j.join(".");
                            if (h.isArray(a)) {
                                i = 0;
                                for (o = a.length; i < o; i++) g.push(c(a[i], b, j))
                            }
                            a = f[0].substring(1, f[0].length - 1);
                            a = "" === a ? g : g.join(a);
                            break
                        } else if (g) {
                            j[i] = j[i].replace(V, "");
                            a = a[j[i]]();
                            continue
                        }
                        if (null === a || a[j[i]] === k) return k;
                        a = a[j[i]]
                    }
                }
                return a
            };
            return function (b, e) {
                return c(b, e, a)
            }
        }
        return function (b) {
            return b[a]
        }
    }

    function R(a) {
        if (h.isPlainObject(a)) return R(a._);
        if (null === a) return function () { };
        if ("function" === typeof a) return function (b, d, e) {
            a(b, "set", d, e)
        };
        if ("string" === typeof a && (-1 !== a.indexOf(".") || -1 !== a.indexOf("[") || -1 !== a.indexOf("("))) {
            var b = function (a, d, e) {
                var e = La(e),
                    f;
                f = e[e.length - 1];
                for (var g, j, i = 0, o = e.length - 1; i < o; i++) {
                    g = e[i].match(da);
                    j = e[i].match(V);
                    if (g) {
                        e[i] = e[i].replace(da, "");
                        a[e[i]] = [];
                        f = e.slice();
                        f.splice(0, i + 1);
                        g = f.join(".");
                        if (h.isArray(d)) {
                            j = 0;
                            for (o = d.length; j < o; j++) f = {}, b(f, d[j], g), a[e[i]].push(f)
                        } else a[e[i]] = d;
                        return
                    }
                    j && (e[i] = e[i].replace(V, ""), a = a[e[i]](d));
                    if (null === a[e[i]] || a[e[i]] === k) a[e[i]] = {};
                    a = a[e[i]]
                }
                if (f.match(V)) a[f.replace(V, "")](d);
                else a[f.replace(da, "")] =
                    d
            };
            return function (c, d) {
                return b(c, d, a)
            }
        }
        return function (b, d) {
            b[a] = d
        }
    }

    function Ma(a) {
        return D(a.aoData, "_aData")
    }

    function na(a) {
        a.aoData.length = 0;
        a.aiDisplayMaster.length = 0;
        a.aiDisplay.length = 0;
        a.aIds = {}
    }

    function oa(a, b, c) {
        for (var d = -1, e = 0, f = a.length; e < f; e++) a[e] == b ? d = e : a[e] > b && a[e]--; -1 != d && c === k && a.splice(d, 1)
    }

    function ea(a, b, c, d) {
        var e = a.aoData[b],
            f, g = function (c, d) {
                for (; c.childNodes.length;) c.removeChild(c.firstChild);
                c.innerHTML = B(a, b, d, "display")
            };
        if ("dom" === c || (!c || "auto" === c) && "dom" === e.src) e._aData =
            Ka(a, e, d, d === k ? k : e._aData).data;
        else {
            var j = e.anCells;
            if (j)
                if (d !== k) g(j[d], d);
                else {
                    c = 0;
                    for (f = j.length; c < f; c++) g(j[c], c)
                }
        }
        e._aSortData = null;
        e._aFilterData = null;
        g = a.aoColumns;
        if (d !== k) g[d].sType = null;
        else {
            c = 0;
            for (f = g.length; c < f; c++) g[c].sType = null;
            Na(a, e)
        }
    }

    function Ka(a, b, c, d) {
        var e = [],
            f = b.firstChild,
            g, j, i = 0,
            o, l = a.aoColumns,
            q = a._rowReadObject,
            d = d !== k ? d : q ? {} : [],
            u = function (a, b) {
                if ("string" === typeof a) {
                    var c = a.indexOf("@"); -1 !== c && (c = a.substring(c + 1), R(a)(d, b.getAttribute(c)))
                }
            }, S = function (a) {
                if (c === k ||
                    c === i) j = l[i], o = h.trim(a.innerHTML), j && j._bAttrSrc ? (R(j.mData._)(d, o), u(j.mData.sort, a), u(j.mData.type, a), u(j.mData.filter, a)) : q ? (j._setter || (j._setter = R(j.mData)), j._setter(d, o)) : d[i] = o;
                i++
            };
        if (f)
            for (; f;) {
                g = f.nodeName.toUpperCase();
                if ("TD" == g || "TH" == g) S(f), e.push(f);
                f = f.nextSibling
            } else {
            e = b.anCells;
            f = 0;
            for (g = e.length; f < g; f++) S(e[f])
        } if (b = b.firstChild ? b : b.nTr) (b = b.getAttribute("id")) && R(a.rowId)(d, b);
        return {
            data: d,
            cells: e
        }
    }

    function Ja(a, b, c, d) {
        var e = a.aoData[b],
            f = e._aData,
            g = [],
            j, i, h, l, q;
        if (null ===
            e.nTr) {
            j = c || H.createElement("tr");
            e.nTr = j;
            e.anCells = g;
            j._DT_RowIndex = b;
            Na(a, e);
            l = 0;
            for (q = a.aoColumns.length; l < q; l++) {
                h = a.aoColumns[l];
                i = c ? d[l] : H.createElement(h.sCellType);
                i._DT_CellIndex = {
                    row: b,
                    column: l
                };
                g.push(i);
                if (!c || h.mRender || h.mData !== l) i.innerHTML = B(a, b, l, "display");
                h.sClass && (i.className += " " + h.sClass);
                h.bVisible && !c ? j.appendChild(i) : !h.bVisible && c && i.parentNode.removeChild(i);
                h.fnCreatedCell && h.fnCreatedCell.call(a.oInstance, i, B(a, b, l), f, b, l)
            }
            v(a, "aoRowCreatedCallback", null, [j, f, b])
        }
        e.nTr.setAttribute("role",
            "row")
    }

    function Na(a, b) {
        var c = b.nTr,
            d = b._aData;
        if (c) {
            var e = a.rowIdFn(d);
            e && (c.id = e);
            d.DT_RowClass && (e = d.DT_RowClass.split(" "), b.__rowc = b.__rowc ? pa(b.__rowc.concat(e)) : e, h(c).removeClass(b.__rowc.join(" ")).addClass(d.DT_RowClass));
            d.DT_RowAttr && h(c).attr(d.DT_RowAttr);
            d.DT_RowData && h(c).data(d.DT_RowData)
        }
    }

    function kb(a) {
        var b, c, d, e, f, g = a.nTHead,
            j = a.nTFoot,
            i = 0 === h("th, td", g).length,
            o = a.oClasses,
            l = a.aoColumns;
        i && (e = h("<tr/>").appendTo(g));
        b = 0;
        for (c = l.length; b < c; b++) f = l[b], d = h(f.nTh).addClass(f.sClass),
        i && d.appendTo(e), a.oFeatures.bSort && (d.addClass(f.sSortingClass), !1 !== f.bSortable && (d.attr("tabindex", a.iTabIndex).attr("aria-controls", a.sTableId), Oa(a, f.nTh, b))), f.sTitle != d[0].innerHTML && d.html(f.sTitle), Pa(a, "header")(a, d, f, o);
        i && fa(a.aoHeader, g);
        h(g).find(">tr").attr("role", "row");
        h(g).find(">tr>th, >tr>td").addClass(o.sHeaderTH);
        h(j).find(">tr>th, >tr>td").addClass(o.sFooterTH);
        if (null !== j) {
            a = a.aoFooter[0];
            b = 0;
            for (c = a.length; b < c; b++) f = l[b], f.nTf = a[b].cell, f.sClass && h(f.nTf).addClass(f.sClass)
        }
    }

    function ga(a, b, c) {
        var d, e, f, g = [],
            j = [],
            i = a.aoColumns.length,
            o;
        if (b) {
            c === k && (c = !1);
            d = 0;
            for (e = b.length; d < e; d++) {
                g[d] = b[d].slice();
                g[d].nTr = b[d].nTr;
                for (f = i - 1; 0 <= f; f--) !a.aoColumns[f].bVisible && !c && g[d].splice(f, 1);
                j.push([])
            }
            d = 0;
            for (e = g.length; d < e; d++) {
                if (a = g[d].nTr)
                    for (; f = a.firstChild;) a.removeChild(f);
                f = 0;
                for (b = g[d].length; f < b; f++)
                    if (o = i = 1, j[d][f] === k) {
                        a.appendChild(g[d][f].cell);
                        for (j[d][f] = 1; g[d + i] !== k && g[d][f].cell == g[d + i][f].cell;) j[d + i][f] = 1, i++;
                        for (; g[d][f + o] !== k && g[d][f].cell == g[d][f + o].cell;) {
                            for (c =
                                0; c < i; c++) j[d + c][f + o] = 1;
                            o++
                        }
                        h(g[d][f].cell).attr("rowspan", i).attr("colspan", o)
                    }
            }
        }
    }

    function O(a) {
        var b = v(a, "aoPreDrawCallback", "preDraw", [a]);
        if (-1 !== h.inArray(!1, b)) C(a, !1);
        else {
            var b = [],
                c = 0,
                d = a.asStripeClasses,
                e = d.length,
                f = a.oLanguage,
                g = a.iInitDisplayStart,
                j = "ssp" == y(a),
                i = a.aiDisplay;
            a.bDrawing = !0;
            g !== k && -1 !== g && (a._iDisplayStart = j ? g : g >= a.fnRecordsDisplay() ? 0 : g, a.iInitDisplayStart = -1);
            var g = a._iDisplayStart,
                o = a.fnDisplayEnd();
            if (a.bDeferLoading) a.bDeferLoading = !1, a.iDraw++, C(a, !1);
            else if (j) {
                if (!a.bDestroying && !lb(a)) return
            } else a.iDraw++; if (0 !== i.length) {
                f = j ? a.aoData.length : o;
                for (j = j ? 0 : g; j < f; j++) {
                    var l = i[j],
                        q = a.aoData[l];
                    null === q.nTr && Ja(a, l);
                    l = q.nTr;
                    if (0 !== e) {
                        var u = d[c % e];
                        q._sRowStripe != u && (h(l).removeClass(q._sRowStripe).addClass(u), q._sRowStripe = u)
                    }
                    v(a, "aoRowCallback", null, [l, q._aData, c, j]);
                    b.push(l);
                    c++
                }
            } else c = f.sZeroRecords, 1 == a.iDraw && "ajax" == y(a) ? c = f.sLoadingRecords : f.sEmptyTable && 0 === a.fnRecordsTotal() && (c = f.sEmptyTable), b[0] = h("<tr/>", {
                "class": e ? d[0] : ""
            }).append(h("<td />", {
                valign: "top",
                colSpan: ca(a),
                "class": a.oClasses.sRowEmpty
            }).html(c))[0];
            v(a, "aoHeaderCallback", "header", [h(a.nTHead).children("tr")[0], Ma(a), g, o, i]);
            v(a, "aoFooterCallback", "footer", [h(a.nTFoot).children("tr")[0], Ma(a), g, o, i]);
            d = h(a.nTBody);
            d.children().detach();
            d.append(h(b));
            v(a, "aoDrawCallback", "draw", [a]);
            a.bSorted = !1;
            a.bFiltered = !1;
            a.bDrawing = !1
        }
    }

    function T(a, b) {
        var c = a.oFeatures,
            d = c.bFilter;
        c.bSort && mb(a);
        d ? ha(a, a.oPreviousSearch) : a.aiDisplay = a.aiDisplayMaster.slice();
        !0 !== b && (a._iDisplayStart = 0);
        a._drawHold = b;
        O(a);
        a._drawHold = !1
    }

    function nb(a) {
        var b = a.oClasses,
            c = h(a.nTable),
            c = h("<div/>").insertBefore(c),
            d = a.oFeatures,
            e = h("<div/>", {
                id: a.sTableId + "_wrapper",
                "class": b.sWrapper + (a.nTFoot ? "" : " " + b.sNoFooter)
            });
        a.nHolding = c[0];
        a.nTableWrapper = e[0];
        a.nTableReinsertBefore = a.nTable.nextSibling;
        for (var f = a.sDom.split(""), g, j, i, o, l, q, u = 0; u < f.length; u++) {
            g = null;
            j = f[u];
            if ("<" == j) {
                i = h("<div/>")[0];
                o = f[u + 1];
                if ("'" == o || '"' == o) {
                    l = "";
                    for (q = 2; f[u + q] != o;) l += f[u + q], q++;
                    "H" == l ? l = b.sJUIHeader : "F" == l && (l = b.sJUIFooter); -1 != l.indexOf(".") ? (o = l.split("."),
                        i.id = o[0].substr(1, o[0].length - 1), i.className = o[1]) : "#" == l.charAt(0) ? i.id = l.substr(1, l.length - 1) : i.className = l;
                    u += q
                }
                e.append(i);
                e = h(i)
            } else if (">" == j) e = e.parent();
            else if ("l" == j && d.bPaginate && d.bLengthChange) g = ob(a);
            else if ("f" == j && d.bFilter) g = pb(a);
            else if ("r" == j && d.bProcessing) g = qb(a);
            else if ("t" == j) g = rb(a);
            else if ("i" == j && d.bInfo) g = sb(a);
            else if ("p" == j && d.bPaginate) g = tb(a);
            else if (0 !== m.ext.feature.length) {
                i = m.ext.feature;
                q = 0;
                for (o = i.length; q < o; q++)
                    if (j == i[q].cFeature) {
                        g = i[q].fnInit(a);
                        break
                    }
            }
            g &&
                (i = a.aanFeatures, i[j] || (i[j] = []), i[j].push(g), e.append(g))
        }
        c.replaceWith(e);
        a.nHolding = null
    }

    function fa(a, b) {
        var c = h(b).children("tr"),
            d, e, f, g, j, i, o, l, q, u;
        a.splice(0, a.length);
        f = 0;
        for (i = c.length; f < i; f++) a.push([]);
        f = 0;
        for (i = c.length; f < i; f++) {
            d = c[f];
            for (e = d.firstChild; e;) {
                if ("TD" == e.nodeName.toUpperCase() || "TH" == e.nodeName.toUpperCase()) {
                    l = 1 * e.getAttribute("colspan");
                    q = 1 * e.getAttribute("rowspan");
                    l = !l || 0 === l || 1 === l ? 1 : l;
                    q = !q || 0 === q || 1 === q ? 1 : q;
                    g = 0;
                    for (j = a[f]; j[g];) g++;
                    o = g;
                    u = 1 === l ? !0 : !1;
                    for (j = 0; j < l; j++)
                        for (g =
                            0; g < q; g++) a[f + g][o + j] = {
                                cell: e,
                                unique: u
                            }, a[f + g].nTr = d
                }
                e = e.nextSibling
            }
        }
    }

    function qa(a, b, c) {
        var d = [];
        c || (c = a.aoHeader, b && (c = [], fa(c, b)));
        for (var b = 0, e = c.length; b < e; b++)
            for (var f = 0, g = c[b].length; f < g; f++)
                if (c[b][f].unique && (!d[f] || !a.bSortCellsTop)) d[f] = c[b][f].cell;
        return d
    }

    function ra(a, b, c) {
        v(a, "aoServerParams", "serverParams", [b]);
        if (b && h.isArray(b)) {
            var d = {}, e = /(.*?)\[\]$/;
            h.each(b, function (a, b) {
                var c = b.name.match(e);
                c ? (c = c[0], d[c] || (d[c] = []), d[c].push(b.value)) : d[b.name] = b.value
            });
            b = d
        }
        var f, g = a.ajax,
            j = a.oInstance,
            i = function (b) {
                v(a, null, "xhr", [a, b, a.jqXHR]);
                c(b)
            };
        if (h.isPlainObject(g) && g.data) {
            f = g.data;
            var o = h.isFunction(f) ? f(b, a) : f,
                b = h.isFunction(f) && o ? o : h.extend(!0, b, o);
            delete g.data
        }
        o = {
            data: b,
            success: function (b) {
                var c = b.error || b.sError;
                c && K(a, 0, c);
                a.json = b;
                i(b)
            },
            dataType: "json",
            cache: !1,
            type: a.sServerMethod,
            error: function (b, c) {
                var d = v(a, null, "xhr", [a, null, a.jqXHR]); -1 === h.inArray(!0, d) && ("parsererror" == c ? K(a, 0, "Invalid JSON response", 1) : 4 === b.readyState && K(a, 0, "Ajax error", 7));
                C(a, !1)
            }
        };
        a.oAjaxData =
            b;
        v(a, null, "preXhr", [a, b]);
        a.fnServerData ? a.fnServerData.call(j, a.sAjaxSource, h.map(b, function (a, b) {
            return {
                name: b,
                value: a
            }
        }), i, a) : a.sAjaxSource || "string" === typeof g ? a.jqXHR = h.ajax(h.extend(o, {
            url: g || a.sAjaxSource
        })) : h.isFunction(g) ? a.jqXHR = g.call(j, b, i, a) : (a.jqXHR = h.ajax(h.extend(o, g)), g.data = f)
    }

    function lb(a) {
        return a.bAjaxDataGet ? (a.iDraw++, C(a, !0), ra(a, ub(a), function (b) {
            vb(a, b)
        }), !1) : !0
    }

    function ub(a) {
        var b = a.aoColumns,
            c = b.length,
            d = a.oFeatures,
            e = a.oPreviousSearch,
            f = a.aoPreSearchCols,
            g, j = [],
            i, o,
            l, q = W(a);
        g = a._iDisplayStart;
        i = !1 !== d.bPaginate ? a._iDisplayLength : -1;
        var k = function (a, b) {
            j.push({
                name: a,
                value: b
            })
        };
        k("sEcho", a.iDraw);
        k("iColumns", c);
        k("sColumns", D(b, "sName").join(","));
        k("iDisplayStart", g);
        k("iDisplayLength", i);
        var S = {
            draw: a.iDraw,
            columns: [],
            order: [],
            start: g,
            length: i,
            search: {
                value: e.sSearch,
                regex: e.bRegex
            }
        };
        for (g = 0; g < c; g++) o = b[g], l = f[g], i = "function" == typeof o.mData ? "function" : o.mData, S.columns.push({
            data: i,
            name: o.sName,
            searchable: o.bSearchable,
            orderable: o.bSortable,
            search: {
                value: l.sSearch,
                regex: l.bRegex
            }
        }), k("mDataProp_" + g, i), d.bFilter && (k("sSearch_" + g, l.sSearch), k("bRegex_" + g, l.bRegex), k("bSearchable_" + g, o.bSearchable)), d.bSort && k("bSortable_" + g, o.bSortable);
        d.bFilter && (k("sSearch", e.sSearch), k("bRegex", e.bRegex));
        d.bSort && (h.each(q, function (a, b) {
            S.order.push({
                column: b.col,
                dir: b.dir
            });
            k("iSortCol_" + a, b.col);
            k("sSortDir_" + a, b.dir)
        }), k("iSortingCols", q.length));
        b = m.ext.legacy.ajax;
        return null === b ? a.sAjaxSource ? j : S : b ? j : S
    }

    function vb(a, b) {
        var c = sa(a, b),
            d = b.sEcho !== k ? b.sEcho : b.draw,
            e =
                b.iTotalRecords !== k ? b.iTotalRecords : b.recordsTotal,
            f = b.iTotalDisplayRecords !== k ? b.iTotalDisplayRecords : b.recordsFiltered;
        if (d) {
            if (1 * d < a.iDraw) return;
            a.iDraw = 1 * d
        }
        na(a);
        a._iRecordsTotal = parseInt(e, 10);
        a._iRecordsDisplay = parseInt(f, 10);
        d = 0;
        for (e = c.length; d < e; d++) N(a, c[d]);
        a.aiDisplay = a.aiDisplayMaster.slice();
        a.bAjaxDataGet = !1;
        O(a);
        a._bInitComplete || ta(a, b);
        a.bAjaxDataGet = !0;
        C(a, !1)
    }

    function sa(a, b) {
        var c = h.isPlainObject(a.ajax) && a.ajax.dataSrc !== k ? a.ajax.dataSrc : a.sAjaxDataProp;
        return "data" === c ? b.aaData ||
            b[c] : "" !== c ? Q(c)(b) : b
    }

    function pb(a) {
        var b = a.oClasses,
            c = a.sTableId,
            d = a.oLanguage,
            e = a.oPreviousSearch,
            f = a.aanFeatures,
            g = '<input type="search" class="' + b.sFilterInput + '"/>',
            j = d.sSearch,
            j = j.match(/_INPUT_/) ? j.replace("_INPUT_", g) : j + g,
            b = h("<div/>", {
                id: !f.f ? c + "_filter" : null,
                "class": b.sFilter
            }).append(h("<label/>").append(j)),
            f = function () {
                var b = !this.value ? "" : this.value;
                b != e.sSearch && (ha(a, {
                    sSearch: b,
                    bRegex: e.bRegex,
                    bSmart: e.bSmart,
                    bCaseInsensitive: e.bCaseInsensitive
                }), a._iDisplayStart = 0, O(a))
            }, g = null !==
                a.searchDelay ? a.searchDelay : "ssp" === y(a) ? 400 : 0,
            i = h("input", b).val(e.sSearch).attr("placeholder", d.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT", g ? ua(f, g) : f).bind("keypress.DT", function (a) {
                if (13 == a.keyCode) return !1
            }).attr("aria-controls", c);
        h(a.nTable).on("search.dt.DT", function (b, c) {
            if (a === c) try {
                i[0] !== H.activeElement && i.val(e.sSearch)
            } catch (d) { }
        });
        return b[0]
    }

    function ha(a, b, c) {
        var d = a.oPreviousSearch,
            e = a.aoPreSearchCols,
            f = function (a) {
                d.sSearch = a.sSearch;
                d.bRegex = a.bRegex;
                d.bSmart = a.bSmart;
                d.bCaseInsensitive = a.bCaseInsensitive
            };
        Ia(a);
        if ("ssp" != y(a)) {
            wb(a, b.sSearch, c, b.bEscapeRegex !== k ? !b.bEscapeRegex : b.bRegex, b.bSmart, b.bCaseInsensitive);
            f(b);
            for (b = 0; b < e.length; b++) xb(a, e[b].sSearch, b, e[b].bEscapeRegex !== k ? !e[b].bEscapeRegex : e[b].bRegex, e[b].bSmart, e[b].bCaseInsensitive);
            yb(a)
        } else f(b);
        a.bFiltered = !0;
        v(a, null, "search", [a])
    }

    function yb(a) {
        for (var b = m.ext.search, c = a.aiDisplay, d, e, f = 0, g = b.length; f < g; f++) {
            for (var j = [], i = 0, o = c.length; i < o; i++) e = c[i], d = a.aoData[e], b[f](a,
                d._aFilterData, e, d._aData, i) && j.push(e);
            c.length = 0;
            h.merge(c, j)
        }
    }

    function xb(a, b, c, d, e, f) {
        if ("" !== b)
            for (var g = a.aiDisplay, d = Qa(b, d, e, f), e = g.length - 1; 0 <= e; e--) b = a.aoData[g[e]]._aFilterData[c], d.test(b) || g.splice(e, 1)
    }

    function wb(a, b, c, d, e, f) {
        var d = Qa(b, d, e, f),
            e = a.oPreviousSearch.sSearch,
            f = a.aiDisplayMaster,
            g;
        0 !== m.ext.search.length && (c = !0);
        g = zb(a);
        if (0 >= b.length) a.aiDisplay = f.slice();
        else {
            if (g || c || e.length > b.length || 0 !== b.indexOf(e) || a.bSorted) a.aiDisplay = f.slice();
            b = a.aiDisplay;
            for (c = b.length - 1; 0 <=
                c; c--) d.test(a.aoData[b[c]]._sFilterRow) || b.splice(c, 1)
        }
    }

    function Qa(a, b, c, d) {
        a = b ? a : va(a);
        c && (a = "^(?=.*?" + h.map(a.match(/"[^"]+"|[^ ]+/g) || [""], function (a) {
            if ('"' === a.charAt(0)) var b = a.match(/^"(.*)"$/),
            a = b ? b[1] : a;
            return a.replace('"', "")
        }).join(")(?=.*?") + ").*$");
        return RegExp(a, d ? "i" : "")
    }

    function va(a) {
        return a.replace(Yb, "\\$1")
    }

    function zb(a) {
        var b = a.aoColumns,
            c, d, e, f, g, j, i, h, l = m.ext.type.search;
        c = !1;
        d = 0;
        for (f = a.aoData.length; d < f; d++)
            if (h = a.aoData[d], !h._aFilterData) {
                j = [];
                e = 0;
                for (g = b.length; e <
                    g; e++) c = b[e], c.bSearchable ? (i = B(a, d, e, "filter"), l[c.sType] && (i = l[c.sType](i)), null === i && (i = ""), "string" !== typeof i && i.toString && (i = i.toString())) : i = "", i.indexOf && -1 !== i.indexOf("&") && (wa.innerHTML = i, i = Zb ? wa.textContent : wa.innerText), i.replace && (i = i.replace(/[\r\n]/g, "")), j.push(i);
                h._aFilterData = j;
                h._sFilterRow = j.join("  ");
                c = !0
            }
        return c
    }

    function Ab(a) {
        return {
            search: a.sSearch,
            smart: a.bSmart,
            regex: a.bRegex,
            caseInsensitive: a.bCaseInsensitive
        }
    }

    function Bb(a) {
        return {
            sSearch: a.search,
            bSmart: a.smart,
            bRegex: a.regex,
            bCaseInsensitive: a.caseInsensitive
        }
    }

    function sb(a) {
        var b = a.sTableId,
            c = a.aanFeatures.i,
            d = h("<div/>", {
                "class": a.oClasses.sInfo,
                id: !c ? b + "_info" : null
            });
        c || (a.aoDrawCallback.push({
            fn: Cb,
            sName: "information"
        }), d.attr("role", "status").attr("aria-live", "polite"), h(a.nTable).attr("aria-describedby", b + "_info"));
        return d[0]
    }

    function Cb(a) {
        var b = a.aanFeatures.i;
        if (0 !== b.length) {
            var c = a.oLanguage,
                d = a._iDisplayStart + 1,
                e = a.fnDisplayEnd(),
                f = a.fnRecordsTotal(),
                g = a.fnRecordsDisplay(),
                j = g ? c.sInfo : c.sInfoEmpty;
            g !== f &&
                (j += " " + c.sInfoFiltered);
            j += c.sInfoPostFix;
            j = Db(a, j);
            c = c.fnInfoCallback;
            null !== c && (j = c.call(a.oInstance, a, d, e, f, g, j));
            h(b).html(j)
        }
    }

    function Db(a, b) {
        var c = a.fnFormatNumber,
            d = a._iDisplayStart + 1,
            e = a._iDisplayLength,
            f = a.fnRecordsDisplay(),
            g = -1 === e;
        return b.replace(/_START_/g, c.call(a, d)).replace(/_END_/g, c.call(a, a.fnDisplayEnd())).replace(/_MAX_/g, c.call(a, a.fnRecordsTotal())).replace(/_TOTAL_/g, c.call(a, f)).replace(/_PAGE_/g, c.call(a, g ? 1 : Math.ceil(d / e))).replace(/_PAGES_/g, c.call(a, g ? 1 : Math.ceil(f /
            e)))
    }

    function ia(a) {
        var b, c, d = a.iInitDisplayStart,
            e = a.aoColumns,
            f;
        c = a.oFeatures;
        var g = a.bDeferLoading;
        if (a.bInitialised) {
            nb(a);
            kb(a);
            ga(a, a.aoHeader);
            ga(a, a.aoFooter);
            C(a, !0);
            c.bAutoWidth && Ha(a);
            b = 0;
            for (c = e.length; b < c; b++) f = e[b], f.sWidth && (f.nTh.style.width = w(f.sWidth));
            v(a, null, "preInit", [a]);
            T(a);
            e = y(a);
            if ("ssp" != e || g) "ajax" == e ? ra(a, [], function (c) {
                var f = sa(a, c);
                for (b = 0; b < f.length; b++) N(a, f[b]);
                a.iInitDisplayStart = d;
                T(a);
                C(a, !1);
                ta(a, c)
            }, a) : (C(a, !1), ta(a))
        } else setTimeout(function () {
            ia(a)
        }, 200)
    }

    function ta(a, b) {
        a._bInitComplete = !0;
        (b || a.oInit.aaData) && U(a);
        v(a, null, "plugin-init", [a, b]);
        v(a, "aoInitComplete", "init", [a, b])
    }

    function Ra(a, b) {
        var c = parseInt(b, 10);
        a._iDisplayLength = c;
        Sa(a);
        v(a, null, "length", [a, c])
    }

    function ob(a) {
        for (var b = a.oClasses, c = a.sTableId, d = a.aLengthMenu, e = h.isArray(d[0]), f = e ? d[0] : d, d = e ? d[1] : d, e = h("<select/>", {
            name: c + "_length",
                "aria-controls": c,
                "class": b.sLengthSelect
        }), g = 0, j = f.length; g < j; g++) e[0][g] = new Option(d[g], f[g]);
        var i = h("<div><label/></div>").addClass(b.sLength);
        a.aanFeatures.l || (i[0].id = c + "_length");
        i.children().append(a.oLanguage.sLengthMenu.replace("_MENU_", e[0].outerHTML));
        h("select", i).val(a._iDisplayLength).bind("change.DT", function () {
            Ra(a, h(this).val());
            O(a)
        });
        h(a.nTable).bind("length.dt.DT", function (b, c, d) {
            a === c && h("select", i).val(d)
        });
        return i[0]
    }

    function tb(a) {
        var b = a.sPaginationType,
            c = m.ext.pager[b],
            d = "function" === typeof c,
            e = function (a) {
                O(a)
            }, b = h("<div/>").addClass(a.oClasses.sPaging + b)[0],
            f = a.aanFeatures;
        d || c.fnInit(a, b, e);
        f.p || (b.id = a.sTableId +
            "_paginate", a.aoDrawCallback.push({
                fn: function (a) {
                    if (d) {
                        var b = a._iDisplayStart,
                            i = a._iDisplayLength,
                            h = a.fnRecordsDisplay(),
                            l = -1 === i,
                            b = l ? 0 : Math.ceil(b / i),
                            i = l ? 1 : Math.ceil(h / i),
                            h = c(b, i),
                            k, l = 0;
                        for (k = f.p.length; l < k; l++) Pa(a, "pageButton")(a, f.p[l], l, h, b, i)
                    } else c.fnUpdate(a, e)
                },
                sName: "pagination"
            }));
        return b
    }

    function Ta(a, b, c) {
        var d = a._iDisplayStart,
            e = a._iDisplayLength,
            f = a.fnRecordsDisplay();
        0 === f || -1 === e ? d = 0 : "number" === typeof b ? (d = b * e, d > f && (d = 0)) : "first" == b ? d = 0 : "previous" == b ? (d = 0 <= e ? d - e : 0, 0 > d && (d = 0)) : "next" ==
            b ? d + e < f && (d += e) : "last" == b ? d = Math.floor((f - 1) / e) * e : K(a, 0, "Unknown paging action: " + b, 5);
        b = a._iDisplayStart !== d;
        a._iDisplayStart = d;
        b && (v(a, null, "page", [a]), c && O(a));
        return b
    }

    function qb(a) {
        return h("<div/>", {
            id: !a.aanFeatures.r ? a.sTableId + "_processing" : null,
            "class": a.oClasses.sProcessing
        }).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]
    }

    function C(a, b) {
        a.oFeatures.bProcessing && h(a.aanFeatures.r).css("display", b ? "block" : "none");
        v(a, null, "processing", [a, b])
    }

    function rb(a) {
        var b = h(a.nTable);
        b.attr("role",
            "grid");
        var c = a.oScroll;
        if ("" === c.sX && "" === c.sY) return a.nTable;
        var d = c.sX,
            e = c.sY,
            f = a.oClasses,
            g = b.children("caption"),
            j = g.length ? g[0]._captionSide : null,
            i = h(b[0].cloneNode(!1)),
            o = h(b[0].cloneNode(!1)),
            l = b.children("tfoot");
        l.length || (l = null);
        i = h("<div/>", {
            "class": f.sScrollWrapper
        }).append(h("<div/>", {
            "class": f.sScrollHead
        }).css({
            overflow: "hidden",
            position: "relative",
            border: 0,
            width: d ? !d ? null : w(d) : "100%"
        }).append(h("<div/>", {
            "class": f.sScrollHeadInner
        }).css({
            "box-sizing": "content-box",
            width: c.sXInner || "100%"
        }).append(i.removeAttr("id").css("margin-left", 0).append("top" === j ? g : null).append(b.children("thead"))))).append(h("<div/>", {
            "class": f.sScrollBody
        }).css({
            position: "relative",
            overflow: "auto",
            width: !d ? null : w(d)
        }).append(b));
        l && i.append(h("<div/>", {
            "class": f.sScrollFoot
        }).css({
            overflow: "hidden",
            border: 0,
            width: d ? !d ? null : w(d) : "100%"
        }).append(h("<div/>", {
            "class": f.sScrollFootInner
        }).append(o.removeAttr("id").css("margin-left", 0).append("bottom" === j ? g : null).append(b.children("tfoot")))));
        var b = i.children(),
            k = b[0],
            f = b[1],
            u = l ? b[2] : null;
        if (d) h(f).on("scroll.DT", function () {
            var a = this.scrollLeft;
            k.scrollLeft = a;
            l && (u.scrollLeft = a)
        });
        h(f).css(e && c.bCollapse ? "max-height" : "height", e);
        a.nScrollHead = k;
        a.nScrollBody = f;
        a.nScrollFoot = u;
        a.aoDrawCallback.push({
            fn: Z,
            sName: "scrolling"
        });
        return i[0]
    }

    function Z(a) {
        var b = a.oScroll,
            c = b.sX,
            d = b.sXInner,
            e = b.sY,
            b = b.iBarWidth,
            f = h(a.nScrollHead),
            g = f[0].style,
            j = f.children("div"),
            i = j[0].style,
            o = j.children("table"),
            j = a.nScrollBody,
            l = h(j),
            q = j.style,
            u = h(a.nScrollFoot).children("div"),
            m = u.children("table"),
            n = h(a.nTHead),
            p = h(a.nTable),
            t = p[0],
            v = t.style,
            r = a.nTFoot ? h(a.nTFoot) : null,
            Eb = a.oBrowser,
            Ua = Eb.bScrollOversize,
            s, L, P, x, y = [],
            z = [],
            A = [],
            B, C = function (a) {
                a = a.style;
                a.paddingTop = "0";
                a.paddingBottom = "0";
                a.borderTopWidth = "0";
                a.borderBottomWidth = "0";
                a.height = 0
            };
        L = j.scrollHeight > j.clientHeight;
        if (a.scrollBarVis !== L && a.scrollBarVis !== k) a.scrollBarVis = L, U(a);
        else {
            a.scrollBarVis = L;
            p.children("thead, tfoot").remove();
            x = n.clone().prependTo(p);
            n = n.find("tr");
            L = x.find("tr");
            x.find("th, td").removeAttr("tabindex");
            r && (P = r.clone().prependTo(p), s = r.find("tr"), P = P.find("tr"));
            c || (q.width = "100%", f[0].style.width = "100%");
            h.each(qa(a, x), function (b, c) {
                B = $(a, b);
                c.style.width = a.aoColumns[B].sWidth
            });
            r && I(function (a) {
                a.style.width = ""
            }, P);
            f = p.outerWidth();
            if ("" === c) {
                v.width = "100%";
                if (Ua && (p.find("tbody").height() > j.offsetHeight || "scroll" == l.css("overflow-y"))) v.width = w(p.outerWidth() - b);
                f = p.outerWidth()
            } else "" !== d && (v.width = w(d), f = p.outerWidth());
            I(C, L);
            I(function (a) {
                A.push(a.innerHTML);
                y.push(w(h(a).css("width")))
            },
                L);
            I(function (a, b) {
                a.style.width = y[b]
            }, n);
            h(L).height(0);
            r && (I(C, P), I(function (a) {
                z.push(w(h(a).css("width")))
            }, P), I(function (a, b) {
                a.style.width = z[b]
            }, s), h(P).height(0));
            I(function (a, b) {
                a.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + A[b] + "</div>";
                a.style.width = y[b]
            }, L);
            r && I(function (a, b) {
                a.innerHTML = "";
                a.style.width = z[b]
            }, P);
            if (p.outerWidth() < f) {
                s = j.scrollHeight > j.offsetHeight || "scroll" == l.css("overflow-y") ? f + b : f;
                if (Ua && (j.scrollHeight > j.offsetHeight || "scroll" == l.css("overflow-y"))) v.width =
                    w(s - b);
                ("" === c || "" !== d) && K(a, 1, "Possible column misalignment", 6)
            } else s = "100%";
            q.width = w(s);
            g.width = w(s);
            r && (a.nScrollFoot.style.width = w(s));
            !e && Ua && (q.height = w(t.offsetHeight + b));
            c = p.outerWidth();
            o[0].style.width = w(c);
            i.width = w(c);
            d = p.height() > j.clientHeight || "scroll" == l.css("overflow-y");
            e = "padding" + (Eb.bScrollbarLeft ? "Left" : "Right");
            i[e] = d ? b + "px" : "0px";
            r && (m[0].style.width = w(c), u[0].style.width = w(c), u[0].style[e] = d ? b + "px" : "0px");
            l.scroll();
            if ((a.bSorted || a.bFiltered) && !a._drawHold) j.scrollTop =
                0
        }
    }

    function I(a, b, c) {
        for (var d = 0, e = 0, f = b.length, g, j; e < f;) {
            g = b[e].firstChild;
            for (j = c ? c[e].firstChild : null; g;) 1 === g.nodeType && (c ? a(g, j, d) : a(g, d), d++), g = g.nextSibling, j = c ? j.nextSibling : null;
            e++
        }
    }

    function Ha(a) {
        var b = a.nTable,
            c = a.aoColumns,
            d = a.oScroll,
            e = d.sY,
            f = d.sX,
            g = d.sXInner,
            j = c.length,
            i = aa(a, "bVisible"),
            o = h("th", a.nTHead),
            l = b.getAttribute("width"),
            k = b.parentNode,
            u = !1,
            m, n, p = a.oBrowser,
            d = p.bScrollOversize;
        (m = b.style.width) && -1 !== m.indexOf("%") && (l = m);
        for (m = 0; m < i.length; m++) n = c[i[m]], null !== n.sWidth &&
            (n.sWidth = Fb(n.sWidthOrig, k), u = !0);
        if (d || !u && !f && !e && j == ca(a) && j == o.length)
            for (m = 0; m < j; m++) i = $(a, m), null !== i && (c[i].sWidth = w(o.eq(m).width()));
        else {
            j = h(b).clone().css("visibility", "hidden").removeAttr("id");
            j.find("tbody tr").remove();
            var t = h("<tr/>").appendTo(j.find("tbody"));
            j.find("thead, tfoot").remove();
            j.append(h(a.nTHead).clone()).append(h(a.nTFoot).clone());
            j.find("tfoot th, tfoot td").css("width", "");
            o = qa(a, j.find("thead")[0]);
            for (m = 0; m < i.length; m++) n = c[i[m]], o[m].style.width = null !== n.sWidthOrig &&
                "" !== n.sWidthOrig ? w(n.sWidthOrig) : "", n.sWidthOrig && f && h(o[m]).append(h("<div/>").css({
                    width: n.sWidthOrig,
                    margin: 0,
                    padding: 0,
                    border: 0,
                    height: 1
                }));
            if (a.aoData.length)
                for (m = 0; m < i.length; m++) u = i[m], n = c[u], h(Gb(a, u)).clone(!1).append(n.sContentPadding).appendTo(t);
            n = h("<div/>").css(f || e ? {
                position: "absolute",
                top: 0,
                left: 0,
                height: 1,
                right: 0,
                overflow: "hidden"
            } : {}).append(j).appendTo(k);
            f && g ? j.width(g) : f ? (j.css("width", "auto"), j.removeAttr("width"), j.width() < k.clientWidth && l && j.width(k.clientWidth)) : e ? j.width(k.clientWidth) :
                l && j.width(l);
            for (m = e = 0; m < i.length; m++) k = h(o[m]), g = k.outerWidth() - k.width(), k = p.bBounding ? Math.ceil(o[m].getBoundingClientRect().width) : k.outerWidth(), e += k, c[i[m]].sWidth = w(k - g);
            b.style.width = w(e);
            n.remove()
        }
        l && (b.style.width = w(l));
        if ((l || f) && !a._reszEvt) b = function () {
            h(E).bind("resize.DT-" + a.sInstance, ua(function () {
                U(a)
            }))
        }, d ? setTimeout(b, 1E3) : b(), a._reszEvt = !0
    }

    function ua(a, b) {
        var c = b !== k ? b : 200,
            d, e;
        return function () {
            var b = this,
                g = +new Date,
                j = arguments;
            d && g < d + c ? (clearTimeout(e), e = setTimeout(function () {
                d =
                    k;
                a.apply(b, j)
            }, c)) : (d = g, a.apply(b, j))
        }
    }

    function Fb(a, b) {
        if (!a) return 0;
        var c = h("<div/>").css("width", w(a)).appendTo(b || H.body),
            d = c[0].offsetWidth;
        c.remove();
        return d
    }

    function Gb(a, b) {
        var c = Hb(a, b);
        if (0 > c) return null;
        var d = a.aoData[c];
        return !d.nTr ? h("<td/>").html(B(a, c, b, "display"))[0] : d.anCells[b]
    }

    function Hb(a, b) {
        for (var c, d = -1, e = -1, f = 0, g = a.aoData.length; f < g; f++) c = B(a, f, b, "display") + "", c = c.replace($b, ""), c = c.replace(/&nbsp;/g, " "), c.length > d && (d = c.length, e = f);
        return e
    }

    function w(a) {
        return null ===
            a ? "0px" : "number" == typeof a ? 0 > a ? "0px" : a + "px" : a.match(/\d$/) ? a + "px" : a
    }

    function W(a) {
        var b, c, d = [],
            e = a.aoColumns,
            f, g, j, i;
        b = a.aaSortingFixed;
        c = h.isPlainObject(b);
        var o = [];
        f = function (a) {
            a.length && !h.isArray(a[0]) ? o.push(a) : h.merge(o, a)
        };
        h.isArray(b) && f(b);
        c && b.pre && f(b.pre);
        f(a.aaSorting);
        c && b.post && f(b.post);
        for (a = 0; a < o.length; a++) {
            i = o[a][0];
            f = e[i].aDataSort;
            b = 0;
            for (c = f.length; b < c; b++) g = f[b], j = e[g].sType || "string", o[a]._idx === k && (o[a]._idx = h.inArray(o[a][1], e[g].asSorting)), d.push({
                src: i,
                col: g,
                dir: o[a][1],
                index: o[a]._idx,
                type: j,
                formatter: m.ext.type.order[j + "-pre"]
            })
        }
        return d
    }

    function mb(a) {
        var b, c, d = [],
            e = m.ext.type.order,
            f = a.aoData,
            g = 0,
            j, i = a.aiDisplayMaster,
            h;
        Ia(a);
        h = W(a);
        b = 0;
        for (c = h.length; b < c; b++) j = h[b], j.formatter && g++, Ib(a, j.col);
        if ("ssp" != y(a) && 0 !== h.length) {
            b = 0;
            for (c = i.length; b < c; b++) d[i[b]] = b;
            g === h.length ? i.sort(function (a, b) {
                var c, e, g, j, i = h.length,
                    k = f[a]._aSortData,
                    m = f[b]._aSortData;
                for (g = 0; g < i; g++)
                    if (j = h[g], c = k[j.col], e = m[j.col], c = c < e ? -1 : c > e ? 1 : 0, 0 !== c) return "asc" === j.dir ? c : -c;
                c = d[a];
                e = d[b];
                return c < e ? -1 : c > e ? 1 : 0
            }) : i.sort(function (a, b) {
                var c, g, j, i, k = h.length,
                    m = f[a]._aSortData,
                    p = f[b]._aSortData;
                for (j = 0; j < k; j++)
                    if (i = h[j], c = m[i.col], g = p[i.col], i = e[i.type + "-" + i.dir] || e["string-" + i.dir], c = i(c, g), 0 !== c) return c;
                c = d[a];
                g = d[b];
                return c < g ? -1 : c > g ? 1 : 0
            })
        }
        a.bSorted = !0
    }

    function Jb(a) {
        for (var b, c, d = a.aoColumns, e = W(a), a = a.oLanguage.oAria, f = 0, g = d.length; f < g; f++) {
            c = d[f];
            var j = c.asSorting;
            b = c.sTitle.replace(/<.*?>/g, "");
            var i = c.nTh;
            i.removeAttribute("aria-sort");
            c.bSortable && (0 < e.length && e[0].col == f ? (i.setAttribute("aria-sort",
                "asc" == e[0].dir ? "ascending" : "descending"), c = j[e[0].index + 1] || j[0]) : c = j[0], b += "asc" === c ? a.sSortAscending : a.sSortDescending);
            i.setAttribute("aria-label", b)
        }
    }

    function Va(a, b, c, d) {
        var e = a.aaSorting,
            f = a.aoColumns[b].asSorting,
            g = function (a, b) {
                var c = a._idx;
                c === k && (c = h.inArray(a[1], f));
                return c + 1 < f.length ? c + 1 : b ? null : 0
            };
        "number" === typeof e[0] && (e = a.aaSorting = [e]);
        c && a.oFeatures.bSortMulti ? (c = h.inArray(b, D(e, "0")), -1 !== c ? (b = g(e[c], !0), null === b && 1 === e.length && (b = 0), null === b ? e.splice(c, 1) : (e[c][1] = f[b], e[c]._idx =
            b)) : (e.push([b, f[0], 0]), e[e.length - 1]._idx = 0)) : e.length && e[0][0] == b ? (b = g(e[0]), e.length = 1, e[0][1] = f[b], e[0]._idx = b) : (e.length = 0, e.push([b, f[0]]), e[0]._idx = 0);
        T(a);
        "function" == typeof d && d(a)
    }

    function Oa(a, b, c, d) {
        var e = a.aoColumns[c];
        Wa(b, {}, function (b) {
            !1 !== e.bSortable && (a.oFeatures.bProcessing ? (C(a, !0), setTimeout(function () {
                Va(a, c, b.shiftKey, d);
                "ssp" !== y(a) && C(a, !1)
            }, 0)) : Va(a, c, b.shiftKey, d))
        })
    }

    function xa(a) {
        var b = a.aLastSort,
            c = a.oClasses.sSortColumn,
            d = W(a),
            e = a.oFeatures,
            f, g;
        if (e.bSort && e.bSortClasses) {
            e =
                0;
            for (f = b.length; e < f; e++) g = b[e].src, h(D(a.aoData, "anCells", g)).removeClass(c + (2 > e ? e + 1 : 3));
            e = 0;
            for (f = d.length; e < f; e++) g = d[e].src, h(D(a.aoData, "anCells", g)).addClass(c + (2 > e ? e + 1 : 3))
        }
        a.aLastSort = d
    }

    function Ib(a, b) {
        var c = a.aoColumns[b],
            d = m.ext.order[c.sSortDataType],
            e;
        d && (e = d.call(a.oInstance, a, b, ba(a, b)));
        for (var f, g = m.ext.type.order[c.sType + "-pre"], j = 0, i = a.aoData.length; j < i; j++)
            if (c = a.aoData[j], c._aSortData || (c._aSortData = []), !c._aSortData[b] || d) f = d ? e[j] : B(a, j, b, "sort"), c._aSortData[b] = g ? g(f) : f
    }

    function ya(a) {
        if (a.oFeatures.bStateSave && !a.bDestroying) {
            var b = {
                time: +new Date,
                start: a._iDisplayStart,
                length: a._iDisplayLength,
                order: h.extend(!0, [], a.aaSorting),
                search: Ab(a.oPreviousSearch),
                columns: h.map(a.aoColumns, function (b, d) {
                    return {
                        visible: b.bVisible,
                        search: Ab(a.aoPreSearchCols[d])
                    }
                })
            };
            v(a, "aoStateSaveParams", "stateSaveParams", [a, b]);
            a.oSavedState = b;
            a.fnStateSaveCallback.call(a.oInstance, a, b)
        }
    }

    function Kb(a) {
        var b, c, d = a.aoColumns;
        if (a.oFeatures.bStateSave) {
            var e = a.fnStateLoadCallback.call(a.oInstance, a);
            if (e && e.time && (b = v(a, "aoStateLoadParams",
                "stateLoadParams", [a, e]), -1 === h.inArray(!1, b) && (b = a.iStateDuration, !(0 < b && e.time < +new Date - 1E3 * b) && d.length === e.columns.length))) {
                a.oLoadedState = h.extend(!0, {}, e);
                e.start !== k && (a._iDisplayStart = e.start, a.iInitDisplayStart = e.start);
                e.length !== k && (a._iDisplayLength = e.length);
                e.order !== k && (a.aaSorting = [], h.each(e.order, function (b, c) {
                    a.aaSorting.push(c[0] >= d.length ? [0, c[1]] : c)
                }));
                e.search !== k && h.extend(a.oPreviousSearch, Bb(e.search));
                b = 0;
                for (c = e.columns.length; b < c; b++) {
                    var f = e.columns[b];
                    f.visible !==
                        k && (d[b].bVisible = f.visible);
                    f.search !== k && h.extend(a.aoPreSearchCols[b], Bb(f.search))
                }
                v(a, "aoStateLoaded", "stateLoaded", [a, e])
            }
        }
    }

    function za(a) {
        var b = m.settings,
            a = h.inArray(a, D(b, "nTable"));
        return -1 !== a ? b[a] : null
    }

    function K(a, b, c, d) {
        c = "DataTables warning: " + (a ? "table id=" + a.sTableId + " - " : "") + c;
        d && (c += ". For more information about this error, please see http://datatables.net/tn/" + d);
        if (b) E.console && console.log && console.log(c);
        else if (b = m.ext, b = b.sErrMode || b.errMode, a && v(a, null, "error", [a, d, c]), "alert" ==
            b) alert(c);
        else {
            if ("throw" == b) throw Error(c);
            "function" == typeof b && b(a, d, c)
        }
    }

    function F(a, b, c, d) {
        h.isArray(c) ? h.each(c, function (c, d) {
            h.isArray(d) ? F(a, b, d[0], d[1]) : F(a, b, d)
        }) : (d === k && (d = c), b[c] !== k && (a[d] = b[c]))
    }

    function Lb(a, b, c) {
        var d, e;
        for (e in b) b.hasOwnProperty(e) && (d = b[e], h.isPlainObject(d) ? (h.isPlainObject(a[e]) || (a[e] = {}), h.extend(!0, a[e], d)) : a[e] = c && "data" !== e && "aaData" !== e && h.isArray(d) ? d.slice() : d);
        return a
    }

    function Wa(a, b, c) {
        h(a).bind("click.DT", b, function (b) {
            a.blur();
            c(b)
        }).bind("keypress.DT",
            b, function (a) {
                13 === a.which && (a.preventDefault(), c(a))
            }).bind("selectstart.DT", function () {
                return !1
            })
    }

    function z(a, b, c, d) {
        c && a[b].push({
            fn: c,
            sName: d
        })
    }

    function v(a, b, c, d) {
        var e = [];
        b && (e = h.map(a[b].slice().reverse(), function (b) {
            return b.fn.apply(a.oInstance, d)
        }));
        null !== c && (b = h.Event(c + ".dt"), h(a.nTable).trigger(b, d), e.push(b.result));
        return e
    }

    function Sa(a) {
        var b = a._iDisplayStart,
            c = a.fnDisplayEnd(),
            d = a._iDisplayLength;
        b >= c && (b = c - d);
        b -= b % d;
        if (-1 === d || 0 > b) b = 0;
        a._iDisplayStart = b
    }

    function Pa(a, b) {
        var c =
            a.renderer,
            d = m.ext.renderer[b];
        return h.isPlainObject(c) && c[b] ? d[c[b]] || d._ : "string" === typeof c ? d[c] || d._ : d._
    }

    function y(a) {
        return a.oFeatures.bServerSide ? "ssp" : a.ajax || a.sAjaxSource ? "ajax" : "dom"
    }

    function Aa(a, b) {
        var c = [],
            c = Mb.numbers_length,
            d = Math.floor(c / 2);
        b <= c ? c = X(0, b) : a <= d ? (c = X(0, c - 2), c.push("ellipsis"), c.push(b - 1)) : (a >= b - 1 - d ? c = X(b - (c - 2), b) : (c = X(a - d + 2, a + d - 1), c.push("ellipsis"), c.push(b - 1)), c.splice(0, 0, "ellipsis"), c.splice(0, 0, 0));
        c.DT_el = "span";
        return c
    }

    function db(a) {
        h.each({
            num: function (b) {
                return Ba(b,
                    a)
            },
            "num-fmt": function (b) {
                return Ba(b, a, Xa)
            },
            "html-num": function (b) {
                return Ba(b, a, Ca)
            },
            "html-num-fmt": function (b) {
                return Ba(b, a, Ca, Xa)
            }
        }, function (b, c) {
            s.type.order[b + a + "-pre"] = c;
            b.match(/^html\-/) && (s.type.search[b + a] = s.type.search.html)
        })
    }

    function Nb(a) {
        return function () {
            var b = [za(this[m.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));
            return m.ext.internal[a].apply(this, b)
        }
    }
    var m, s, t, p, r, Ya = {}, Ob = /[\r\n]/g,
        Ca = /<.*?>/g,
        ac = /^[\w\+\-]/,
        bc = /[\w\+\-]$/,
        Yb = RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)",
            "g"),
        Xa = /[',$拢鈧�%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi,
        M = function (a) {
            return !a || !0 === a || "-" === a ? !0 : !1
        }, Pb = function (a) {
            var b = parseInt(a, 10);
            return !isNaN(b) && isFinite(a) ? b : null
        }, Qb = function (a, b) {
            Ya[b] || (Ya[b] = RegExp(va(b), "g"));
            return "string" === typeof a && "." !== b ? a.replace(/\./g, "").replace(Ya[b], ".") : a
        }, Za = function (a, b, c) {
            var d = "string" === typeof a;
            if (M(a)) return !0;
            b && d && (a = Qb(a, b));
            c && d && (a = a.replace(Xa, ""));
            return !isNaN(parseFloat(a)) && isFinite(a)
        }, Rb = function (a, b, c) {
            return M(a) ? !0 : !(M(a) || "string" ===
                typeof a) ? null : Za(a.replace(Ca, ""), b, c) ? !0 : null
        }, D = function (a, b, c) {
            var d = [],
                e = 0,
                f = a.length;
            if (c !== k)
                for (; e < f; e++) a[e] && a[e][b] && d.push(a[e][b][c]);
            else
                for (; e < f; e++) a[e] && d.push(a[e][b]);
            return d
        }, ja = function (a, b, c, d) {
            var e = [],
                f = 0,
                g = b.length;
            if (d !== k)
                for (; f < g; f++) a[b[f]][c] && e.push(a[b[f]][c][d]);
            else
                for (; f < g; f++) e.push(a[b[f]][c]);
            return e
        }, X = function (a, b) {
            var c = [],
                d;
            b === k ? (b = 0, d = a) : (d = b, b = a);
            for (var e = b; e < d; e++) c.push(e);
            return c
        }, Sb = function (a) {
            for (var b = [], c = 0, d = a.length; c < d; c++) a[c] && b.push(a[c]);
            return b
        }, pa = function (a) {
            var b = [],
                c, d, e = a.length,
                f, g = 0;
            d = 0;
            a: for (; d < e; d++) {
                c = a[d];
                for (f = 0; f < g; f++)
                    if (b[f] === c) continue a;
                b.push(c);
                g++
            }
            return b
        }, A = function (a, b, c) {
            a[b] !== k && (a[c] = a[b])
        }, da = /\[.*?\]$/,
        V = /\(\)$/,
        wa = h("<div>")[0],
        Zb = wa.textContent !== k,
        $b = /<.*?>/g;
    m = function (a) {
        this.$ = function (a, b) {
            return this.api(!0).$(a, b)
        };
        this._ = function (a, b) {
            return this.api(!0).rows(a, b).data()
        };
        this.api = function (a) {
            return a ? new t(za(this[s.iApiIndex])) : new t(this)
        };
        this.fnAddData = function (a, b) {
            var c = this.api(!0),
                d = h.isArray(a) && (h.isArray(a[0]) || h.isPlainObject(a[0])) ? c.rows.add(a) : c.row.add(a);
            (b === k || b) && c.draw();
            return d.flatten().toArray()
        };
        this.fnAdjustColumnSizing = function (a) {
            var b = this.api(!0).columns.adjust(),
                c = b.settings()[0],
                d = c.oScroll;
            a === k || a ? b.draw(!1) : ("" !== d.sX || "" !== d.sY) && Z(c)
        };
        this.fnClearTable = function (a) {
            var b = this.api(!0).clear();
            (a === k || a) && b.draw()
        };
        this.fnClose = function (a) {
            this.api(!0).row(a).child.hide()
        };
        this.fnDeleteRow = function (a, b, c) {
            var d = this.api(!0),
                a = d.rows(a),
                e = a.settings()[0],
                h = e.aoData[a[0][0]];
            a.remove();
            b && b.call(this, e, h);
            (c === k || c) && d.draw();
            return h
        };
        this.fnDestroy = function (a) {
            this.api(!0).destroy(a)
        };
        this.fnDraw = function (a) {
            this.api(!0).draw(a)
        };
        this.fnFilter = function (a, b, c, d, e, h) {
            e = this.api(!0);
            null === b || b === k ? e.search(a, c, d, h) : e.column(b).search(a, c, d, h);
            e.draw()
        };
        this.fnGetData = function (a, b) {
            var c = this.api(!0);
            if (a !== k) {
                var d = a.nodeName ? a.nodeName.toLowerCase() : "";
                return b !== k || "td" == d || "th" == d ? c.cell(a, b).data() : c.row(a).data() || null
            }
            return c.data().toArray()
        };
        this.fnGetNodes = function (a) {
            var b = this.api(!0);
            return a !== k ? b.row(a).node() : b.rows().nodes().flatten().toArray()
        };
        this.fnGetPosition = function (a) {
            var b = this.api(!0),
                c = a.nodeName.toUpperCase();
            return "TR" == c ? b.row(a).index() : "TD" == c || "TH" == c ? (a = b.cell(a).index(), [a.row, a.columnVisible, a.column]) : null
        };
        this.fnIsOpen = function (a) {
            return this.api(!0).row(a).child.isShown()
        };
        this.fnOpen = function (a, b, c) {
            return this.api(!0).row(a).child(b, c).show().child()[0]
        };
        this.fnPageChange = function (a, b) {
            var c = this.api(!0).page(a);
            (b === k || b) && c.draw(!1)
        };
        this.fnSetColumnVis = function (a, b, c) {
            a = this.api(!0).column(a).visible(b);
            (c === k || c) && a.columns.adjust().draw()
        };
        this.fnSettings = function () {
            return za(this[s.iApiIndex])
        };
        this.fnSort = function (a) {
            this.api(!0).order(a).draw()
        };
        this.fnSortListener = function (a, b, c) {
            this.api(!0).order.listener(a, b, c)
        };
        this.fnUpdate = function (a, b, c, d, e) {
            var h = this.api(!0);
            c === k || null === c ? h.row(b).data(a) : h.cell(b, c).data(a);
            (e === k || e) && h.columns.adjust();
            (d === k || d) && h.draw();
            return 0
        };
        this.fnVersionCheck =
            s.fnVersionCheck;
        var b = this,
            c = a === k,
            d = this.length;
        c && (a = {});
        this.oApi = this.internal = s.internal;
        for (var e in m.ext.internal) e && (this[e] = Nb(e));
        this.each(function () {
            var e = {}, e = 1 < d ? Lb(e, a, !0) : a,
                g = 0,
                j, i = this.getAttribute("id"),
                o = !1,
                l = m.defaults,
                q = h(this);
            if ("table" != this.nodeName.toLowerCase()) K(null, 0, "Non-table node initialisation (" + this.nodeName + ")", 2);
            else {
                eb(l);
                fb(l.column);
                J(l, l, !0);
                J(l.column, l.column, !0);
                J(l, h.extend(e, q.data()));
                var u = m.settings,
                    g = 0;
                for (j = u.length; g < j; g++) {
                    var p = u[g];
                    if (p.nTable ==
                        this || p.nTHead.parentNode == this || p.nTFoot && p.nTFoot.parentNode == this) {
                        g = e.bRetrieve !== k ? e.bRetrieve : l.bRetrieve;
                        if (c || g) return p.oInstance;
                        if (e.bDestroy !== k ? e.bDestroy : l.bDestroy) {
                            p.oInstance.fnDestroy();
                            break
                        } else {
                            K(p, 0, "Cannot reinitialise DataTable", 3);
                            return
                        }
                    }
                    if (p.sTableId == this.id) {
                        u.splice(g, 1);
                        break
                    }
                }
                if (null === i || "" === i) this.id = i = "DataTables_Table_" + m.ext._unique++;
                var n = h.extend(!0, {}, m.models.oSettings, {
                    sDestroyWidth: q[0].style.width,
                    sInstance: i,
                    sTableId: i
                });
                n.nTable = this;
                n.oApi = b.internal;
                n.oInit = e;
                u.push(n);
                n.oInstance = 1 === b.length ? b : q.dataTable();
                eb(e);
                e.oLanguage && Fa(e.oLanguage);
                e.aLengthMenu && !e.iDisplayLength && (e.iDisplayLength = h.isArray(e.aLengthMenu[0]) ? e.aLengthMenu[0][0] : e.aLengthMenu[0]);
                e = Lb(h.extend(!0, {}, l), e);
                F(n.oFeatures, e, "bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));
                F(n, e, ["asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed", "aLengthMenu",
                    "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", "rowId", ["iCookieDuration", "iStateDuration"],
                    ["oSearch", "oPreviousSearch"],
                    ["aoSearchCols", "aoPreSearchCols"],
                    ["iDisplayLength", "_iDisplayLength"],
                    ["bJQueryUI", "bJUI"]
                ]);
                F(n.oScroll, e, [
                    ["sScrollX", "sX"],
                    ["sScrollXInner", "sXInner"],
                    ["sScrollY", "sY"],
                    ["bScrollCollapse", "bCollapse"]
                ]);
                F(n.oLanguage, e, "fnInfoCallback");
                z(n, "aoDrawCallback",
                    e.fnDrawCallback, "user");
                z(n, "aoServerParams", e.fnServerParams, "user");
                z(n, "aoStateSaveParams", e.fnStateSaveParams, "user");
                z(n, "aoStateLoadParams", e.fnStateLoadParams, "user");
                z(n, "aoStateLoaded", e.fnStateLoaded, "user");
                z(n, "aoRowCallback", e.fnRowCallback, "user");
                z(n, "aoRowCreatedCallback", e.fnCreatedRow, "user");
                z(n, "aoHeaderCallback", e.fnHeaderCallback, "user");
                z(n, "aoFooterCallback", e.fnFooterCallback, "user");
                z(n, "aoInitComplete", e.fnInitComplete, "user");
                z(n, "aoPreDrawCallback", e.fnPreDrawCallback,
                    "user");
                n.rowIdFn = Q(e.rowId);
                gb(n);
                i = n.oClasses;
                e.bJQueryUI ? (h.extend(i, m.ext.oJUIClasses, e.oClasses), e.sDom === l.sDom && "lfrtip" === l.sDom && (n.sDom = '<"H"lfr>t<"F"ip>'), n.renderer) ? h.isPlainObject(n.renderer) && !n.renderer.header && (n.renderer.header = "jqueryui") : n.renderer = "jqueryui" : h.extend(i, m.ext.classes, e.oClasses);
                q.addClass(i.sTable);
                n.iInitDisplayStart === k && (n.iInitDisplayStart = e.iDisplayStart, n._iDisplayStart = e.iDisplayStart);
                null !== e.iDeferLoading && (n.bDeferLoading = !0, g = h.isArray(e.iDeferLoading),
                    n._iRecordsDisplay = g ? e.iDeferLoading[0] : e.iDeferLoading, n._iRecordsTotal = g ? e.iDeferLoading[1] : e.iDeferLoading);
                var t = n.oLanguage;
                h.extend(!0, t, e.oLanguage);
                "" !== t.sUrl && (h.ajax({
                    dataType: "json",
                    url: t.sUrl,
                    success: function (a) {
                        Fa(a);
                        J(l.oLanguage, a);
                        h.extend(true, t, a);
                        ia(n)
                    },
                    error: function () {
                        ia(n)
                    }
                }), o = !0);
                null === e.asStripeClasses && (n.asStripeClasses = [i.sStripeOdd, i.sStripeEven]);
                var g = n.asStripeClasses,
                    r = q.children("tbody").find("tr").eq(0); -1 !== h.inArray(!0, h.map(g, function (a) {
                        return r.hasClass(a)
                    })) &&
                    (h("tbody tr", this).removeClass(g.join(" ")), n.asDestroyStripes = g.slice());
                u = [];
                g = this.getElementsByTagName("thead");
                0 !== g.length && (fa(n.aoHeader, g[0]), u = qa(n));
                if (null === e.aoColumns) {
                    p = [];
                    g = 0;
                    for (j = u.length; g < j; g++) p.push(null)
                } else p = e.aoColumns;
                g = 0;
                for (j = p.length; g < j; g++) Ga(n, u ? u[g] : null);
                ib(n, e.aoColumnDefs, p, function (a, b) {
                    la(n, a, b)
                });
                if (r.length) {
                    var s = function (a, b) {
                        return a.getAttribute("data-" + b) !== null ? b : null
                    };
                    h(r[0]).children("th, td").each(function (a, b) {
                        var c = n.aoColumns[a];
                        if (c.mData ===
                            a) {
                            var d = s(b, "sort") || s(b, "order"),
                                e = s(b, "filter") || s(b, "search");
                            if (d !== null || e !== null) {
                                c.mData = {
                                    _: a + ".display",
                                    sort: d !== null ? a + ".@data-" + d : k,
                                    type: d !== null ? a + ".@data-" + d : k,
                                    filter: e !== null ? a + ".@data-" + e : k
                                };
                                la(n, a)
                            }
                        }
                    })
                }
                var w = n.oFeatures;
                e.bStateSave && (w.bStateSave = !0, Kb(n, e), z(n, "aoDrawCallback", ya, "state_save"));
                if (e.aaSorting === k) {
                    u = n.aaSorting;
                    g = 0;
                    for (j = u.length; g < j; g++) u[g][1] = n.aoColumns[g].asSorting[0]
                }
                xa(n);
                w.bSort && z(n, "aoDrawCallback", function () {
                    if (n.bSorted) {
                        var a = W(n),
                            b = {};
                        h.each(a, function (a,
                            c) {
                            b[c.src] = c.dir
                        });
                        v(n, null, "order", [n, a, b]);
                        Jb(n)
                    }
                });
                z(n, "aoDrawCallback", function () {
                    (n.bSorted || y(n) === "ssp" || w.bDeferRender) && xa(n)
                }, "sc");
                g = q.children("caption").each(function () {
                    this._captionSide = q.css("caption-side")
                });
                j = q.children("thead");
                0 === j.length && (j = h("<thead/>").appendTo(this));
                n.nTHead = j[0];
                j = q.children("tbody");
                0 === j.length && (j = h("<tbody/>").appendTo(this));
                n.nTBody = j[0];
                j = q.children("tfoot");
                if (0 === j.length && 0 < g.length && ("" !== n.oScroll.sX || "" !== n.oScroll.sY)) j = h("<tfoot/>").appendTo(this);
                0 === j.length || 0 === j.children().length ? q.addClass(i.sNoFooter) : 0 < j.length && (n.nTFoot = j[0], fa(n.aoFooter, n.nTFoot));
                if (e.aaData)
                    for (g = 0; g < e.aaData.length; g++) N(n, e.aaData[g]);
                else (n.bDeferLoading || "dom" == y(n)) && ma(n, h(n.nTBody).children("tr"));
                n.aiDisplay = n.aiDisplayMaster.slice();
                n.bInitialised = !0;
                !1 === o && ia(n)
            }
        });
        b = null;
        return this
    };
    var Tb = [],
        x = Array.prototype,
        cc = function (a) {
            var b, c, d = m.settings,
                e = h.map(d, function (a) {
                    return a.nTable
                });
            if (a) {
                if (a.nTable && a.oApi) return [a];
                if (a.nodeName && "table" === a.nodeName.toLowerCase()) return b =
                    h.inArray(a, e), -1 !== b ? [d[b]] : null;
                if (a && "function" === typeof a.settings) return a.settings().toArray();
                "string" === typeof a ? c = h(a) : a instanceof h && (c = a)
            } else return []; if (c) return c.map(function () {
                b = h.inArray(this, e);
                return -1 !== b ? d[b] : null
            }).toArray()
        };
    t = function (a, b) {
        if (!(this instanceof t)) return new t(a, b);
        var c = [],
            d = function (a) {
                (a = cc(a)) && (c = c.concat(a))
            };
        if (h.isArray(a))
            for (var e = 0, f = a.length; e < f; e++) d(a[e]);
        else d(a);
        this.context = pa(c);
        b && h.merge(this, b);
        this.selector = {
            rows: null,
            cols: null,
            opts: null
        };
        t.extend(this, this, Tb)
    };
    m.Api = t;
    h.extend(t.prototype, {
        any: function () {
            return 0 !== this.count()
        },
        concat: x.concat,
        context: [],
        count: function () {
            return this.flatten().length
        },
        each: function (a) {
            for (var b = 0, c = this.length; b < c; b++) a.call(this, this[b], b, this);
            return this
        },
        eq: function (a) {
            var b = this.context;
            return b.length > a ? new t(b[a], this[a]) : null
        },
        filter: function (a) {
            var b = [];
            if (x.filter) b = x.filter.call(this, a, this);
            else
                for (var c = 0, d = this.length; c < d; c++) a.call(this, this[c], c, this) && b.push(this[c]);
            return new t(this.context,
                b)
        },
        flatten: function () {
            var a = [];
            return new t(this.context, a.concat.apply(a, this.toArray()))
        },
        join: x.join,
        indexOf: x.indexOf || function (a, b) {
            for (var c = b || 0, d = this.length; c < d; c++)
                if (this[c] === a) return c;
            return -1
        },
        iterator: function (a, b, c, d) {
            var e = [],
                f, g, h, i, o, l = this.context,
                m, p, r = this.selector;
            "string" === typeof a && (d = c, c = b, b = a, a = !1);
            g = 0;
            for (h = l.length; g < h; g++) {
                var n = new t(l[g]);
                if ("table" === b) f = c.call(n, l[g], g), f !== k && e.push(f);
                else if ("columns" === b || "rows" === b) f = c.call(n, l[g], this[g], g), f !== k && e.push(f);
                else if ("column" === b || "column-rows" === b || "row" === b || "cell" === b) {
                    p = this[g];
                    "column-rows" === b && (m = Da(l[g], r.opts));
                    i = 0;
                    for (o = p.length; i < o; i++) f = p[i], f = "cell" === b ? c.call(n, l[g], f.row, f.column, g, i) : c.call(n, l[g], f, g, i, m), f !== k && e.push(f)
                }
            }
            return e.length || d ? (a = new t(l, a ? e.concat.apply([], e) : e), b = a.selector, b.rows = r.rows, b.cols = r.cols, b.opts = r.opts, a) : this
        },
        lastIndexOf: x.lastIndexOf || function (a, b) {
            return this.indexOf.apply(this.toArray.reverse(), arguments)
        },
        length: 0,
        map: function (a) {
            var b = [];
            if (x.map) b =
                x.map.call(this, a, this);
            else
                for (var c = 0, d = this.length; c < d; c++) b.push(a.call(this, this[c], c));
            return new t(this.context, b)
        },
        pluck: function (a) {
            return this.map(function (b) {
                return b[a]
            })
        },
        pop: x.pop,
        push: x.push,
        reduce: x.reduce || function (a, b) {
            return hb(this, a, b, 0, this.length, 1)
        },
        reduceRight: x.reduceRight || function (a, b) {
            return hb(this, a, b, this.length - 1, -1, -1)
        },
        reverse: x.reverse,
        selector: null,
        shift: x.shift,
        sort: x.sort,
        splice: x.splice,
        toArray: function () {
            return x.slice.call(this)
        },
        to$: function () {
            return h(this)
        },
        toJQuery: function () {
            return h(this)
        },
        unique: function () {
            return new t(this.context, pa(this))
        },
        unshift: x.unshift
    });
    t.extend = function (a, b, c) {
        if (c.length && b && (b instanceof t || b.__dt_wrapper)) {
            var d, e, f, g = function (a, b, c) {
                return function () {
                    var d = b.apply(a, arguments);
                    t.extend(d, d, c.methodExt);
                    return d
                }
            };
            d = 0;
            for (e = c.length; d < e; d++) f = c[d], b[f.name] = "function" === typeof f.val ? g(a, f.val, f) : h.isPlainObject(f.val) ? {} : f.val, b[f.name].__dt_wrapper = !0, t.extend(a, b[f.name], f.propExt)
        }
    };
    t.register = p = function (a, b) {
        if (h.isArray(a))
            for (var c =
                0, d = a.length; c < d; c++) t.register(a[c], b);
        else
            for (var e = a.split("."), f = Tb, g, j, c = 0, d = e.length; c < d; c++) {
                g = (j = -1 !== e[c].indexOf("()")) ? e[c].replace("()", "") : e[c];
                var i;
                a: {
                    i = 0;
                    for (var k = f.length; i < k; i++)
                        if (f[i].name === g) {
                            i = f[i];
                            break a
                        }
                    i = null
                }
                i || (i = {
                    name: g,
                    val: {},
                    methodExt: [],
                    propExt: []
                }, f.push(i));
                c === d - 1 ? i.val = b : f = j ? i.methodExt : i.propExt
            }
    };
    t.registerPlural = r = function (a, b, c) {
        t.register(a, c);
        t.register(b, function () {
            var a = c.apply(this, arguments);
            return a === this ? this : a instanceof t ? a.length ? h.isArray(a[0]) ?
                new t(a.context, a[0]) : a[0] : k : a
        })
    };
    p("tables()", function (a) {
        var b;
        if (a) {
            b = t;
            var c = this.context;
            if ("number" === typeof a) a = [c[a]];
            else var d = h.map(c, function (a) {
                return a.nTable
            }),
            a = h(d).filter(a).map(function () {
                var a = h.inArray(this, d);
                return c[a]
            }).toArray();
            b = new b(a)
        } else b = this;
        return b
    });
    p("table()", function (a) {
        var a = this.tables(a),
            b = a.context;
        return b.length ? new t(b[0]) : a
    });
    r("tables().nodes()", "table().node()", function () {
        return this.iterator("table", function (a) {
            return a.nTable
        }, 1)
    });
    r("tables().body()",
        "table().body()", function () {
            return this.iterator("table", function (a) {
                return a.nTBody
            }, 1)
        });
    r("tables().header()", "table().header()", function () {
        return this.iterator("table", function (a) {
            return a.nTHead
        }, 1)
    });
    r("tables().footer()", "table().footer()", function () {
        return this.iterator("table", function (a) {
            return a.nTFoot
        }, 1)
    });
    r("tables().containers()", "table().container()", function () {
        return this.iterator("table", function (a) {
            return a.nTableWrapper
        }, 1)
    });
    p("draw()", function (a) {
        return this.iterator("table",
            function (b) {
                "page" === a ? O(b) : ("string" === typeof a && (a = "full-hold" === a ? !1 : !0), T(b, !1 === a))
            })
    });
    p("page()", function (a) {
        return a === k ? this.page.info().page : this.iterator("table", function (b) {
            Ta(b, a)
        })
    });
    p("page.info()", function () {
        if (0 === this.context.length) return k;
        var a = this.context[0],
            b = a._iDisplayStart,
            c = a.oFeatures.bPaginate ? a._iDisplayLength : -1,
            d = a.fnRecordsDisplay(),
            e = -1 === c;
        return {
            page: e ? 0 : Math.floor(b / c),
            pages: e ? 1 : Math.ceil(d / c),
            start: b,
            end: a.fnDisplayEnd(),
            length: c,
            recordsTotal: a.fnRecordsTotal(),
            recordsDisplay: d,
            serverSide: "ssp" === y(a)
        }
    });
    p("page.len()", function (a) {
        return a === k ? 0 !== this.context.length ? this.context[0]._iDisplayLength : k : this.iterator("table", function (b) {
            Ra(b, a)
        })
    });
    var Ub = function (a, b, c) {
        if (c) {
            var d = new t(a);
            d.one("draw", function () {
                c(d.ajax.json())
            })
        }
        if ("ssp" == y(a)) T(a, b);
        else {
            C(a, !0);
            var e = a.jqXHR;
            e && 4 !== e.readyState && e.abort();
            ra(a, [], function (c) {
                na(a);
                for (var c = sa(a, c), d = 0, e = c.length; d < e; d++) N(a, c[d]);
                T(a, b);
                C(a, !1)
            })
        }
    };
    p("ajax.json()", function () {
        var a = this.context;
        if (0 <
            a.length) return a[0].json
    });
    p("ajax.params()", function () {
        var a = this.context;
        if (0 < a.length) return a[0].oAjaxData
    });
    p("ajax.reload()", function (a, b) {
        return this.iterator("table", function (c) {
            Ub(c, !1 === b, a)
        })
    });
    p("ajax.url()", function (a) {
        var b = this.context;
        if (a === k) {
            if (0 === b.length) return k;
            b = b[0];
            return b.ajax ? h.isPlainObject(b.ajax) ? b.ajax.url : b.ajax : b.sAjaxSource
        }
        return this.iterator("table", function (b) {
            h.isPlainObject(b.ajax) ? b.ajax.url = a : b.ajax = a
        })
    });
    p("ajax.url().load()", function (a, b) {
        return this.iterator("table",
            function (c) {
                Ub(c, !1 === b, a)
            })
    });
    var $a = function (a, b, c, d, e) {
        var f = [],
            g, j, i, o, l, m;
        i = typeof b;
        if (!b || "string" === i || "function" === i || b.length === k) b = [b];
        i = 0;
        for (o = b.length; i < o; i++) {
            j = b[i] && b[i].split ? b[i].split(",") : [b[i]];
            l = 0;
            for (m = j.length; l < m; l++) (g = c("string" === typeof j[l] ? h.trim(j[l]) : j[l])) && g.length && (f = f.concat(g))
        }
        a = s.selector[a];
        if (a.length) {
            i = 0;
            for (o = a.length; i < o; i++) f = a[i](d, e, f)
        }
        return pa(f)
    }, ab = function (a) {
        a || (a = {});
        a.filter && a.search === k && (a.search = a.filter);
        return h.extend({
            search: "none",
            order: "current",
            page: "all"
        }, a)
    }, bb = function (a) {
        for (var b = 0, c = a.length; b < c; b++)
            if (0 < a[b].length) return a[0] = a[b], a[0].length = 1, a.length = 1, a.context = [a.context[b]], a;
        a.length = 0;
        return a
    }, Da = function (a, b) {
        var c, d, e, f = [],
            g = a.aiDisplay;
        c = a.aiDisplayMaster;
        var j = b.search;
        d = b.order;
        e = b.page;
        if ("ssp" == y(a)) return "removed" === j ? [] : X(0, c.length);
        if ("current" == e) {
            c = a._iDisplayStart;
            for (d = a.fnDisplayEnd() ; c < d; c++) f.push(g[c])
        } else if ("current" == d || "applied" == d) f = "none" == j ? c.slice() : "applied" == j ? g.slice() : h.map(c,
            function (a) {
                return -1 === h.inArray(a, g) ? a : null
            });
        else if ("index" == d || "original" == d) {
            c = 0;
            for (d = a.aoData.length; c < d; c++) "none" == j ? f.push(c) : (e = h.inArray(c, g), (-1 === e && "removed" == j || 0 <= e && "applied" == j) && f.push(c))
        }
        return f
    };
    p("rows()", function (a, b) {
        a === k ? a = "" : h.isPlainObject(a) && (b = a, a = "");
        var b = ab(b),
            c = this.iterator("table", function (c) {
                var e = b;
                return $a("row", a, function (a) {
                    var b = Pb(a);
                    if (b !== null && !e) return [b];
                    var j = Da(c, e);
                    if (b !== null && h.inArray(b, j) !== -1) return [b];
                    if (!a) return j;
                    if (typeof a === "function") return h.map(j,
                        function (b) {
                            var e = c.aoData[b];
                            return a(b, e._aData, e.nTr) ? b : null
                        });
                    b = Sb(ja(c.aoData, j, "nTr"));
                    if (a.nodeName && h.inArray(a, b) !== -1) return [a._DT_RowIndex];
                    if (typeof a === "string" && a.charAt(0) === "#") {
                        j = c.aIds[a.replace(/^#/, "")];
                        if (j !== k) return [j.idx]
                    }
                    return h(b).filter(a).map(function () {
                        return this._DT_RowIndex
                    }).toArray()
                }, c, e)
            }, 1);
        c.selector.rows = a;
        c.selector.opts = b;
        return c
    });
    p("rows().nodes()", function () {
        return this.iterator("row", function (a, b) {
            return a.aoData[b].nTr || k
        }, 1)
    });
    p("rows().data()", function () {
        return this.iterator(!0,
            "rows", function (a, b) {
                return ja(a.aoData, b, "_aData")
            }, 1)
    });
    r("rows().cache()", "row().cache()", function (a) {
        return this.iterator("row", function (b, c) {
            var d = b.aoData[c];
            return "search" === a ? d._aFilterData : d._aSortData
        }, 1)
    });
    r("rows().invalidate()", "row().invalidate()", function (a) {
        return this.iterator("row", function (b, c) {
            ea(b, c, a)
        })
    });
    r("rows().indexes()", "row().index()", function () {
        return this.iterator("row", function (a, b) {
            return b
        }, 1)
    });
    r("rows().ids()", "row().id()", function (a) {
        for (var b = [], c = this.context,
                d = 0, e = c.length; d < e; d++)
            for (var f = 0, g = this[d].length; f < g; f++) {
                var h = c[d].rowIdFn(c[d].aoData[this[d][f]]._aData);
                b.push((!0 === a ? "#" : "") + h)
            }
        return new t(c, b)
    });
    r("rows().remove()", "row().remove()", function () {
        var a = this;
        this.iterator("row", function (b, c, d) {
            var e = b.aoData,
                f = e[c],
                g, h, i, o, l;
            e.splice(c, 1);
            g = 0;
            for (h = e.length; g < h; g++)
                if (i = e[g], l = i.anCells, null !== i.nTr && (i.nTr._DT_RowIndex = g), null !== l) {
                    i = 0;
                    for (o = l.length; i < o; i++) l[i]._DT_CellIndex.row = g
                }
            oa(b.aiDisplayMaster, c);
            oa(b.aiDisplay, c);
            oa(a[d], c, !1);
            Sa(b);
            c = b.rowIdFn(f._aData);
            c !== k && delete b.aIds[c]
        });
        this.iterator("table", function (a) {
            for (var c = 0, d = a.aoData.length; c < d; c++) a.aoData[c].idx = c
        });
        return this
    });
    p("rows.add()", function (a) {
        var b = this.iterator("table", function (b) {
            var c, f, g, h = [];
            f = 0;
            for (g = a.length; f < g; f++) c = a[f], c.nodeName && "TR" === c.nodeName.toUpperCase() ? h.push(ma(b, c)[0]) : h.push(N(b, c));
            return h
        }, 1),
            c = this.rows(-1);
        c.pop();
        h.merge(c, b);
        return c
    });
    p("row()", function (a, b) {
        return bb(this.rows(a, b))
    });
    p("row().data()", function (a) {
        var b =
            this.context;
        if (a === k) return b.length && this.length ? b[0].aoData[this[0]]._aData : k;
        b[0].aoData[this[0]]._aData = a;
        ea(b[0], this[0], "data");
        return this
    });
    p("row().node()", function () {
        var a = this.context;
        return a.length && this.length ? a[0].aoData[this[0]].nTr || null : null
    });
    p("row.add()", function (a) {
        a instanceof h && a.length && (a = a[0]);
        var b = this.iterator("table", function (b) {
            return a.nodeName && "TR" === a.nodeName.toUpperCase() ? ma(b, a)[0] : N(b, a)
        });
        return this.row(b[0])
    });
    var cb = function (a, b) {
        var c = a.context;
        if (c.length &&
            (c = c[0].aoData[b !== k ? b : a[0]]) && c._details) c._details.remove(), c._detailsShow = k, c._details = k
    }, Vb = function (a, b) {
        var c = a.context;
        if (c.length && a.length) {
            var d = c[0].aoData[a[0]];
            if (d._details) {
                (d._detailsShow = b) ? d._details.insertAfter(d.nTr) : d._details.detach();
                var e = c[0],
                    f = new t(e),
                    g = e.aoData;
                f.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");
                0 < D(g, "_details").length && (f.on("draw.dt.DT_details", function (a, b) {
                    e === b && f.rows({
                        page: "current"
                    }).eq(0).each(function (a) {
                        a = g[a];
                        a._detailsShow && a._details.insertAfter(a.nTr)
                    })
                }), f.on("column-visibility.dt.DT_details", function (a, b) {
                    if (e === b)
                        for (var c, d = ca(b), f = 0, h = g.length; f < h; f++) c = g[f], c._details && c._details.children("td[colspan]").attr("colspan", d)
                }), f.on("destroy.dt.DT_details", function (a, b) {
                    if (e === b)
                        for (var c = 0, d = g.length; c < d; c++) g[c]._details && cb(f, c)
                }))
            }
        }
    };
    p("row().child()", function (a, b) {
        var c = this.context;
        if (a === k) return c.length && this.length ? c[0].aoData[this[0]]._details : k;
        if (!0 === a) this.child.show();
        else if (!1 ===
            a) cb(this);
        else if (c.length && this.length) {
            var d = c[0],
                c = c[0].aoData[this[0]],
                e = [],
                f = function (a, b) {
                    if (h.isArray(a) || a instanceof h)
                        for (var c = 0, k = a.length; c < k; c++) f(a[c], b);
                    else a.nodeName && "tr" === a.nodeName.toLowerCase() ? e.push(a) : (c = h("<tr><td/></tr>").addClass(b), h("td", c).addClass(b).html(a)[0].colSpan = ca(d), e.push(c[0]))
                };
            f(a, b);
            c._details && c._details.remove();
            c._details = h(e);
            c._detailsShow && c._details.insertAfter(c.nTr)
        }
        return this
    });
    p(["row().child.show()", "row().child().show()"], function () {
        Vb(this, !0);
        return this
    });
    p(["row().child.hide()", "row().child().hide()"], function () {
        Vb(this, !1);
        return this
    });
    p(["row().child.remove()", "row().child().remove()"], function () {
        cb(this);
        return this
    });
    p("row().child.isShown()", function () {
        var a = this.context;
        return a.length && this.length ? a[0].aoData[this[0]]._detailsShow || !1 : !1
    });
    var dc = /^(.+):(name|visIdx|visible)$/,
        Wb = function (a, b, c, d, e) {
            for (var c = [], d = 0, f = e.length; d < f; d++) c.push(B(a, e[d], b));
            return c
        };
    p("columns()", function (a, b) {
        a === k ? a = "" : h.isPlainObject(a) &&
            (b = a, a = "");
        var b = ab(b),
            c = this.iterator("table", function (c) {
                var e = a,
                    f = b,
                    g = c.aoColumns,
                    j = D(g, "sName"),
                    i = D(g, "nTh");
                return $a("column", e, function (a) {
                    var b = Pb(a);
                    if (a === "") return X(g.length);
                    if (b !== null) return [b >= 0 ? b : g.length + b];
                    if (typeof a === "function") {
                        var e = Da(c, f);
                        return h.map(g, function (b, f) {
                            return a(f, Wb(c, f, 0, 0, e), i[f]) ? f : null
                        })
                    }
                    var k = typeof a === "string" ? a.match(dc) : "";
                    if (k) switch (k[2]) {
                        case "visIdx":
                        case "visible":
                            b = parseInt(k[1], 10);
                            if (b < 0) {
                                var m = h.map(g, function (a, b) {
                                    return a.bVisible ? b : null
                                });
                                return [m[m.length + b]]
                            }
                            return [$(c, b)];
                        case "name":
                            return h.map(j, function (a, b) {
                                return a === k[1] ? b : null
                            })
                    } else return h(i).filter(a).map(function () {
                        return h.inArray(this, i)
                    }).toArray()
                }, c, f)
            }, 1);
        c.selector.cols = a;
        c.selector.opts = b;
        return c
    });
    r("columns().header()", "column().header()", function () {
        return this.iterator("column", function (a, b) {
            return a.aoColumns[b].nTh
        }, 1)
    });
    r("columns().footer()", "column().footer()", function () {
        return this.iterator("column", function (a, b) {
            return a.aoColumns[b].nTf
        }, 1)
    });
    r("columns().data()",
        "column().data()", function () {
            return this.iterator("column-rows", Wb, 1)
        });
    r("columns().dataSrc()", "column().dataSrc()", function () {
        return this.iterator("column", function (a, b) {
            return a.aoColumns[b].mData
        }, 1)
    });
    r("columns().cache()", "column().cache()", function (a) {
        return this.iterator("column-rows", function (b, c, d, e, f) {
            return ja(b.aoData, f, "search" === a ? "_aFilterData" : "_aSortData", c)
        }, 1)
    });
    r("columns().nodes()", "column().nodes()", function () {
        return this.iterator("column-rows", function (a, b, c, d, e) {
            return ja(a.aoData,
                e, "anCells", b)
        }, 1)
    });
    r("columns().visible()", "column().visible()", function (a, b) {
        return this.iterator("column", function (c, d) {
            if (a === k) return c.aoColumns[d].bVisible;
            var e = c.aoColumns,
                f = e[d],
                g = c.aoData,
                j, i, m;
            if (a !== k && f.bVisible !== a) {
                if (a) {
                    var l = h.inArray(!0, D(e, "bVisible"), d + 1);
                    j = 0;
                    for (i = g.length; j < i; j++) m = g[j].nTr, e = g[j].anCells, m && m.insertBefore(e[d], e[l] || null)
                } else h(D(c.aoData, "anCells", d)).detach();
                f.bVisible = a;
                ga(c, c.aoHeader);
                ga(c, c.aoFooter);
                if (b === k || b) U(c), (c.oScroll.sX || c.oScroll.sY) &&
                    Z(c);
                v(c, null, "column-visibility", [c, d, a, b]);
                ya(c)
            }
        })
    });
    r("columns().indexes()", "column().index()", function (a) {
        return this.iterator("column", function (b, c) {
            return "visible" === a ? ba(b, c) : c
        }, 1)
    });
    p("columns.adjust()", function () {
        return this.iterator("table", function (a) {
            U(a)
        }, 1)
    });
    p("column.index()", function (a, b) {
        if (0 !== this.context.length) {
            var c = this.context[0];
            if ("fromVisible" === a || "toData" === a) return $(c, b);
            if ("fromData" === a || "toVisible" === a) return ba(c, b)
        }
    });
    p("column()", function (a, b) {
        return bb(this.columns(a,
            b))
    });
    p("cells()", function (a, b, c) {
        h.isPlainObject(a) && (a.row === k ? (c = a, a = null) : (c = b, b = null));
        h.isPlainObject(b) && (c = b, b = null);
        if (null === b || b === k) return this.iterator("table", function (b) {
            var d = a,
                e = ab(c),
                f = b.aoData,
                g = Da(b, e),
                j = Sb(ja(f, g, "anCells")),
                i = h([].concat.apply([], j)),
                l, m = b.aoColumns.length,
                o, p, t, r, s, v;
            return $a("cell", d, function (a) {
                var c = typeof a === "function";
                if (a === null || a === k || c) {
                    o = [];
                    p = 0;
                    for (t = g.length; p < t; p++) {
                        l = g[p];
                        for (r = 0; r < m; r++) {
                            s = {
                                row: l,
                                column: r
                            };
                            if (c) {
                                v = f[l];
                                a(s, B(b, l, r), v.anCells ?
                                    v.anCells[r] : null) && o.push(s)
                            } else o.push(s)
                        }
                    }
                    return o
                }
                return h.isPlainObject(a) ? [a] : i.filter(a).map(function (a, b) {
                    return {
                        row: b._DT_CellIndex.row,
                        column: b._DT_CellIndex.column
                    }
                }).toArray()
            }, b, e)
        });
        var d = this.columns(b, c),
            e = this.rows(a, c),
            f, g, j, i, m, l = this.iterator("table", function (a, b) {
                f = [];
                g = 0;
                for (j = e[b].length; g < j; g++) {
                    i = 0;
                    for (m = d[b].length; i < m; i++) f.push({
                        row: e[b][g],
                        column: d[b][i]
                    })
                }
                return f
            }, 1);
        h.extend(l.selector, {
            cols: b,
            rows: a,
            opts: c
        });
        return l
    });
    r("cells().nodes()", "cell().node()", function () {
        return this.iterator("cell",
            function (a, b, c) {
                return (a = a.aoData[b].anCells) ? a[c] : k
            }, 1)
    });
    p("cells().data()", function () {
        return this.iterator("cell", function (a, b, c) {
            return B(a, b, c)
        }, 1)
    });
    r("cells().cache()", "cell().cache()", function (a) {
        a = "search" === a ? "_aFilterData" : "_aSortData";
        return this.iterator("cell", function (b, c, d) {
            return b.aoData[c][a][d]
        }, 1)
    });
    r("cells().render()", "cell().render()", function (a) {
        return this.iterator("cell", function (b, c, d) {
            return B(b, c, d, a)
        }, 1)
    });
    r("cells().indexes()", "cell().index()", function () {
        return this.iterator("cell",
            function (a, b, c) {
                return {
                    row: b,
                    column: c,
                    columnVisible: ba(a, c)
                }
            }, 1)
    });
    r("cells().invalidate()", "cell().invalidate()", function (a) {
        return this.iterator("cell", function (b, c, d) {
            ea(b, c, a, d)
        })
    });
    p("cell()", function (a, b, c) {
        return bb(this.cells(a, b, c))
    });
    p("cell().data()", function (a) {
        var b = this.context,
            c = this[0];
        if (a === k) return b.length && c.length ? B(b[0], c[0].row, c[0].column) : k;
        jb(b[0], c[0].row, c[0].column, a);
        ea(b[0], c[0].row, "data", c[0].column);
        return this
    });
    p("order()", function (a, b) {
        var c = this.context;
        if (a ===
            k) return 0 !== c.length ? c[0].aaSorting : k;
        "number" === typeof a ? a = [
            [a, b]
        ] : h.isArray(a[0]) || (a = Array.prototype.slice.call(arguments));
        return this.iterator("table", function (b) {
            b.aaSorting = a.slice()
        })
    });
    p("order.listener()", function (a, b, c) {
        return this.iterator("table", function (d) {
            Oa(d, a, b, c)
        })
    });
    p("order.fixed()", function (a) {
        if (!a) {
            var b = this.context,
                b = b.length ? b[0].aaSortingFixed : k;
            return h.isArray(b) ? {
                pre: b
            } : b
        }
        return this.iterator("table", function (b) {
            b.aaSortingFixed = h.extend(!0, {}, a)
        })
    });
    p(["columns().order()",
        "column().order()"
    ], function (a) {
        var b = this;
        return this.iterator("table", function (c, d) {
            var e = [];
            h.each(b[d], function (b, c) {
                e.push([c, a])
            });
            c.aaSorting = e
        })
    });
    p("search()", function (a, b, c, d) {
        var e = this.context;
        return a === k ? 0 !== e.length ? e[0].oPreviousSearch.sSearch : k : this.iterator("table", function (e) {
            e.oFeatures.bFilter && ha(e, h.extend({}, e.oPreviousSearch, {
                sSearch: a + "",
                bRegex: null === b ? !1 : b,
                bSmart: null === c ? !0 : c,
                bCaseInsensitive: null === d ? !0 : d
            }), 1)
        })
    });
    r("columns().search()", "column().search()", function (a,
        b, c, d) {
        return this.iterator("column", function (e, f) {
            var g = e.aoPreSearchCols;
            if (a === k) return g[f].sSearch;
            e.oFeatures.bFilter && (h.extend(g[f], {
                sSearch: a + "",
                bRegex: null === b ? !1 : b,
                bSmart: null === c ? !0 : c,
                bCaseInsensitive: null === d ? !0 : d
            }), ha(e, e.oPreviousSearch, 1))
        })
    });
    p("state()", function () {
        return this.context.length ? this.context[0].oSavedState : null
    });
    p("state.clear()", function () {
        return this.iterator("table", function (a) {
            a.fnStateSaveCallback.call(a.oInstance, a, {})
        })
    });
    p("state.loaded()", function () {
        return this.context.length ?
            this.context[0].oLoadedState : null
    });
    p("state.save()", function () {
        return this.iterator("table", function (a) {
            ya(a)
        })
    });
    m.versionCheck = m.fnVersionCheck = function (a) {
        for (var b = m.version.split("."), a = a.split("."), c, d, e = 0, f = a.length; e < f; e++)
            if (c = parseInt(b[e], 10) || 0, d = parseInt(a[e], 10) || 0, c !== d) return c > d;
        return !0
    };
    m.isDataTable = m.fnIsDataTable = function (a) {
        var b = h(a).get(0),
            c = !1;
        h.each(m.settings, function (a, e) {
            var f = e.nScrollHead ? h("table", e.nScrollHead)[0] : null,
                g = e.nScrollFoot ? h("table", e.nScrollFoot)[0] :
                    null;
            if (e.nTable === b || f === b || g === b) c = !0
        });
        return c
    };
    m.tables = m.fnTables = function (a) {
        var b = !1;
        h.isPlainObject(a) && (b = a.api, a = a.visible);
        var c = h.map(m.settings, function (b) {
            if (!a || a && h(b.nTable).is(":visible")) return b.nTable
        });
        return b ? new t(c) : c
    };
    m.util = {
        throttle: ua,
        escapeRegex: va
    };
    m.camelToHungarian = J;
    p("$()", function (a, b) {
        var c = this.rows(b).nodes(),
            c = h(c);
        return h([].concat(c.filter(a).toArray(), c.find(a).toArray()))
    });
    h.each(["on", "one", "off"], function (a, b) {
        p(b + "()", function () {
            var a = Array.prototype.slice.call(arguments);
            a[0].match(/\.dt\b/) || (a[0] += ".dt");
            var d = h(this.tables().nodes());
            d[b].apply(d, a);
            return this
        })
    });
    p("clear()", function () {
        return this.iterator("table", function (a) {
            na(a)
        })
    });
    p("settings()", function () {
        return new t(this.context, this.context)
    });
    p("init()", function () {
        var a = this.context;
        return a.length ? a[0].oInit : null
    });
    p("data()", function () {
        return this.iterator("table", function (a) {
            return D(a.aoData, "_aData")
        }).flatten()
    });
    p("destroy()", function (a) {
        a = a || !1;
        return this.iterator("table", function (b) {
            var c =
                b.nTableWrapper.parentNode,
                d = b.oClasses,
                e = b.nTable,
                f = b.nTBody,
                g = b.nTHead,
                j = b.nTFoot,
                i = h(e),
                f = h(f),
                k = h(b.nTableWrapper),
                l = h.map(b.aoData, function (a) {
                    return a.nTr
                }),
                p;
            b.bDestroying = !0;
            v(b, "aoDestroyCallback", "destroy", [b]);
            a || (new t(b)).columns().visible(!0);
            k.unbind(".DT").find(":not(tbody *)").unbind(".DT");
            h(E).unbind(".DT-" + b.sInstance);
            e != g.parentNode && (i.children("thead").detach(), i.append(g));
            j && e != j.parentNode && (i.children("tfoot").detach(), i.append(j));
            b.aaSorting = [];
            b.aaSortingFixed = [];
            xa(b);
            h(l).removeClass(b.asStripeClasses.join(" "));
            h("th, td", g).removeClass(d.sSortable + " " + d.sSortableAsc + " " + d.sSortableDesc + " " + d.sSortableNone);
            b.bJUI && (h("th span." + d.sSortIcon + ", td span." + d.sSortIcon, g).detach(), h("th, td", g).each(function () {
                var a = h("div." + d.sSortJUIWrapper, this);
                h(this).append(a.contents());
                a.detach()
            }));
            f.children().detach();
            f.append(l);
            g = a ? "remove" : "detach";
            i[g]();
            k[g]();
            !a && c && (c.insertBefore(e, b.nTableReinsertBefore), i.css("width", b.sDestroyWidth).removeClass(d.sTable), (p =
                b.asDestroyStripes.length) && f.children().each(function (a) {
                    h(this).addClass(b.asDestroyStripes[a % p])
                }));
            c = h.inArray(b, m.settings); -1 !== c && m.settings.splice(c, 1)
        })
    });
    h.each(["column", "row", "cell"], function (a, b) {
        p(b + "s().every()", function (a) {
            var d = this.selector.opts,
                e = this;
            return this.iterator(b, function (f, g, h, i, m) {
                a.call(e[b](g, "cell" === b ? h : d, "cell" === b ? d : k), g, h, i, m)
            })
        })
    });
    p("i18n()", function (a, b, c) {
        var d = this.context[0],
            a = Q(a)(d.oLanguage);
        a === k && (a = b);
        c !== k && h.isPlainObject(a) && (a = a[c] !== k ? a[c] : a._);
        return a.replace("%d", c)
    });
    m.version = "1.10.10";
    m.settings = [];
    m.models = {};
    m.models.oSearch = {
        bCaseInsensitive: !0,
        sSearch: "",
        bRegex: !1,
        bSmart: !0
    };
    m.models.oRow = {
        nTr: null,
        anCells: null,
        _aData: [],
        _aSortData: null,
        _aFilterData: null,
        _sFilterRow: null,
        _sRowStripe: "",
        src: null,
        idx: -1
    };
    m.models.oColumn = {
        idx: null,
        aDataSort: null,
        asSorting: null,
        bSearchable: null,
        bSortable: null,
        bVisible: null,
        _sManualType: null,
        _bAttrSrc: !1,
        fnCreatedCell: null,
        fnGetData: null,
        fnSetData: null,
        mData: null,
        mRender: null,
        nTh: null,
        nTf: null,
        sClass: null,
        sContentPadding: null,
        sDefaultContent: null,
        sName: null,
        sSortDataType: "std",
        sSortingClass: null,
        sSortingClassJUI: null,
        sTitle: null,
        sType: null,
        sWidth: null,
        sWidthOrig: null
    };
    m.defaults = {
        aaData: null,
        aaSorting: [
            [0, "asc"]
        ],
        aaSortingFixed: [],
        ajax: null,
        aLengthMenu: [10, 25, 50, 100],
        aoColumns: null,
        aoColumnDefs: null,
        aoSearchCols: [],
        asStripeClasses: null,
        bAutoWidth: !0,
        bDeferRender: !1,
        bDestroy: !1,
        bFilter: !0,
        bInfo: !0,
        bJQueryUI: !1,
        bLengthChange: !0,
        bPaginate: !0,
        bProcessing: !1,
        bRetrieve: !1,
        bScrollCollapse: !1,
        bServerSide: !1,
        bSort: !0,
        bSortMulti: !0,
        bSortCellsTop: !1,
        bSortClasses: !0,
        bStateSave: !1,
        fnCreatedRow: null,
        fnDrawCallback: null,
        fnFooterCallback: null,
        fnFormatNumber: function (a) {
            return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands)
        },
        fnHeaderCallback: null,
        fnInfoCallback: null,
        fnInitComplete: null,
        fnPreDrawCallback: null,
        fnRowCallback: null,
        fnServerData: null,
        fnServerParams: null,
        fnStateLoadCallback: function (a) {
            try {
                return JSON.parse((-1 === a.iStateDuration ? sessionStorage : localStorage).getItem("DataTables_" +
                    a.sInstance + "_" + location.pathname))
            } catch (b) { }
        },
        fnStateLoadParams: null,
        fnStateLoaded: null,
        fnStateSaveCallback: function (a, b) {
            try {
                (-1 === a.iStateDuration ? sessionStorage : localStorage).setItem("DataTables_" + a.sInstance + "_" + location.pathname, JSON.stringify(b))
            } catch (c) { }
        },
        fnStateSaveParams: null,
        iStateDuration: 7200,
        iDeferLoading: null,
        iDisplayLength: 10,
        iDisplayStart: 0,
        iTabIndex: 0,
        oClasses: {},
        oLanguage: {
            oAria: {
                sSortAscending: ": activate to sort column ascending",
                sSortDescending: ": activate to sort column descending"
            },
            oPaginate: {
                sFirst: "First",
                sLast: "Last",
                sNext: "Next",
                sPrevious: "Previous"
            },
            sEmptyTable: "No data available in table",
            sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
            sInfoEmpty: "Showing 0 to 0 of 0 entries",
            sInfoFiltered: "(filtered from _MAX_ total entries)",
            sInfoPostFix: "",
            sDecimal: "",
            sThousands: ",",
            sLengthMenu: "Show _MENU_ entries",
            sLoadingRecords: "Loading...",
            sProcessing: "Processing...",
            sSearch: "Search:",
            sSearchPlaceholder: "",
            sUrl: "",
            sZeroRecords: "No matching records found"
        },
        oSearch: h.extend({},
            m.models.oSearch),
        sAjaxDataProp: "data",
        sAjaxSource: null,
        sDom: "lfrtip",
        searchDelay: null,
        sPaginationType: "simple_numbers",
        sScrollX: "",
        sScrollXInner: "",
        sScrollY: "",
        sServerMethod: "GET",
        renderer: null,
        rowId: "DT_RowId"
    };
    Y(m.defaults);
    m.defaults.column = {
        aDataSort: null,
        iDataSort: -1,
        asSorting: ["asc", "desc"],
        bSearchable: !0,
        bSortable: !0,
        bVisible: !0,
        fnCreatedCell: null,
        mData: null,
        mRender: null,
        sCellType: "td",
        sClass: "",
        sContentPadding: "",
        sDefaultContent: null,
        sName: "",
        sSortDataType: "std",
        sTitle: null,
        sType: null,
        sWidth: null
    };
    Y(m.defaults.column);
    m.models.oSettings = {
        oFeatures: {
            bAutoWidth: null,
            bDeferRender: null,
            bFilter: null,
            bInfo: null,
            bLengthChange: null,
            bPaginate: null,
            bProcessing: null,
            bServerSide: null,
            bSort: null,
            bSortMulti: null,
            bSortClasses: null,
            bStateSave: null
        },
        oScroll: {
            bCollapse: null,
            iBarWidth: 0,
            sX: null,
            sXInner: null,
            sY: null
        },
        oLanguage: {
            fnInfoCallback: null
        },
        oBrowser: {
            bScrollOversize: !1,
            bScrollbarLeft: !1,
            bBounding: !1,
            barWidth: 0
        },
        ajax: null,
        aanFeatures: [],
        aoData: [],
        aiDisplay: [],
        aiDisplayMaster: [],
        aIds: {},
        aoColumns: [],
        aoHeader: [],
        aoFooter: [],
        oPreviousSearch: {},
        aoPreSearchCols: [],
        aaSorting: null,
        aaSortingFixed: [],
        asStripeClasses: null,
        asDestroyStripes: [],
        sDestroyWidth: 0,
        aoRowCallback: [],
        aoHeaderCallback: [],
        aoFooterCallback: [],
        aoDrawCallback: [],
        aoRowCreatedCallback: [],
        aoPreDrawCallback: [],
        aoInitComplete: [],
        aoStateSaveParams: [],
        aoStateLoadParams: [],
        aoStateLoaded: [],
        sTableId: "",
        nTable: null,
        nTHead: null,
        nTFoot: null,
        nTBody: null,
        nTableWrapper: null,
        bDeferLoading: !1,
        bInitialised: !1,
        aoOpenRows: [],
        sDom: null,
        searchDelay: null,
        sPaginationType: "two_button",
        iStateDuration: 0,
        aoStateSave: [],
        aoStateLoad: [],
        oSavedState: null,
        oLoadedState: null,
        sAjaxSource: null,
        sAjaxDataProp: null,
        bAjaxDataGet: !0,
        jqXHR: null,
        json: k,
        oAjaxData: k,
        fnServerData: null,
        aoServerParams: [],
        sServerMethod: null,
        fnFormatNumber: null,
        aLengthMenu: null,
        iDraw: 0,
        bDrawing: !1,
        iDrawError: -1,
        _iDisplayLength: 10,
        _iDisplayStart: 0,
        _iRecordsTotal: 0,
        _iRecordsDisplay: 0,
        bJUI: null,
        oClasses: {},
        bFiltered: !1,
        bSorted: !1,
        bSortCellsTop: null,
        oInit: null,
        aoDestroyCallback: [],
        fnRecordsTotal: function () {
            return "ssp" == y(this) ?
                1 * this._iRecordsTotal : this.aiDisplayMaster.length
        },
        fnRecordsDisplay: function () {
            return "ssp" == y(this) ? 1 * this._iRecordsDisplay : this.aiDisplay.length
        },
        fnDisplayEnd: function () {
            var a = this._iDisplayLength,
                b = this._iDisplayStart,
                c = b + a,
                d = this.aiDisplay.length,
                e = this.oFeatures,
                f = e.bPaginate;
            return e.bServerSide ? !1 === f || -1 === a ? b + d : Math.min(b + a, this._iRecordsDisplay) : !f || c > d || -1 === a ? d : c
        },
        oInstance: null,
        sInstance: null,
        iTabIndex: 0,
        nScrollHead: null,
        nScrollFoot: null,
        aLastSort: [],
        oPlugins: {},
        rowIdFn: null,
        rowId: null
    };
    m.ext = s = {
        buttons: {},
        classes: {},
        builder: "-source-",
        errMode: "alert",
        feature: [],
        search: [],
        selector: {
            cell: [],
            column: [],
            row: []
        },
        internal: {},
        legacy: {
            ajax: null
        },
        pager: {},
        renderer: {
            pageButton: {},
            header: {}
        },
        order: {},
        type: {
            detect: [],
            search: {},
            order: {}
        },
        _unique: 0,
        fnVersionCheck: m.fnVersionCheck,
        iApiIndex: 0,
        oJUIClasses: {},
        sVersion: m.version
    };
    h.extend(s, {
        afnFiltering: s.search,
        aTypes: s.type.detect,
        ofnSearch: s.type.search,
        oSort: s.type.order,
        afnSortData: s.order,
        aoFeatures: s.feature,
        oApi: s.internal,
        oStdClasses: s.classes,
        oPagination: s.pager
    });
    h.extend(m.ext.classes, {
        sTable: "dataTable",
        sNoFooter: "no-footer",
        sPageButton: "paginate_button",
        sPageButtonActive: "current",
        sPageButtonDisabled: "disabled",
        sStripeOdd: "odd",
        sStripeEven: "even",
        sRowEmpty: "dataTables_empty",
        sWrapper: "dataTables_wrapper",
        sFilter: "dataTables_filter",
        sInfo: "dataTables_info",
        sPaging: "dataTables_paginate paging_",
        sLength: "dataTables_length",
        sProcessing: "dataTables_processing",
        sSortAsc: "sorting_asc",
        sSortDesc: "sorting_desc",
        sSortable: "sorting",
        sSortableAsc: "sorting_asc_disabled",
        sSortableDesc: "sorting_desc_disabled",
        sSortableNone: "sorting_disabled",
        sSortColumn: "sorting_",
        sFilterInput: "",
        sLengthSelect: "",
        sScrollWrapper: "dataTables_scroll",
        sScrollHead: "dataTables_scrollHead",
        sScrollHeadInner: "dataTables_scrollHeadInner",
        sScrollBody: "dataTables_scrollBody",
        sScrollFoot: "dataTables_scrollFoot",
        sScrollFootInner: "dataTables_scrollFootInner",
        sHeaderTH: "",
        sFooterTH: "",
        sSortJUIAsc: "",
        sSortJUIDesc: "",
        sSortJUI: "",
        sSortJUIAscAllowed: "",
        sSortJUIDescAllowed: "",
        sSortJUIWrapper: "",
        sSortIcon: "",
        sJUIHeader: "",
        sJUIFooter: ""
    });
    var Ea = "",
        Ea = "",
        G = Ea + "ui-state-default",
        ka = Ea + "css_right ui-icon ui-icon-",
        Xb = Ea + "fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";
    h.extend(m.ext.oJUIClasses, m.ext.classes, {
        sPageButton: "fg-button ui-button " + G,
        sPageButtonActive: "ui-state-disabled",
        sPageButtonDisabled: "ui-state-disabled",
        sPaging: "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",
        sSortAsc: G + " sorting_asc",
        sSortDesc: G + " sorting_desc",
        sSortable: G + " sorting",
        sSortableAsc: G + " sorting_asc_disabled",
        sSortableDesc: G + " sorting_desc_disabled",
        sSortableNone: G + " sorting_disabled",
        sSortJUIAsc: ka + "triangle-1-n",
        sSortJUIDesc: ka + "triangle-1-s",
        sSortJUI: ka + "carat-2-n-s",
        sSortJUIAscAllowed: ka + "carat-1-n",
        sSortJUIDescAllowed: ka + "carat-1-s",
        sSortJUIWrapper: "DataTables_sort_wrapper",
        sSortIcon: "DataTables_sort_icon",
        sScrollHead: "dataTables_scrollHead " + G,
        sScrollFoot: "dataTables_scrollFoot " + G,
        sHeaderTH: G,
        sFooterTH: G,
        sJUIHeader: Xb + " ui-corner-tl ui-corner-tr",
        sJUIFooter: Xb + " ui-corner-bl ui-corner-br"
    });
    var Mb = m.ext.pager;
    h.extend(Mb, {
        simple: function () {
            return ["previous", "next"]
        },
        full: function () {
            return ["first", "previous", "next", "last"]
        },
        numbers: function (a, b) {
            return [Aa(a, b)]
        },
        simple_numbers: function (a, b) {
            return ["previous", Aa(a, b), "next"]
        },
        full_numbers: function (a, b) {
            return ["first", "previous", Aa(a, b), "next", "last"]
        },
        _numbers: Aa,
        numbers_length: 7
    });
    h.extend(!0, m.ext.renderer, {
        pageButton: {
            _: function (a, b, c, d, e, f) {
                var g = a.oClasses,
                    j = a.oLanguage.oPaginate,
                    i = a.oLanguage.oAria.paginate || {}, k, l, m = 0,
                    p = function (b, d) {
                        var n, r, t, s, v = function (b) {
                            Ta(a, b.data.action, true)
                        };
                        n = 0;
                        for (r = d.length; n < r; n++) {
                            s = d[n];
                            if (h.isArray(s)) {
                                t = h("<" + (s.DT_el || "div") + "/>").appendTo(b);
                                p(t, s)
                            } else {
                                k = null;
                                l = "";
                                switch (s) {
                                    case "ellipsis":
                                        b.append('<span class="ellipsis">&#x2026;</span>');
                                        break;
                                    case "first":
                                        k = j.sFirst;
                                        l = s + (e > 0 ? "" : " " + g.sPageButtonDisabled);
                                        break;
                                    case "previous":
                                        k = j.sPrevious;
                                        l = s + (e > 0 ? "" : " " + g.sPageButtonDisabled);
                                        break;
                                    case "next":
                                        k = j.sNext;
                                        l = s + (e < f - 1 ? "" : " " + g.sPageButtonDisabled);
                                        break;
                                    case "last":
                                        k =
                                            j.sLast;
                                        l = s + (e < f - 1 ? "" : " " + g.sPageButtonDisabled);
                                        break;
                                    default:
                                        k = s + 1;
                                        l = e === s ? g.sPageButtonActive : ""
                                }
                                if (k !== null) {
                                    t = h("<a>", {
                                        "class": g.sPageButton + " " + l,
                                        "aria-controls": a.sTableId,
                                        "aria-label": i[s],
                                        "data-dt-idx": m,
                                        tabindex: a.iTabIndex,
                                        id: c === 0 && typeof s === "string" ? a.sTableId + "_" + s : null
                                    }).html(k).appendTo(b);
                                    Wa(t, {
                                        action: s
                                    }, v);
                                    m++
                                }
                            }
                        }
                    }, r;
                try {
                    r = h(b).find(H.activeElement).data("dt-idx")
                } catch (n) { }
                p(h(b).empty(), d);
                r && h(b).find("[data-dt-idx=" + r + "]").focus()
            }
        }
    });
    h.extend(m.ext.type.detect, [
        function (a, b) {
            var c =
                b.oLanguage.sDecimal;
            return Za(a, c) ? "num" + c : null
        },
        function (a) {
            if (a && !(a instanceof Date) && (!ac.test(a) || !bc.test(a))) return null;
            var b = Date.parse(a);
            return null !== b && !isNaN(b) || M(a) ? "date" : null
        },
        function (a, b) {
            var c = b.oLanguage.sDecimal;
            return Za(a, c, !0) ? "num-fmt" + c : null
        },
        function (a, b) {
            var c = b.oLanguage.sDecimal;
            return Rb(a, c) ? "html-num" + c : null
        },
        function (a, b) {
            var c = b.oLanguage.sDecimal;
            return Rb(a, c, !0) ? "html-num-fmt" + c : null
        },
        function (a) {
            return M(a) || "string" === typeof a && -1 !== a.indexOf("<") ? "html" :
                null
        }
    ]);
    h.extend(m.ext.type.search, {
        html: function (a) {
            return M(a) ? a : "string" === typeof a ? a.replace(Ob, " ").replace(Ca, "") : ""
        },
        string: function (a) {
            return M(a) ? a : "string" === typeof a ? a.replace(Ob, " ") : a
        }
    });
    var Ba = function (a, b, c, d) {
        if (0 !== a && (!a || "-" === a)) return -Infinity;
        b && (a = Qb(a, b));
        a.replace && (c && (a = a.replace(c, "")), d && (a = a.replace(d, "")));
        return 1 * a
    };
    h.extend(s.type.order, {
        "date-pre": function (a) {
            return Date.parse(a) || 0
        },
        "html-pre": function (a) {
            return M(a) ? "" : a.replace ? a.replace(/<.*?>/g, "").toLowerCase() :
                a + ""
        },
        "string-pre": function (a) {
            return M(a) ? "" : "string" === typeof a ? a.toLowerCase() : !a.toString ? "" : a.toString()
        },
        "string-asc": function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0
        },
        "string-desc": function (a, b) {
            return a < b ? 1 : a > b ? -1 : 0
        }
    });
    db("");
    h.extend(!0, m.ext.renderer, {
        header: {
            _: function (a, b, c, d) {
                h(a.nTable).on("order.dt.DT", function (e, f, g, h) {
                    if (a === f) {
                        e = c.idx;
                        b.removeClass(c.sSortingClass + " " + d.sSortAsc + " " + d.sSortDesc).addClass(h[e] == "asc" ? d.sSortAsc : h[e] == "desc" ? d.sSortDesc : c.sSortingClass)
                    }
                })
            },
            jqueryui: function (a,
                b, c, d) {
                h("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(h("<span/>").addClass(d.sSortIcon + " " + c.sSortingClassJUI)).appendTo(b);
                h(a.nTable).on("order.dt.DT", function (e, f, g, h) {
                    if (a === f) {
                        e = c.idx;
                        b.removeClass(d.sSortAsc + " " + d.sSortDesc).addClass(h[e] == "asc" ? d.sSortAsc : h[e] == "desc" ? d.sSortDesc : c.sSortingClass);
                        b.find("span." + d.sSortIcon).removeClass(d.sSortJUIAsc + " " + d.sSortJUIDesc + " " + d.sSortJUI + " " + d.sSortJUIAscAllowed + " " + d.sSortJUIDescAllowed).addClass(h[e] == "asc" ? d.sSortJUIAsc :
                            h[e] == "desc" ? d.sSortJUIDesc : c.sSortingClassJUI)
                    }
                })
            }
        }
    });
    m.render = {
        number: function (a, b, c, d, e) {
            return {
                display: function (f) {
                    if ("number" !== typeof f && "string" !== typeof f) return f;
                    var g = 0 > f ? "-" : "",
                        h = parseFloat(f);
                    if (isNaN(h)) return f;
                    f = Math.abs(h);
                    h = parseInt(f, 10);
                    f = c ? b + (f - h).toFixed(c).substring(2) : "";
                    return g + (d || "") + h.toString().replace(/\B(?=(\d{3})+(?!\d))/g, a) + f + (e || "")
                }
            }
        },
        text: function () {
            return {
                display: function (a) {
                    return "string" === typeof a ? a.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") :
                        a
                }
            }
        }
    };
    h.extend(m.ext.internal, {
        _fnExternApiFunc: Nb,
        _fnBuildAjax: ra,
        _fnAjaxUpdate: lb,
        _fnAjaxParameters: ub,
        _fnAjaxUpdateDraw: vb,
        _fnAjaxDataSrc: sa,
        _fnAddColumn: Ga,
        _fnColumnOptions: la,
        _fnAdjustColumnSizing: U,
        _fnVisibleToColumnIndex: $,
        _fnColumnIndexToVisible: ba,
        _fnVisbleColumns: ca,
        _fnGetColumns: aa,
        _fnColumnTypes: Ia,
        _fnApplyColumnDefs: ib,
        _fnHungarianMap: Y,
        _fnCamelToHungarian: J,
        _fnLanguageCompat: Fa,
        _fnBrowserDetect: gb,
        _fnAddData: N,
        _fnAddTr: ma,
        _fnNodeToDataIndex: function (a, b) {
            return b._DT_RowIndex !== k ? b._DT_RowIndex :
                null
        },
        _fnNodeToColumnIndex: function (a, b, c) {
            return h.inArray(c, a.aoData[b].anCells)
        },
        _fnGetCellData: B,
        _fnSetCellData: jb,
        _fnSplitObjNotation: La,
        _fnGetObjectDataFn: Q,
        _fnSetObjectDataFn: R,
        _fnGetDataMaster: Ma,
        _fnClearTable: na,
        _fnDeleteIndex: oa,
        _fnInvalidate: ea,
        _fnGetRowElements: Ka,
        _fnCreateTr: Ja,
        _fnBuildHead: kb,
        _fnDrawHead: ga,
        _fnDraw: O,
        _fnReDraw: T,
        _fnAddOptionsHtml: nb,
        _fnDetectHeader: fa,
        _fnGetUniqueThs: qa,
        _fnFeatureHtmlFilter: pb,
        _fnFilterComplete: ha,
        _fnFilterCustom: yb,
        _fnFilterColumn: xb,
        _fnFilter: wb,
        _fnFilterCreateSearch: Qa,
        _fnEscapeRegex: va,
        _fnFilterData: zb,
        _fnFeatureHtmlInfo: sb,
        _fnUpdateInfo: Cb,
        _fnInfoMacros: Db,
        _fnInitialise: ia,
        _fnInitComplete: ta,
        _fnLengthChange: Ra,
        _fnFeatureHtmlLength: ob,
        _fnFeatureHtmlPaginate: tb,
        _fnPageChange: Ta,
        _fnFeatureHtmlProcessing: qb,
        _fnProcessingDisplay: C,
        _fnFeatureHtmlTable: rb,
        _fnScrollDraw: Z,
        _fnApplyToChildren: I,
        _fnCalculateColumnWidths: Ha,
        _fnThrottle: ua,
        _fnConvertToWidth: Fb,
        _fnGetWidestNode: Gb,
        _fnGetMaxLenString: Hb,
        _fnStringToCss: w,
        _fnSortFlatten: W,
        _fnSort: mb,
        _fnSortAria: Jb,
        _fnSortListener: Va,
        _fnSortAttachListener: Oa,
        _fnSortingClasses: xa,
        _fnSortData: Ib,
        _fnSaveState: ya,
        _fnLoadState: Kb,
        _fnSettingsFromNode: za,
        _fnLog: K,
        _fnMap: F,
        _fnBindAction: Wa,
        _fnCallbackReg: z,
        _fnCallbackFire: v,
        _fnLengthOverflow: Sa,
        _fnRenderer: Pa,
        _fnDataSource: y,
        _fnRowAttributes: Na,
        _fnCalculateEnd: function () { }
    });
    h.fn.dataTable = m;
    m.$ = h;
    h.fn.dataTableSettings = m.settings;
    h.fn.dataTableExt = m.ext;
    h.fn.DataTable = function (a) {
        return h(this).dataTable(a).api()
    };
    h.each(m, function (a, b) {
        h.fn.DataTable[a] = b
    });
    return h.fn.dataTable
});