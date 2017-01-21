(function() {
    var canvas;
    var poem = "     ’teki çocuklar 2 dakika geç kalmıştı\n"+
        "                sen       \n"+
        "içine zarf atmıştık, geri döndü\n"+
        "kimi bulanmış romantizme, dönmüş\n"+
        "karşı çıkmadı birimiz, öyle güzel,       \n"+
        "                                  \n"+
        "                                  \n"+
        "                        çok güzel\n"+
        "           flörtler ya bunlar,\n"+
        "flört de mi değil, flört mü,\n"+
        "demo-  -  -  -   layığıyla sarmalamışlar\n"+
        "            yok, gırtlağıyla\n"+
        "o       oğlanlarınsa aklına camdan evler soktum\n"+
        "sen her akşam o eve        geç geliyorsun\n"+
        "\n"+
        "     ’te 2 dakikada bir ıslık, düdük, öttürü...\n";

    var signature = "Oytun Tez © 2016, Brooklyn";

    var missingWords = [
        {
            word: "Paris",
            origins: [
                [310, 183],
                [310, 590]
            ],
            label: [100, 100],
            lineObjects: [],
            snapObjects: []
        },
        {
            word: "çılgın",
            origins: [
                [630, 290],
                [567, 318],
                [567, 344]
            ],
            label: [700, 50],
            lineObjects: [],
            snapObjects: []
        },
        {
            word: "8 saat",
            origins: [
                [495, 210],
                [495, 536]
            ],
            label: [400, 50],
            lineObjects: [],
            snapObjects: []
        },
        {
            word: "demokratik",
            origins: [
                [334, 400]
            ],
            label: [110, 698],
            lineObjects: [],
            snapObjects: []
        },
        {
            word: "mö",
            origins: [
                [342, 455],
                [370, 455],
                [396, 455],
                [425, 455]
            ],
            label: [410, 340],
            lineObjects: [],
            snapObjects: []
        },
        {
            word: "bohem",
            origins: [
                [329, 509]
            ],
            label: [810, 600],
            lineObjects: [],
            snapObjects: []
        }
    ];

    var isDragged = false;
    var fontFamily = '"Lucida Console", Monaco, monospace';

    function initialize() {
        canvas = new fabric.Canvas('c', {
            selection: false
        });
        canvas.setBackgroundColor('white');
        fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
        canvas.on({
            'object:moving': onObjectMoving,
            'mouse:up': obObjectMoveStop
        });

        placePoem();
        placeSignature();
        placeWords();
    }

    function placePoem() {
        var textOptions = {
            left: 500,
            top: 400,
            fontFamily: fontFamily,
            fontSize: 15,
            lineHeight: 1.6,
            selectable: false,
            hoverCursor: 'default',
            moveCursor: 'default',
            hasControls: false,
            hasBorders: false
        };
        var text = new fabric.Text(poem, textOptions);

        canvas.add(text);
    }

    function placeSignature() {
        var textOptions = {
            left: 930,
            top: 680,
            fontFamily: 'Arial',
            fontSize: 10,
            fontWeight: "100",
            lineHeight: 1.6,
            fill: "#ddd",
            selectable: false,
            hoverCursor: 'default',
            moveCursor: 'default',
            hasControls: false,
            hasBorders: false
        };
        var text = new fabric.Text(signature, textOptions);

        canvas.add(text);
    }
    
    function placeWords() {
        var textOptions = {
                left: 200,
                top: 200,
                fontFamily: fontFamily,
                fontSize: 15,
                lineHeight: 1.6,
                hasControls: false
            },
            lineOptions = {
                fill: '',
                stroke: 'black',
                objectCaching: false,
                selectable: false,
                hoverCursor: 'default',
                moveCursor: 'default',
                hasControls: false
            },
            text,
            word,
            line,
            origin,
            placeholder,
            placeholderCharacter = '_',
            placeholderObject,
            lineCoords = {},
            originIter = 0,
            lineCoordText,
            wordObjects = [];

        for(var wordI in missingWords) {
            if(!missingWords.hasOwnProperty(wordI)) {
                continue;
            }

            word = missingWords[wordI];

            textOptions.left = word.label[0];
            textOptions.top = word.label[1];
            text = new fabric.Text(word.word, textOptions);
            text.sublines = [];
            text.snapObjects = [];
            text.lineObjects = [];
            text.originalLeft = word.label[0];
            text.originalTop = word.label[1];
            text.isSnapped = false;
            canvas.add(text);

            wordObjects.push(text);

            originIter = 0;

            for(var originI in word.origins) {
                if(!word.origins.hasOwnProperty(originI)) {
                    continue;
                }
                originIter++;

                origin = word.origins[originI];

                var originOptions = JSON.parse(JSON.stringify(textOptions));
                originOptions.left = origin[0];
                originOptions.top = origin[1];
                originOptions.hasBorders = false;
                originOptions.selectable = false;
                originOptions.hoverCursor = 'default';
                originOptions.moveCursor = 'default';
                placeholder = (new Array(word.word.length + 1).join(placeholderCharacter));
                placeholderObject = new fabric.Text(placeholder, originOptions);

                lineCoords = {
                    startLeft: (textOptions.left+25),
                    startTop: (textOptions.top),
                    curve1: (textOptions.left+25),
                    curve2: textOptions.top,
                    curve3: (((textOptions.left+20)+origin[0])),
                    curve4: (((textOptions.top+20)+origin[1])/10),
                    curve5: origin[0],
                    curve6: origin[1]
                };

                if(word.label[0] > origin[0]) {
                    lineCoords.curve3 = lineCoords.curve3/(((origin[0])/(word.label[0]-origin[0]))/2);
                    lineCoords.startLeft -= 70;
                }

                lineCoords.curve1 = lineCoords.startLeft;
                lineCoords.startTop += (originIter*3);
                lineCoords.curve2 = lineCoords.startTop;

                lineCoordText = 'M '+lineCoords.startLeft+' '+lineCoords.startTop+' ' +
                    'C'+lineCoords.curve1+','+lineCoords.curve2+','+lineCoords.curve3+','+lineCoords.curve4+','+lineCoords.curve5+','+lineCoords.curve6+'';

                line = new fabric.Path(lineCoordText, lineOptions);
                line.placeholderObject = placeholderObject;

                placeholderObject.line = line;
                text.lineObjects.push(line);
                text.snapObjects.push(placeholderObject);
                text.sublines.push(line);

                canvas.add(line);
                canvas.add(placeholderObject);
            }
        }

        setTimeout(function() {
            if(isDragged) {
                return;
            }

            for(var i in wordObjects) {
                if(!wordObjects.hasOwnProperty(i)) {
                    continue;
                }

                vibrateObject(wordObjects[i]);
            }
        }, 10000);
    }

    function vibrateObject(object) {
        var wasLeft = false,
            wasUp = false,
            originalLeft = object.left,
            originalTop = object.top,
            leftInterval,
            topInterval;

        leftInterval = setInterval(function() {
            if(isDragged) {
                cancel();
                return;
            }

            var left = originalLeft;

            if(wasLeft) {
                left += 10;
                wasLeft = false;
            } else {
                left -= 10;
                wasLeft = true;
            }

            object.animate('left', left, {
                duration: 200,
                onChange: canvas.renderAll.bind(canvas)
            });
        }, 100);

        setTimeout(function() {
            topInterval = setInterval(function () {
                if(isDragged) {
                    cancel();
                    return;
                }

                var top = originalTop;

                if (wasUp) {
                    top += 10;
                    wasUp = false;
                } else {
                    top -= 10;
                    wasUp = true;
                }

                object.animate('top', top, {
                    duration: 200,
                    onChange: canvas.renderAll.bind(canvas)
                });
            }, 500);
        }, 100);

        function cancel() {
            clearInterval(leftInterval);
            clearInterval(topInterval);

            setTimeout(function() {
                object.animate('left', originalLeft, {
                    duration: 200,
                    onChange: canvas.renderAll.bind(canvas),
                    onComplete: function() {
                        object.setCoords();
                    }
                });

                object.animate('top', originalTop, {
                    duration: 200,
                    onChange: canvas.renderAll.bind(canvas),
                    onComplete: function() {
                        object.setCoords();
                    }
                });
            }, 500);
        }

        setTimeout(cancel, 3000);
    }

    function onObjectMoving(e) {
        if(!e.hasOwnProperty('target')) {
            return;
        }

        isDragged = true;

        hideLines(e.target);

        var object = e.target,
            top = object.top,
            left = object.left,
            snaps = object.snapObjects,
            snap,
            snapThreshold = 30;

        object.isSnapped = false;

        for(var snapI in snaps) {

            if(!snaps.hasOwnProperty(snapI)) {
                continue;
            }

            snap = snaps[snapI];

            if(Math.abs(snap.left - left) > snapThreshold || Math.abs(snap.top - top) > snapThreshold) {
                continue;
            }

            object.setLeft(snap.left);
            object.setTop(snap.top);
            object.bringToFront();
            object.isSnapped = true;
            object.snappedToObject = snap;
            object.setCoords();

            break;
        }
    }

    function showLines(object) {
        return toggleLines(object, true);
    }

    function hideLines(object) {
        return toggleLines(object, false);
    }

    function toggleLines(object, isVisible) {
        if(!object.hasOwnProperty('sublines')) {
            return;
        }

        for(var i in object.sublines) {
            if(!object.sublines.hasOwnProperty(i)) {
                continue;
            }

            object.sublines[i].setVisible(isVisible);
        }

        return true;
    }

    function obObjectMoveStop(e) {
        if(!e.hasOwnProperty('target') || !e.target) {
            return;
        }

        var object = e.target;

        if(!object.hasOwnProperty('isSnapped')) {
            return;
        }

        if(object.isSnapped) {
            if(object.hasOwnProperty('snappedToObject')) {
                object.snappedToObject.text = object.text;

                if(object.hasOwnProperty('sublines')) {
                    var line,
                        activeLines = 0;

                    for (var i in object.sublines) {
                        if (!object.sublines.hasOwnProperty(i)) {
                            continue;
                        }

                        line = object.sublines[i];

                        if (line.placeholderObject === object.snappedToObject) {
                            line.remove();
                            object.sublines.splice(i, 1);

                            break;
                        }
                    }

                    if(object.sublines.length < 1) {
                        object.remove();

                        return;
                    }
                }
            }
        }

        //reset
        object.setTop(object.originalTop);
        object.setLeft(object.originalLeft);
        object.bringToFront();

        showLines(object);
        object.setCoords();
    }

    initialize();
})();