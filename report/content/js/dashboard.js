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

    var data = {"OkPercent": 92.3076923076923, "KoPercent": 7.6923076923076925};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6111111111111112, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://159.89.38.11/-21"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login/submit"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-22"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-20"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http://159.89.38.11/chart/data"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-5"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-7"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/-9"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-12"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-13"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-10"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-3"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-4"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-18"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-19"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-16"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-17"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-14"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-15"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26, 2, 7.6923076923076925, 841.5769230769232, 29, 4887, 524.0, 1984.1000000000017, 4509.699999999999, 4887.0, 4.5422781271837875, 484.19040170772183, 7.477425096086653], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://159.89.38.11/-21", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 16.67159487051793, 3.5483067729083664], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 1, 1, 100.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.99444826007326, 0.8764022435897435], "isController": false}, {"data": ["http://159.89.38.11/-22", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 28.245795682730925, 3.5611194779116464], "isController": false}, {"data": ["http://159.89.38.11/-20", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 100.2590715392562, 1.856275826446281], "isController": false}, {"data": ["Test", 1, 1, 100.0, 5717.0, 5717, 5717, 5717.0, 5717.0, 5717.0, 5717.0, 0.17491691446562882, 242.48694272564285, 3.8674744730627952], "isController": true}, {"data": ["http://159.89.38.11/chart/data", 1, 1, 100.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.9256161971830987, 3.31481073943662], "isController": false}, {"data": ["http://159.89.38.11/-5", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 5.544229332669323, 1.8383497260956174], "isController": false}, {"data": ["http://159.89.38.11/-6", 1, 0, 0.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 108.52306717183227, 0.36676731996353695], "isController": false}, {"data": ["http://159.89.38.11/-7", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 543.4738685344827, 13.90759698275862], "isController": false}, {"data": ["http://159.89.38.11/-8", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 33.62527017291067, 0.5853746397694525], "isController": false}, {"data": ["http://159.89.38.11/-9", 1, 0, 0.0, 3809.0, 3809, 3809, 3809.0, 3809.0, 3809.0, 3809.0, 0.26253609871357314, 133.48806896495142, 0.4730264669204515], "isController": false}, {"data": ["http://159.89.38.11/-12", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 121.26656864466293, 1.2714514571629214], "isController": false}, {"data": ["http://159.89.38.11/-13", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 44.87513007284079, 0.927785184703434], "isController": false}, {"data": ["http://159.89.38.11/-10", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 67.51335555912596, 2.212955896529563], "isController": false}, {"data": ["http://159.89.38.11/-0", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 4.292734098939929, 2.194677561837456], "isController": false}, {"data": ["http://159.89.38.11/-11", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 86.69704861111111, 1.8773748689727463], "isController": false}, {"data": ["http://159.89.38.11/-1", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 28.533247180451127, 3.289473684210526], "isController": false}, {"data": ["http://159.89.38.11/-2", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 11.57195981210856, 1.863419885177453], "isController": false}, {"data": ["http://159.89.38.11/-3", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 69.03202800829875, 1.898421291493776], "isController": false}, {"data": ["http://159.89.38.11/-4", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 22.5755062849162, 1.2520731494413408], "isController": false}, {"data": ["http://159.89.38.11/", 1, 0, 0.0, 4887.0, 4887, 4887, 4887.0, 4887.0, 4887.0, 4887.0, 0.20462451401677922, 283.44751541078375, 4.2337691196030285], "isController": false}, {"data": ["http://159.89.38.11/-18", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 116.45921610169492, 1.286910752118644], "isController": false}, {"data": ["http://159.89.38.11/-19", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 78.76441592261905, 3.530350942460317], "isController": false}, {"data": ["http://159.89.38.11/-16", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 24.36024655577957, 1.2456422211021505], "isController": false}, {"data": ["http://159.89.38.11/-17", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 100.42111682489453, 3.8774063818565403], "isController": false}, {"data": ["http://159.89.38.11/-14", 1, 0, 0.0, 1202.0, 1202, 1202, 1202.0, 1202.0, 1202.0, 1202.0, 0.831946755407654, 122.85107503119801, 0.7458272670549085], "isController": false}, {"data": ["http://159.89.38.11/-15", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 102.46633976063829, 1.224598986037234], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["419/unknown status", 2, 100.0, 7.6923076923076925], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26, 2, "419/unknown status", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 1, 1, "419/unknown status", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/chart/data", 1, 1, "419/unknown status", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
