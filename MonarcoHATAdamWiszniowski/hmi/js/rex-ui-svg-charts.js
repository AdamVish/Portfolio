/* CHARTS
* Version 2.50.12-14711
* Created 2022-12-13 12:58
*/
/**
 * SVG component represents graph.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {REX.UI.SVG.Fan} New SVG graph component
 */
REX.UI.SVG.ChartJs = function(svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var options = that.options || {};    
    
    // Default options
    that.chartJsOptions = {
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1
        }
    };
    
    if (options.chartJsOptions) {
        if (typeof options.chartJsOptions === 'object') {
            $.extend(true, that.chartJsOptions, options.chartJsOptions);
        }
        else {
            that.log.error(that.id + "chartJsOptions property is not an object. Write it as a value pair JSON object!");
        }
    }
    
    let canvas = $(document.createElement('canvas'));  
    $(that.div).append(canvas);

    that.on('updatePosition', function(rect){
        canvas.attr('width',rect.width);
        canvas.attr('height',rect.height);   
        if(that.chart){
            that.chart.canvas.parentNode.style.height = rect.height+'px';
            that.chart.canvas.parentNode.style.width = rect.width+'px';
            that.chart.update(0);
        }             
    });

    that.refresh = function(){
        if(!that.chart){
            that.chart = new Chart(canvas, that.chartJsOptions);
        }
    };

    
    
    return that;
}
REX.UI.SVG.RadarChart = function (svgElem, args) {

    var that = new REX.UI.SVG.ChartJs(svgElem, args);
    let min = that.utils.checkNumber(that.options.min, 0);
    let max = that.utils.checkNumber(that.options.max, 100);
    let step = that.utils.checkNumber(that.options.step, 1);
    let labelStep = that.utils.checkNumber(that.options.labelStep, 10);

    let labels = [];

    if (step === 0 || step < 0) {
        that.log.warn('Step must be non zero, positive number');
        return;
    }

    if (labelStep === 0 || labelStep < 0) {
        that.log.warn('Label step must be non zero, positive number.');
        return;
    }

    function generateLabels() {
        let labels = [];
        let length = 360 / step;
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                labels.push('0');
            } else if (i % labelStep === 0) {
                labels.push('' + ((i * step) % 360));
            } else {
                labels.push('');
            }
        }
        return labels;
    }

    // Default options for radar chart 
    var radarChartOptions = {
        type: 'radar',
        data: {
            labels: labels,            
            datasets: [{
                label: '',
                data: [],
                fill: false,           
                borderColor: 'rgba(0, 0, 0, 0)',
                pointRadius: 1,
                pointBackgroundColor: '#0074C5',
                pointBorderWidth: 0
            }]
        },
        options: {
            legend:{
                display: false,
                fontFamily: 'Roboto',
            },
            scale: {
                scaleLabel :{                    
                    fontFamily: 'Roboto',
                },
                angleLines: {
                    display: false
                },
                gridLines: {
                    circular: true,
                    drawOnChartArea: false
                },
                ticks: {
                    //display:false,
                    fontFamily: 'Roboto',
                    backdropColor : 'rgba(255, 255, 255, 0)',
                    fontSize: 8,
                    lineHeight: 0.2,
                    min: 0,
                    max: 50
                }
            },

        }
    };

    $.extend(true, that.chartJsOptions, radarChartOptions);

    let oldRefresh = that.refresh;
    that.refresh = function(){
        oldRefresh.call(this,arguments);
        that.chart.data.labels = labels;
        that.chart.options.scale.ticks.min = min;
        that.chart.options.scale.ticks.max = max;        
        that.chart.update();
    };    

    that.$c.values.on('read', function (itm) {
        let values = itm.getValue();
        if(!that.chart){
            labels = generateLabels();
            that.refresh();
        }        
        //TODO: Data processing
        that.chart.data.datasets[0].data = values;
        that.chart.update(0);
    });
    return that;
};
REX.UI.SVG.XYChart = function (svgElem, args) {

    var that = new REX.UI.SVG.ChartJs(svgElem, args);
    let title = that.options.title;
    let hideLegend = that.utils.parseBoolean(that.options.hideLegend);
    let signals = that.utils.check(that.options.signals, []);
    let xAxis = that.utils.check(that.options.xAxis, [{
        type: null,
        min: null,
        max: null
    }]);
    let yAxis = that.utils.check(that.options.yAxis, [{
        type: null,
        min: null,
        max: null
    }]);
    let showLines = that.utils.parseBoolean(that.utils.check(that.options.showLines, true));
    let bufferSize = that.utils.checkNumber(that.options.bufferSize, -1);

    let data = []; // Array of data for datasets
    let signalsConfigRead = false;

    xAxis = xAxis[0];
    xAxis.type = xAxis.type || 'linear';
    xAxis.position = 'bottom';
    xAxis.ticks = {};
    xAxis.ticks.min = xAxis.min;
    xAxis.ticks.max = xAxis.max;

    yAxis = yAxis[0];
    yAxis.type = yAxis.type || 'linear';
    yAxis.ticks = {};
    yAxis.ticks.min = yAxis.min;
    yAxis.ticks.max = yAxis.max;

    // Add visibility flag and showLine flag
    for (let s of signals) {
        let visible = (s.visible === "") ? true : that.utils.check(s.visible, true);
        s.visible = that.utils.parseBoolean(visible);

        let showLine = (s.showLine === "") ? true : that.utils.check(s.showLine, showLines);
        s.showLine = that.utils.parseBoolean(showLine);
    }

    const removeEmpty = (obj) => {
        Object.keys(obj).forEach(k =>
            (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
            (obj[k] === null && obj[k] !== undefined) && delete obj[k]
        );
        return obj;
    };

    removeEmpty(xAxis);
    removeEmpty(yAxis);


    // Default options for radar chart 
    var scatterChartOptions = {
        type: 'scatter',
        data: {
            // datasets: [{
            //     label,
            //     data: [{x:0,y:0}]
            // }]
        },
        options: {
            title: {
                display: (title !== null),
                text: title || "",
                fontFamily: "Montserrat"
            },
            legend: {
                display: !hideLegend,
                position: 'right',
                labels: {
                    fontFamily: 'Roboto',
                    boxWidth: 20
                },
                onHover: function (e, legendItem) {
                    e.target.style.cursor = 'pointer';
                },
                onLeave: function (e, legendItem) {
                    e.target.style.cursor = 'default';
                },
            },
            scales: {
                xAxes: [xAxis],
                yAxes: [yAxis]
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            },
            animation: {
                duration: 0 // general animation time
            },
            hover: {
                animationDuration: 0 // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize            
        }
    };

    $.extend(true, that.chartJsOptions, scatterChartOptions);

    if (that.$c.reset_by) {
        that.$c.reset_by.on('change', (itm) => {
            if (itm.getValue()) {
                // Reset trend data
                for (let d of data) {
                    d.length = 0;
                }
            }
        });
    }

    let oldRefresh = that.refresh;
    that.refresh = function (size) {
        oldRefresh.call(this, arguments);
        for (let i = 0; i < (size || signals.length); i++) {
            if (!that.chart.data.datasets[i]) {
                that.chart.data.datasets[i] = {};
            }
            if (signals[i]) {
                that.chart.data.datasets[i].label = signals[i].label || "signal " + (i + 1);
                that.chart.data.datasets[i].borderColor = signals[i].color || that.utils.CONSTANTS.TRND_COLORS[i];
                that.chart.data.datasets[i].pointBackgroundColor = that.chart.data.datasets[i].borderColor;
                that.chart.data.datasets[i].hidden = !signals[i].visible;
                that.chart.data.datasets[i].showLine = signals[i].showLine;
            } else {
                that.chart.data.datasets[i].label = "signal " + (i + 1);
                that.chart.data.datasets[i].borderColor = that.utils.CONSTANTS.TRND_COLORS[i];
                that.chart.data.datasets[i].pointBackgroundColor = that.chart.data.datasets[i].borderColor;
                that.chart.data.datasets[i].showLine = showLines;
            }
            // Common properties            
            that.chart.data.datasets[i].fill = false;
            that.chart.data.datasets[i].pointRadius = 1;
            that.chart.data.datasets[i].pointBorderWidth = 0;
        }
        that.chart.update(0);
    };


    function readArray(itm) {
        let values = itm.getValue();
        if (!signalsConfigRead) {
            that.refresh(itm.getValue().length / 2);
            signalsConfigRead = true;
        }
        let len = values[0].length;
        for (let i = 0; i < values.length / 2; i++) {
            if (data[i]) {
                data[i].length = 0; // Clear data
            } else {
                data[i] = [];
            }
            for (let j = 0; j < len; j++) {
                data[i].push({
                    x: values[i * 2][j],
                    y: values[i * 2 + 1][j]
                });
            }
            if (!that.chart.data.datasets[i]) {
                that.chart.data.datasets[i] = {};
            }
            that.chart.data.datasets[i].data = data[i];
        }
        that.chart.update(0);
    }

    function readTrend(itm) {
        if (bufferSize === -1) {
            bufferSize = that.$c.TRND.trndCfg.samplecount;
        }
        let values = itm.signals;
        let len = values[0].length;
        if (!signalsConfigRead) {
            readViewConfig(values.length / 2);
            signalsConfigRead = true;
        }
        for (let i = 0; i < values.length / 2; i++) {
            if (!data[i]) {
                data[i] = [];
            }
            for (let j = 0; j < len; j++) {
                data[i].push({
                    x: values[i * 2][j],
                    y: values[i * 2 + 1][j]
                });
                while (data[i].length > bufferSize) {
                    data[i].shift();
                }
            }
            if (!that.chart.data.datasets[i]) {
                that.chart.data.datasets[i] = {};
            }
            that.chart.data.datasets[i].data = data[i];
        }
        that.chart.update(0);
    }

    function readViewConfig(size) {
        let vc = {};
        if (that.$c.TRND.trndCfg.user) {
            try {
                vc = JSON.parse(that.$c.TRND.trndCfg.user);
                if (!(vc && vc.View && vc.View.PropertiesModel)) {
                    that.log.warn('ViewConfig is not valid!');
                    return;
                }
            } catch (err) {
                that.log.warn('ViewConfig is not valid JSON!');
                return;
            }
            for (let model of vc.View.PropertiesModel) {
                var items = model.Items.sort((i1, i2) => i1 < i2);
                for (let i = 0; i < items.length / 2; i++) {
                    let item = items[i * 2]; // Only even items / signals
                    let label = item.Name;
                    if (!label) {
                        label = "signal " + (item.Id + 1);
                    }
                    if (!signals[i]) {
                        signals.push({});
                    }
                    signals[i].label = label;
                    signals[i].color = item.Color || that.utils.CONSTANTS.TRND_COLORS[i * 2];
                    signals[i].visible = item.IsActive;
                }
            }
            that.refresh();
        } else {
            that.refresh(size);
        }

    }

    that.$c.values.once('online', function (itm) {
        that.refresh();
        if (itm.kind && itm.kind.kindName === "arr") {
            that.$c.values.on('read', readArray);
        } else {
            let cstring = that.$c.values.cstring;
            cstring = cstring.substr(0, cstring.indexOf(':'));
            REX.HMI.defTarget.browseSymbol(cstring).then((symbol) => {
                if (symbol.ClassName.indexOf('TRND') !== -1) {
                    let TRND = REX.HMI.get(cstring);
                    if (!TRND) {
                        TRND = new REX.WS.Trend({
                            id: cstring,
                            cstring,
                            period: REX.HMI._defaultRefreshRate
                        });
                        REX.HMI.addTrend(TRND);
                        REX.HMI.commit();
                    }
                    that.$c.TRND = TRND;
                    TRND.on('read', readTrend);
                } else {
                    that.log.warn('Connection string does not point to the Array or TRND block parameter.');
                }
            }).catch((err) => {
                that.log.warn('Connection string does not point to the Array or TRND block parameter.');
            });
        }
    });
    return that;
};