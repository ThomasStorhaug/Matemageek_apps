

$(document).ready(function(){
    var colors = {
        'Pastel blue': "#739cf5"
    };
    var figures = {
        'triangles': 0,
    };
    var corners = {
        "A": [100, 500],
        "B": [500, 500],
        "C": [250, 250]
    };
    function updateCoords(corner_a, corner_b, corner_c, layer) {
        var data = $('canvas').getLayer(layer).data;
        if (corner_a != data.corners.A.coords) {
            data.corners.A.coords = corner_a;
            $('#a-coords').text(data.corners.A.coords);
        }
        if (corner_b != data.corners.B.coords) {
            data.corners.B.coords = corner_b;
            $('#b-coords').text(data.corners.B.coords);
        }
        if (corner_c != data.corners.C.coords) {
            data.corners.C.coords = corner_c;
            $('#c-coords').text(data.corners.C.coords)
        }
    }
    

    function calcVector(rootcorner, corner) {
        return [corner[0] - rootcorner[0], corner[1] - rootcorner[1]];
    }
    function calcVectorAngle(vector1, vector2) {
        var dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
        var lengthProduct = Math.sqrt(Math.pow(vector1[0], 2) + Math.pow(vector1[1], 2)) * Math.sqrt(Math.pow(vector2[0], 2) + Math.pow(vector2[1], 2));
        return Math.acos(dotProduct/lengthProduct) * 180 / Math.PI;
    }
    function calcNormAngle(rootcorner, corner) {
        var vector = calcVector(rootcorner, corner)
        var angle = Math.acos(vector[1]*(-1)/Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2)))*180/Math.PI;
        console.log('vinkel: ', angle)
        if (vector[0] < 0) {
            return 360 - angle;
        } else {
            return angle;
        }
    }
    function calcUnitVector(vector) {
        var length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
        return [vector[0]/length, vector[1]/length];
    }
    function drawAngle(rootcorner, corner1, corner2, cornername, trianglename) {
        var angle1 = calcNormAngle(rootcorner, corner1);
        var angle2 = calcNormAngle(rootcorner, corner2);
        //console.log(angle1, angle2)
        var vector1 = calcVector(rootcorner, corner1);
        var vector2 = calcVector(rootcorner, corner2);

        var cornerAngle = calcVectorAngle(vector1, vector2)
        var diff = Math.abs(angle1 - angle2)
        console.log('corner angle: ' + cornerAngle + ' | differanse: ' + diff)

        if (diff < 180) {
            console.log('differanse')
            leftAngle = Math.min(angle1, angle2);
            rightAngle = Math.max(angle1, angle2);
        } else {
            console.log('høyre + 360 - venstre')
            leftAngle = Math.max(angle1, angle2);
            rightAngle = Math.min(angle1, angle2);
        }
        if (Math.round(cornerAngle) == 90) {
            var corrAngle = leftAngle - 90;
            $('canvas').removeLayer(trianglename + cornername + '_arc')
            .drawRect({
                strokeStyle: 'black',
                strokeWidth: 2,
                width: 20, height: 20,
                groups:  ['triangle'],
                dragGroups: ['triangle'],
                draggable: true,
                name: trianglename + cornername + '_arc',
                x: rootcorner[0], y: rootcorner[1],
                translateX: 10, translateY: 10,
                rotate: corrAngle
            }).drawLayers();
        } else {
            $('canvas').removeLayer(trianglename + cornername + '_arc')
            .drawArc({
            strokeStyle: 'black',
            strokeWidth: 2,
            radius: 20,
            draggable: true,
            groups: ['triangle'],
            dragGroups: ['triangle'],
            name: trianglename + cornername + '_arc',
            x: rootcorner[0], y: rootcorner[1],
            start: leftAngle, end: rightAngle
            }).drawLayers();
        }
        $('canvas').removeLayer(trianglename + cornername + '_text')
        .drawText({
            fillStyle: 'black',
            x: rootcorner[0], y: rootcorner[1] + 30,
            fontSize: 25,
            fontFamily: 'Verdana, sans-serif',
            text: Math.round(cornerAngle),
            name: trianglename + cornername + '_text',
            draggable: true,
            groups: ['triangle'],
            dragGroups: ['triangle']
        }).drawLayers();
        
    }
    function updateAngle(corner, layer) {
        var corners = $('canvas').getLayer(layer).data.corners;
        var name = $('canvas').getLayer(layer).name;
        console.log('updating angle' + corner + ' in layer with name: ' + name)
        if (corner=='A') {
            if (corners.A.arc == false) {
                corners.A.arc = true;
                drawAngle(corners.A.coords, corners.B.coords, corners.C.coords, 'A');
            } else {
                corners.A.arc = false;
                $('canvas').removeLayer(name + 'A_arc').removeLayer('A_text').drawLayers()
            }
        } else if (corner=='B') {
            if (corners.B.arc == false) {
                corners.B.arc = true;
                drawAngle(corners.B.coords, corners.A.coords, corners.C.coords, 'B')
            } else {
                corners.B.arc = false;
                $('canvas').removeLayer(name + 'B_arc').removeLayer('B_text').drawLayers()
            }
        } else if (corner=='C') {
            if (corners.C.arc == false) {
                corners.C.arc = true;
                drawAngle(corners.C.coords, corners.A.coords, corners.B.coords, 'C')
            } else {
                corners.C.arc = false;
                $('canvas').removeLayer(name + 'C_arc').removeLayer('C_text').drawLayers()
            }
        }
    }
    function createTriangle(counter) {
        $('canvas').addLayer({
            name: 'triangle_' + counter,
            type: 'line',
            groups: ['triangle'],
            dragGroups: ['triangle'],
            draggable: true,
            strokeStyle: 'black',
            strokeWidth: 2,
            x1: corners.A[0], y1: corners.A[1],
            x2: corners.B[0], y2: corners.B[1],
            x3: corners.C[0], y3: corners.C[1],
            closed: true,
            handle: {
                groups: ['handles'],
                type: 'arc',
                fillStyle: 'rgba(0, 0, 0, 0)',
                radius: 10
            },
            handlestop: function(layer) {
                updateCoords(
                    [layer.x1 + layer.x, layer.y1 + layer.y], 
                    [layer.x2 + layer.x, layer.y2 + layer.y], 
                    [layer.x3 + layer.x, layer.y3 + layer.y], 
                    layer
                    );
                for (corner in layer.data.corners) {
                    if (layer.data.corners[corner].arc == true) {
                        layer.data.corners[corner].arc = false;
                        updateAngle(corner, layer);
                    }
                };
            },
            dragstop: function(layer) {
                updateCoords(
                    [layer.x1 + layer.x, layer.y1 + layer.y], 
                    [layer.x2 + layer.x, layer.y2 + layer.y], 
                    [layer.x3 + layer.x, layer.y3 + layer.y],
                    layer
                    );
            },
            mouseover: function(layer) {
                $('canvas').setLayer(layer, {
                    handle: {
                        type: 'arc',
                        fillStyle: 'rgba(115, 156, 245, 255)',
                        radius: 10
                    }
                }).drawLayers();
            },
            mouseout: function(layer) {
                $('canvas').setLayer(layer, {
                    handle: {
                        type: 'arc',
                        fillStyle: 'rgba(0, 0, 0, 0)',
                        radius: 10
                    }
                })
            },
            data: {
                corners: {
                    A: {
                        coords: [corners.A[0], corners.A[1]],
                        arc: false
                    },
                    B: {
                        coords: [corners.B[0], corners.B[1]],
                        arc: false
                    },
                    C: {
                        coords: [corners.C[0], corners.C[1]],
                        arc: false
                    }
                }
            }
            
       })
       .drawLayers();
    }
    $('.angle').click(function() {
        var id = $(this).attr('id');
        var layer = $('canvas').getLayer('triangle_0');
        if (id=='angle-a') {
            updateAngle('A', layer);
        }   else if (id=='angle-b') {
            updateAngle('B', layer);
        }   else if (id=='angle-c') {
            updateAngle('C', layer);
        }
    });
    $('#create').click(function() {
        createTriangle(figures.triangles);
        figures.triangles += 1;
   }) 
   $('#erase').click(function() {
        $('canvas').removeLayers().drawLayers();
   })
   $('.set').click(function() {
       var angle_A = $('#angle_input_A').val();
       var angle_B = $('#angle_input_B').val();
       var angle_C = $('#angle_input_C').val();
       console.log(angle_A, angle_B, angle_C)
       console.log($('canvas').getLayer('triangle_0').data)
   })
});