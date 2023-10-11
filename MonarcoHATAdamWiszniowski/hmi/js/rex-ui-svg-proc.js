/* PROC
* Version 2.50.12-14711
* Created 2022-12-13 12:58
*/

REX.UI.SVG.PC_Cyclons = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    let $o = that.options || {};

    const COLOR_ACTIVE = '#00f596';

    let cyclons = [];
    for(let i=0;i<8;i++){
        cyclons[i] = SVG.adopt(that.getChildByTag("cyclone-"+i)); 
    }
    
    if (that.$c.value) {
        that.$c.value.on('change', function (itm) {
            if (!that.isDisabled()) {
                refreshNumber();
            }
        });
    }

    function refreshNumber() {
        if (!that.$c.value) {
            return;
        }

        let number = that.$c.value.getValue();
        for (let i = 0; i < 8; i++) {
            cyclons[i].hide();
        }

        if (number > 0) {
            for (let i = 0; i < Math.min(number, 8); i++) {
                cyclons[i].show();
                cyclons[i].style('fill', COLOR_ACTIVE);
            }
        }
    }

    var oldHide = that.hide;
    that.hide = function () {
        oldHide.apply(that,arguments);        
        for(let c of cyclons){
            c.hide();
        }
    };

    var oldShow = that.show;
    that.show = function () {
        oldShow.apply(that,arguments);                
        for(let c of cyclons){
            c.show();
        }
    };

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        for(let c of cyclons){
            c.hide();
        }
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);        
        refreshNumber();
    };  

    // Inicializace
    if (that.$c.value) {
        that.disable();
    }    
    else{
        // Do nothing stay as a symbol        
        that.enable();
    }

    return that;
};

REX.UI.SVG.PC_Cyclons10 = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    let $o = that.options || {};
    colorActive = that.utils.check($o.colorActive, '#46B281');
    colorBlocked = that.utils.check($o.colorBlocked, '#46B281');

    let cyclons = [];
    for (let i = 0; i < 10; i++) {
        cyclons[i] = SVG.adopt(that.getChildByTag("cyclone-" + i));
    }
    active = 0;
    blocked = 0;

    if (that.$c.active_by) {
        that.$c.active_by.on('change', function (itm) {
            if (!that.isDisabled()) {
                active = itm.getValue();
                refresh();
            }
        });
    }

    if (that.$c.blocked_by) {
        that.$c.blocked_by.on('change', function (itm) {
            if (!that.isDisabled()) {
                blocked = itm.getValue();
                refresh();
            }
        });
    }

    function refresh() {

        for (let i = 0; i < 10; i++) {
            let a = ((1 << i) & active) > 0;
            let b = ((1 << i) & blocked) > 0;

            if (!a && !b) {
                cyclons[i].hide();
            } else {
                cyclons[i].show();
            }
            if (a) {
                cyclons[i].style('fill', colorActive);
            }
            if (b) {
                cyclons[i].style('fill', colorBlocked);
            }
        }
    }

    var oldHide = that.hide;
    that.hide = function () {
        oldHide.apply(that, arguments);
        for (let c of cyclons) {
            c.hide();
        }
    };

    var oldShow = that.show;
    that.show = function () {
        oldShow.apply(that, arguments);
        for (let c of cyclons) {
            c.show();
        }
    };

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that, arguments);
        for (let c of cyclons) {
            c.hide();
        }
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that, arguments);
        refresh();
    };

    // Inicializace
    if (that.$c.value) {
        that.disable();
    } else {
        // Do nothing stay as a symbol        
        that.enable();
    }

    return that;
};


