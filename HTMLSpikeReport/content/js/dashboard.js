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

    var data = {"OkPercent": 98.46556886227545, "KoPercent": 1.534431137724551};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5076721556886228, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "CreateAlbm-1"], "isController": false}, {"data": [0.1446280991735537, 500, 1500, "CreateAlbm-2"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateAlbm-1"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-0"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-0"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-3"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateAlbm-2"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-5"], "isController": false}, {"data": [0.0, 500, 1500, "CreateAlbm"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-4"], "isController": false}, {"data": [0.23760330578512398, 500, 1500, "CreateAlbm-9"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-7"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateAlbm-6"], "isController": false}, {"data": [0.024793388429752067, 500, 1500, "CreateAlbm-7"], "isController": false}, {"data": [0.0, 500, 1500, "UpdateAlbm"], "isController": false}, {"data": [0.14256198347107438, 500, 1500, "CreateAlbm-8"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateAlbm-8"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-5"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-6"], "isController": false}, {"data": [0.030991735537190084, 500, 1500, "CreateAlbm-3"], "isController": false}, {"data": [1.0, 500, 1500, "CreateAlbm-4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2672, 41, 1.534431137724551, 5318.463323353303, 1, 67288, 915.5, 15496.600000000013, 32058.749999999996, 43422.02, 30.31919118564831, 2118.4617551047327, 7.7612390288667745], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["CreateAlbm-1", 242, 0, 0.0, 3.47107438016529, 1, 9, 3.0, 5.700000000000017, 7.0, 9.0, 7.215695628838929, 11.041987353897072, 0.9160551091299423], "isController": false}, {"data": ["CreateAlbm-2", 242, 1, 0.4132231404958678, 4802.078512396696, 292, 25272, 3875.5, 10449.800000000001, 12023.1, 16120.359999999999, 4.958508349554349, 154.95036449262372, 0.8101436840487655], "isController": false}, {"data": ["UpdateAlbm-1", 1, 0, 0.0, 3544.0, 3544, 3544, 3544.0, 3544.0, 3544.0, 3544.0, 0.2821670428893905, 1.4772436688769752, 0.07412395950902935], "isController": false}, {"data": ["CreateAlbm-0", 242, 0, 0.0, 5.57438016528926, 2, 71, 5.0, 7.0, 10.0, 52.389999999999816, 7.200238024397501, 33.9269028005058, 0.9281556828324904], "isController": false}, {"data": ["UpdateAlbm-0", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 207.09228515625, 7.99560546875], "isController": false}, {"data": ["UpdateAlbm-3", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 6263.509114583333, 21.647135416666668], "isController": false}, {"data": ["UpdateAlbm-2", 1, 0, 0.0, 2170.0, 2170, 2170, 2170.0, 2170.0, 2170.0, 2170.0, 0.4608294930875576, 72.67020089285714, 0.07425475230414746], "isController": false}, {"data": ["UpdateAlbm-5", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 405.2734375, 41.666666666666664], "isController": false}, {"data": ["CreateAlbm", 242, 20, 8.264462809917354, 29333.578512396707, 3531, 67288, 33058.5, 43367.0, 45531.85, 56483.44999999998, 2.7460058097313, 1055.1503499348958, 3.8649393495824254], "isController": false}, {"data": ["UpdateAlbm-4", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 756.103515625, 31.25], "isController": false}, {"data": ["CreateAlbm-9", 242, 0, 0.0, 2278.735537190085, 120, 19975, 1971.0, 3828.0000000000005, 5033.15, 8455.66, 3.030910275036321, 181.11666626875532, 0.4824593504208206], "isController": false}, {"data": ["UpdateAlbm-7", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 47.84293943156733, 0.34707850441501104], "isController": false}, {"data": ["UpdateAlbm-6", 1, 0, 0.0, 1933.0, 1933, 1933, 1933.0, 1933.0, 1933.0, 1933.0, 0.5173305742369374, 36.81029326176927, 0.07123399508535955], "isController": false}, {"data": ["CreateAlbm-7", 242, 16, 6.6115702479338845, 9067.768595041327, 410, 44516, 6315.0, 18917.500000000004, 23847.499999999996, 33201.259999999995, 2.8871391076115485, 192.53373579545456, 0.3712615202219041], "isController": false}, {"data": ["UpdateAlbm", 1, 0, 0.0, 8476.0, 8476, 8476, 8476.0, 8476.0, 8476.0, 8476.0, 0.11798017932987259, 42.551671631665876, 0.1634901117862199], "isController": false}, {"data": ["CreateAlbm-8", 242, 0, 0.0, 3612.9628099173547, 266, 53611, 2821.0, 6894.400000000001, 9095.349999999999, 15280.149999999998, 2.9976093446135934, 64.96763750913529, 0.47130381297147317], "isController": false}, {"data": ["UpdateAlbm-8", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 174.78469937865495, 0.465437682748538], "isController": false}, {"data": ["CreateAlbm-5", 242, 0, 0.0, 3.4421487603305803, 1, 28, 3.0, 6.0, 7.849999999999994, 22.139999999999986, 2.9006700308046365, 3.5266935433122772, 0.3625837538505795], "isController": false}, {"data": ["CreateAlbm-6", 242, 0, 0.0, 3.181818181818181, 1, 18, 3.0, 5.700000000000017, 8.0, 12.139999999999986, 2.9008438818565403, 13.657195658623417, 0.37676976199894513], "isController": false}, {"data": ["CreateAlbm-3", 242, 4, 1.6528925619834711, 9535.826446280995, 678, 51003, 9331.0, 16007.500000000002, 20615.85, 28201.599999999977, 2.8289535209950434, 438.8734137366443, 0.4483027374801272], "isController": false}, {"data": ["CreateAlbm-4", 242, 0, 0.0, 6.219008264462811, 2, 67, 5.0, 9.0, 16.849999999999994, 58.11999999999989, 2.9004962005896875, 109.00370633524703, 0.3767246041781528], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 67,288 milliseconds, but should not have lasted longer than 60,000 milliseconds.", 1, 2.4390243902439024, 0.0374251497005988], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, 2.4390243902439024, 0.0374251497005988], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6, 14.634146341463415, 0.2245508982035928], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 14, 34.146341463414636, 0.5239520958083832], "isController": false}, {"data": ["Assertion failed", 19, 46.34146341463415, 0.7110778443113772], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2672, 41, "Assertion failed", 19, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 14, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6, "The operation lasted too long: It took 67,288 milliseconds, but should not have lasted longer than 60,000 milliseconds.", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["CreateAlbm-2", 242, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm", 242, 20, "Assertion failed", 19, "The operation lasted too long: It took 67,288 milliseconds, but should not have lasted longer than 60,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm-7", 242, 16, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 14, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CreateAlbm-3", 242, 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: stackpath.bootstrapcdn.com:443 failed to respond", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
