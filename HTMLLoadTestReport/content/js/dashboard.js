/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.17355371900827, "KoPercent": 0.8264462809917356};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5180315552216379, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "CreateAlbm-1"], "isController": false}, {"data": [0.20041322314049587, 500, 1500, "CreateAlbm-2"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-0"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbm"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "CreateAlbm-9"], "isController": false}, {"data": [0.002066115702479339, 500, 1500, "CreateAlbm-7"], "isController": false}, {"data": [0.16942148760330578, 500, 1500, "CreateAlbm-8"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-5"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-6"], "isController": false}, {"data": [0.008264462809917356, 500, 1500, "CreateAlbm-3"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2662, 22, 0.8264462809917356, 3566.58752817431, 1, 37996, 954.5, 10280.000000000015, 20803.599999999984, 28751.539999999986, 44.22441147641752, 3119.114374802718, 11.366205632299437], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["CreateAlbm-1", 242, 0, 0.0, 2.380165289256199, 1, 18, 2.0, 4.0, 5.0, 7.139999999999986, 7.22150935513712, 11.050883944824086, 0.916793179851392], "isController": false}, {"data": ["CreateAlbm-2", 242, 0, 0.0, 2661.871900826447, 273, 13240, 2237.0, 4996.900000000001, 6567.199999999999, 10608.3, 5.342635111268104, 167.52781357625398, 0.8765260729424231], "isController": false}, {"data": ["CreateAlbm-0", 242, 0, 0.0, 3.8057851239669422, 1, 30, 3.0, 6.0, 7.0, 16.279999999999973, 7.208387942332897, 33.965304513433814, 0.9292062581913498], "isController": false}, {"data": ["CreateAlbm", 242, 11, 4.545454545454546, 19622.84297520662, 6640, 37996, 21245.5, 28866.2, 30576.1, 36069.829999999994, 4.020401043310684, 1559.557187401359, 5.683102816149718], "isController": false}, {"data": ["CreateAlbm-9", 242, 0, 0.0, 1574.46694214876, 248, 12907, 1446.0, 2697.7000000000025, 3254.7, 6218.109999999993, 4.546137661556958, 271.6672970147186, 0.7236527722986174], "isController": false}, {"data": ["CreateAlbm-7", 242, 10, 4.132231404958677, 6381.661157024794, 1475, 30462, 4491.0, 13813.7, 16857.399999999998, 26645.78, 4.285840786327814, 292.89711408615955, 0.5657542282830071], "isController": false}, {"data": ["CreateAlbm-8", 242, 0, 0.0, 2798.611570247934, 263, 21027, 2124.0, 5515.500000000003, 6729.549999999999, 15538.189999999964, 4.452294219376679, 96.49525923230121, 0.7000189153512161], "isController": false}, {"data": ["CreateAlbm-5", 242, 0, 0.0, 2.442148760330578, 1, 12, 2.0, 4.0, 5.0, 8.569999999999993, 4.844069017975099, 5.889517507206054, 0.6055086272468874], "isController": false}, {"data": ["CreateAlbm-6", 242, 0, 0.0, 2.4504132231404934, 1, 12, 2.0, 4.0, 5.0, 8.0, 4.844553880647808, 22.808197518167077, 0.6292242833263267], "isController": false}, {"data": ["CreateAlbm-3", 242, 1, 0.4132231404958678, 6177.884297520662, 1129, 19509, 5499.0, 9972.300000000003, 11648.5, 17934.01999999999, 4.6705523603659245, 733.4419751418535, 0.7494694061933068], "isController": false}, {"data": ["CreateAlbm-4", 242, 0, 0.0, 4.045454545454547, 1, 12, 4.0, 6.0, 7.849999999999994, 10.0, 4.843972057086811, 182.0415787821013, 0.6291487144458455], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, 4.545454545454546, 0.037565740045078885], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 3, 13.636363636363637, 0.11269722013523667], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 7, 31.818181818181817, 0.26296018031555224], "isController": false}, {"data": ["Assertion failed", 11, 50.0, 0.4132231404958678], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2662, 22, "Assertion failed", 11, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm", 242, 11, "Assertion failed", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm-7", 242, 10, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm-3", 242, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