REX.UI.SVG.PC_Pump = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    let $o = that.options || {};    

    const COLOR_ACTIVE = '#00f596';
    const COLOR_ERROR = '#df2626';
    const COLOR_DEFAULT = '#b6bab7';

    let statusEl = SVG.adopt(that.getChildByTag("status"));
    

    if(that.$c.active_by){
        that.$c.active_by.on('change', function(itm) {
            if(!that.isDisabled()){
                refreshStatus();
            }
        });
    }

    if(that.$c.error_by){
        that.$c.error_by.on('change', function(itm) {
            if(!that.isDisabled()){
                refreshStatus();
            }
        });
    }

    function refreshStatus() {
        if (!that.$c.active_by && !that.$c.error_by) {
            return;
        }

        if (that.$c.error_by && that.$c.error_by.getValue()) {
            statusEl.style('fill', COLOR_ERROR);
        }
        else if (that.$c.active_by && that.$c.active_by.getValue()) {
            statusEl.style('fill', COLOR_ACTIVE);
        } else {
            statusEl.style('fill', COLOR_DEFAULT);
        }
    }

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        statusEl.style('fill', COLOR_DEFAULT);
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);
        refreshStatus();
    };  
    
    return that;
};


REX.UI.SVG.PC_Reactor = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    let $o = that.options || {};
    let min = that.check($o.valueMin,0);
    let max = that.check($o.valueMax,1);

    const COLOR_ACTIVE = '#00f596';
    const COLOR_ERROR = '#df2626';
    let height_max = 86;
    

    let levelRect = SVG.adopt(that.getChildByTag("level-rect"));
    let levelTop = SVG.adopt(that.getChildByTag("level-top"));
    let motor = SVG.adopt(that.getChildByTag("motor"));
    
    let param = $(levelTop.node).attr('rexsvg:param');
    if(param){
        try{
            height_max = JSON.parse(param)['max-height'];            
        }
        catch(err){
            that.log.debug('Parsing param "max-height" failed!');
        }
    }
    
    if (that.$c.value) {
        that.$c.value.on('change', function (itm) {
            if (!that.isDisabled()) {
                refreshLevel();
            }
        });
    }
    
    if(that.$c.active_by){
        that.$c.active_by.on('change', function(itm) {
            if(!that.isDisabled()){
                refreshStatus();
            }
        });
    }

    if(that.$c.error_by){
        that.$c.error_by.on('change', function(itm) {
            if(!that.isDisabled()){
                refreshStatus();
            }
        });
    }

    function refreshStatus() {
        if (!that.$c.active_by && !that.$c.error_by) {
            return;
        }

        if (that.$c.error_by && that.$c.error_by.getValue()) {
            motor.style('fill', COLOR_ERROR);
            motor.show();
        }
        else if (that.$c.active_by && that.$c.active_by.getValue()) {
            motor.style('fill', COLOR_ACTIVE);
            motor.show();
        } else {
            motor.hide();
        }
    }

    if(max<min){
        let tmp = min;
        min = max;
        max = tmp;
    }

    function refreshLevel() {
        if (!that.$c.value) {
            return;
        }
        let level = that.$c.value.getValue();
        if (level < min) {
            level = min;
        } else if (level > max) {
            level = max;
        }
        let ratio = Math.abs(level / (max - min));
        let height = Math.round(height_max * ratio);

        if (height > 1) {
            levelTop.transform({
                y: -height
            });
            levelRect.height(height);
            levelRect.show();
            levelTop.show();
        } else {
            levelTop.hide();
            levelRect.hide();
        }
    }

    var oldHide = that.hide;
    that.hide = function () {
        oldHide.apply(that,arguments);        
        motor.hide();
        levelRect.hide();
        levelTop.hide();
    };

    var oldShow = that.show;
    that.show = function () {
        oldShow.apply(that,arguments);        
        refreshStatus();
        refreshLevel();
    };

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        levelTop.hide();
        levelRect.hide();
        motor.hide();
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);
        refreshStatus();
        refreshLevel();
    };  

    // Init state
    motor.hide();
    levelRect.hide();
    levelTop.hide();

    return that;
};


