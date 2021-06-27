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

    var data = {"OkPercent": 99.48567229977958, "KoPercent": 0.5143277002204262};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5314107274063189, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "CreateAlbm-1"], "isController": false}, {"data": [0.1859504132231405, 500, 1500, "CreateAlbm-2"], "isController": false}, {"data": [0.25, 500, 1500, "UpdateAlbm-1"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-0"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-0"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "UpdateAlbm-2"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-5"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbm"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-4"], "isController": false}, {"data": [0.3677685950413223, 500, 1500, "CreateAlbm-9"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "UpdateAlbm-7"], "isController": false}, {"data": [0.25, 500, 1500, "UpdateAlbm-6"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "CreateAlbm-7"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateAlbm"], "isController": false}, {"data": [0.1962809917355372, 500, 1500, "CreateAlbm-8"], "isController": false}, {"data": [0.5, 500, 1500, "UpdateAlbm-8"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-5"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-6"], "isController": false}, {"data": [0.04132231404958678, 500, 1500, "CreateAlbm-3"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2722, 14, 0.5143277002204262, 3281.0102865540002, 0, 33035, 702.5, 9705.1, 19515.849999999988, 26841.61999999999, 49.65159972273905, 3516.7566453704717, 12.804045079986137], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["CreateAlbm-1", 242, 0, 0.0, 1.8305785123966947, 0, 12, 2.0, 3.0, 3.0, 7.279999999999973, 7.216341136126435, 11.042975156552856, 0.9161370582973014], "isController": false}, {"data": ["CreateAlbm-2", 242, 0, 0.0, 2850.194214876034, 215, 11852, 2468.5, 5986.000000000003, 7373.349999999999, 11284.029999999993, 5.433684352336259, 170.3924063489346, 0.8914638390551677], "isController": false}, {"data": ["UpdateAlbm-1", 6, 0, 0.0, 2069.8333333333335, 1353, 3169, 1975.5, 3169.0, 3169.0, 3169.0, 1.5596568754873927, 8.16535206004679, 0.4097145502989342], "isController": false}, {"data": ["CreateAlbm-0", 242, 0, 0.0, 2.756198347107437, 1, 36, 3.0, 4.0, 4.0, 8.279999999999973, 7.200023801731576, 33.92589340171373, 0.928128068191961], "isController": false}, {"data": ["UpdateAlbm-0", 6, 0, 0.0, 2.3333333333333335, 1, 3, 2.5, 3.0, 3.0, 3.0, 4.651162790697675, 15.411518895348836, 0.5950218023255813], "isController": false}, {"data": ["UpdateAlbm-3", 6, 0, 0.0, 1.8333333333333335, 1, 3, 1.5, 3.0, 3.0, 3.0, 1.8281535648994516, 68.70393909963437, 0.23744572669104205], "isController": false}, {"data": ["UpdateAlbm-2", 6, 0, 0.0, 1897.0, 1489, 2650, 1833.5, 2650.0, 2650.0, 2650.0, 1.16663426015944, 183.9537660412211, 0.1879830594983473], "isController": false}, {"data": ["UpdateAlbm-5", 6, 0, 0.0, 1.5, 1, 2, 1.5, 2.0, 2.0, 2.0, 1.8270401948842874, 2.2213525806942753, 0.22838002436053595], "isController": false}, {"data": ["CreateAlbm", 242, 7, 2.8925619834710745, 18268.90495867769, 1895, 33035, 19850.5, 27378.8, 28239.75, 31400.51999999999, 4.41428623545292, 1718.9098746568438, 6.2503598293112255], "isController": false}, {"data": ["UpdateAlbm-4", 6, 0, 0.0, 2.0, 1, 3, 2.0, 3.0, 3.0, 3.0, 1.8270401948842874, 5.52572605816078, 0.22838002436053595], "isController": false}, {"data": ["CreateAlbm-9", 242, 0, 0.0, 1408.3595041322321, 205, 5718, 1339.5, 2400.2000000000007, 3346.449999999998, 4800.959999999998, 4.9985541372330315, 298.70130944174207, 0.7956682855165861], "isController": false}, {"data": ["UpdateAlbm-7", 6, 0, 0.0, 1047.5, 228, 3119, 583.0, 3119.0, 3119.0, 3119.0, 1.0595090941197245, 22.96275577211725, 0.16658297280593323], "isController": false}, {"data": ["UpdateAlbm-6", 6, 0, 0.0, 1650.0, 722, 3535, 1164.5, 3535.0, 3535.0, 3535.0, 1.0360904852357105, 73.71014829045069, 0.1426648031428078], "isController": false}, {"data": ["CreateAlbm-7", 242, 7, 2.8925619834710745, 5294.19421487603, 486, 19597, 3916.5, 11546.300000000001, 14308.099999999997, 18132.359999999986, 4.819373083203887, 333.4280840502649, 0.6444098944019596], "isController": false}, {"data": ["UpdateAlbm", 6, 0, 0.0, 7766.0, 6781, 8951, 7646.5, 8951.0, 8951.0, 8951.0, 0.5904930617065249, 212.9455031800512, 0.8182711470327724], "isController": false}, {"data": ["CreateAlbm-8", 242, 0, 0.0, 2416.780991735536, 313, 9159, 1961.5, 4979.000000000002, 6081.95, 8602.99, 4.949583784999898, 107.27313262506902, 0.7782060443212729], "isController": false}, {"data": ["UpdateAlbm-8", 6, 0, 0.0, 1091.8333333333335, 390, 2262, 673.0, 2262.0, 2262.0, 2262.0, 1.0636411983690834, 63.56156377415352, 0.1693100735685162], "isController": false}, {"data": ["CreateAlbm-5", 242, 0, 0.0, 1.7479338842975212, 0, 6, 2.0, 3.0, 3.0, 5.0, 4.94523459212032, 6.012516667177538, 0.61815432401504], "isController": false}, {"data": ["CreateAlbm-6", 242, 0, 0.0, 1.7644628099173552, 0, 8, 2.0, 3.0, 3.0, 6.0, 4.9456388457451155, 23.284106323571486, 0.6423534828946292], "isController": false}, {"data": ["CreateAlbm-3", 242, 0, 0.0, 6269.6322314049585, 366, 16445, 6527.0, 10010.4, 11383.05, 14769.189999999997, 4.730442941475429, 745.8761337425232, 0.7622295755307088], "isController": false}, {"data": ["CreateAlbm-4", 242, 0, 0.0, 3.3842975206611587, 1, 14, 3.0, 5.0, 5.0, 10.569999999999993, 4.944931445268599, 185.83573907057766, 0.6422616037311756], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, 7.142857142857143, 0.036737692872887584], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, 42.857142857142854, 0.2204261572373255], "isController": false}, {"data": ["Assertion failed", 7, 50.0, 0.2571638501102131], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2722, 14, "Assertion failed", 7, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm", 242, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm-7", 242, 7, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