REX.UI.SVG.PC_Tank = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    let $o = that.options || {};
    let min = that.check($o.valueMin,0);
    let max = that.check($o.valueMax,1);

    let height_max = 89;    

    let levelRect = SVG.adopt(that.getChildByTag("level-rect"));
    let levelTop = SVG.adopt(that.getChildByTag("level-top"));
    
    if (that.$c.value) {
        that.$c.value.on('change', function (itm) {
            if (!that.isDisabled()) {
                refreshLevel();
            }
        });
    }

    function refreshLevel() {
        if (!that.$c.value) {
            return;
        }
        let level = that.$c.value.getValue();
        if (level < min) {
            level = min;
        } else if (level > max) {
            level = max;
        }
        let ratio = Math.abs(level / (max - min));
        let height = Math.round(height_max * ratio);

        if (height > 1) {
            levelTop.transform({
                y: -height
            });
            levelRect.height(height);
            levelRect.show();
            levelTop.show();
        } else {
            levelTop.hide();
            levelRect.hide();
        }
    }

    var oldHide = that.hide;
    that.hide = function () {
        oldHide.apply(that,arguments);        
        levelRect.hide();
        levelTop.hide();
    };

    var oldShow = that.show;
    that.show = function () {
        oldShow.apply(that,arguments);                
        refreshLevel();
    };

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        levelTop.hide();
        levelRect.hide();
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);        
        refreshLevel();
    };  

    // Inicializace
    if (that.$c.value) {
        that.disable();
    }    
    else{
        // Do nothing stay as a symbol        
        that.enable();
    }

    return that;
};


REX.UI.SVG.PC_Valve = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    let $o = that.options || {};
    let min = that.check($o.valueMin,0);
    let max = that.check($o.valueMax,1);

    const COLOR_ACTIVE = '#00f596';
    const COLOR_ERROR = '#df2626';
    
    let height_max = 16;
    let height_min = 40.3;
    

    let gradient = SVG.adopt(that.getChildByTag("valve-gradient"));    
    let statusEl = SVG.adopt(that.getChildByTag("status"));
    let levelEl = SVG.adopt(that.getChildByTag("level"));
    let color_default = statusEl.style('fill');

    // Pokud chceme pouzivat gradient musi byt v SVG 2 kopie. Tak ktera se pouziva pro zobrazeni (v hlavnim tagu DEFS)
    // a ta kterou budeme posleze pouzivat pro animaci (v privatnim tagu DEFS u skupiny)
    // Pri inicializaci komponenty se prepneme z hlavniho defs na privatni (viz nize)
    levelEl.each(function(i, children) {
        this.style('fill','url(#'+gradient.node.id+')');
    });
    
    if (that.$c.value) {
        that.$c.value.on('change', function (itm) {
            if (!that.isDisabled()) {
                refreshLevel();
            }
        });
    }
    
    if(that.$c.active_by){
        that.$c.active_by.on('change', function(itm) {
            if(!that.isDisabled()){
                refreshStatus();
            }
        });
    }

    if(that.$c.error_by){
        that.$c.error_by.on('change', function(itm) {
            if(!that.isDisabled()){
                refreshStatus();
            }
        });
    }

    function refreshStatus() {
        if (!that.$c.active_by && !that.$c.error_by) {
            return;
        }

        if (that.$c.error_by && that.$c.error_by.getValue()) {
            statusEl.style('fill', COLOR_ERROR);
        }
        else if (that.$c.active_by && that.$c.active_by.getValue()) {
            statusEl.style('fill', COLOR_ACTIVE);
        } else {
            statusEl.style('fill', color_default);
        }
    }


    function refreshLevel() {
        if (!that.$c.value) {
            return;
        }
        let level = that.$c.value.getValue();
        if (level < min) {
            level = min;
        } else if (level > max) {
            level = max;
        }
        let ratio = Math.abs(level / (max - min));
        let y2 = ((height_max-height_min) * ratio)+height_min;

        gradient.attr('y2',y2);        
    }

    var oldHide = that.hide;
    that.hide = function () {
        oldHide.apply(that,arguments);        
        levelEl.hide();
    };

    var oldShow = that.show;
    that.show = function () {
        oldShow.apply(that,arguments);        
        refreshStatus();
        refreshLevel();
    };
    
    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        statusEl.style('fill', color_default);
        levelEl.hide();
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);
        levelEl.show();
        refreshStatus();
        refreshLevel();
    };  

    // Init state
    levelEl.hide();

    return that;
};
