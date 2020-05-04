window.params = {
    active_cells: {
        0: [0, 3, 6],
        1: [1, 3, 5],
        2: [2, 3, 4],
        3: [0, 1, 2, 4, 5, 6],
        4: [2, 3, 4],
        5: [1, 3, 5],
        6: [0, 3, 6]
    },
    vertical_lines: {
        0: [],
        1: [0, 6],
        2: [0, 1, 5, 6],
        3: [3],
        4: [0, 1, 5, 6],
        5: [0, 6],
        6: []
    },
    white_max: 2,
    black_max: 2,
    /* odd - white, even - black */
    turn: 1,
    threshold: 4,
    players: {
        0: 'black',
        1: 'white'
    },
    possible_moves:{
        0:  { l:-1, r:3, u:-1, d:21 },
        3:  { l:0, r:6, u:-1, d:10 },
        6:  { l:3, r:-1, u:-1, d:27 },
        8:  { l:-1, r:10, u:-1, d:22 },
        10: { l:8, r:12, u:-1, d:17 },
        12: { l:10, r:-1, u:-1, d:26 },
        16: { l:-1, r:17, u:-1, d:23 },
        17: { l:16, r:18, u:10, d:-1 },
        18: { l:17, r:-1, u:-1, d:25 },
        21: { l:-1, r:22, u:0, d:42 },
        22: { l:21, r:23, u:8, d:36 },
        23: { l:22, r:-1, u:16, d:30 },
        25: { l:-1, r:26, u:18, d:32 },
        26: { l:25, r:27, u:12, d:40 },
        27: { l:26, r:-1, u:6, d:48 },
        30: { l:-1, r:31, u:23, d:-1 },
        31: { l:30, r:32, u:-1, d:38 },
        32: { l:31, r:-1, u:25, d:-1 },
        36: { l:-1, r:38, u:22, d:-1 },
        38: { l:36, r:40, u:31, d:45 },
        40: { l:38, r:-1, u:26, d:-1 },
        42: { l:-1, r:45, u:21, d:-1 },
        45: { l:42, r:48, u:38, d:-1 },
        48: { l:45, r:-1, u:27, d:-1 },

    },
    daadhi_combinations: [
        /* Horizontal */
        [0,   3,  6],
        [8,  10, 12],
        [16, 17, 18],
        [21, 22, 23],
        [25, 26, 27],
        [30, 31, 32],
        [36, 38, 40],
        [42, 45, 48],

        /* Vertical */
        [0,  21, 42],
        [8,  22, 36],
        [16, 23, 30],
        [3,  10, 17],
        [31, 38, 45],
        [18, 25, 32],
        [12, 26, 40],
        [6,  27, 48]
    ],
    score: {
        'black': 0,
        'white': 0
    },
    score_new: {
        'black': 0,
        'white': 0
    },
    remove_flag: 0
}

var playground = document.getElementById("playground");

/* Generate the grid to play game. */
for(r = 0; r < 7; r++){
    var tr = playground.insertRow(r);
    for(c = 0; c < 7; c++){
        var td = tr.insertCell(c);
        td.setAttribute('row', r);
        td.setAttribute('col', c);
        td.setAttribute('id', r*7+c);
        td.setAttribute('contents', '');
        if(window.params.active_cells[r].includes(c)){
            td.setAttribute('class', 'active');
            td.setAttribute('onclick', 'select(' + parseInt(r) + ', ' + parseInt(c) +  ', this' + ')');
        }else if(window.params.vertical_lines[r].includes(c)){
            td.innerHTML = '<div class="vl"></div>';
        }else{
            td.innerHTML = '<div class="hl"></div>';
        }

        if(r == 3 && c == 3){
            td.innerHTML = '<div class="hl"></div><div class="vl"></div>'
        }
    }
}

function select(r, c, obj){
    if(window.params.remove_flag != 0){
        remove(r, c, obj);
        return;
    }
    var cont = obj.getAttribute('contents');
    if(cont == '' && window.params.turn <= window.params.threshold){
        /* Empty + Can Put a new piece */
        var player = window.params.players[window.params.turn % 2];
        obj.setAttribute( 'contents', player );
        obj.innerHTML = '<img src="img/' + player + '.png" width="45px" height="45px" />';
        var pieces_left = parseInt( document.getElementById(player + '-pieces').innerHTML );
        document.getElementById(player + '-pieces').innerHTML = pieces_left - 1;
        check_score();
        update_turn();
    }else if(cont != '' && window.params.turn > window.params.threshold){
        /* It is not empty and we want to move the piece, after selection */
        /* remove previous selection */
        var sel_obj = document.getElementsByClassName('selected');
        if(sel_obj.length > 0){
            sel_obj = sel_obj[0];
            var class_name = sel_obj.getAttribute('class').replace(' selected', '');
            sel_obj.setAttribute('class', class_name);
        }

        var class_name = obj.getAttribute('class');
        obj.setAttribute('class', class_name + ' selected');
    }
}

function key_press_action(event){
    var key_code = event.which || event.keyCode;
    var obj = document.getElementsByClassName('selected');
    if(obj.length > 0){
        obj = obj[0];
        if( window.params.players[ window.params.turn % 2 ] != obj.getAttribute('contents') ){
            alert("Other player's turn");
            return;
        }
        var r = parseInt( obj.getAttribute('row') );
        var c = parseInt( obj.getAttribute('col') );
        var row_index = window.params.active_cells[r].indexOf(c);
        var class_name = "";
        var target = {
            /* arrows */
            37: 'l',
            38: 'u',
            39: 'r',
            40: 'd',
            /* a w d s */
            65: 'l',
            87: 'u',
            68: 'r',
            83: 'd',
        }
        if( window.params.possible_moves[r*7+c][ target[key_code] ] == -1){
            /* move not possible */
            alert('move not possible!');
        }else{
            var next_pos = window.params.possible_moves[r*7+c][ target[key_code] ];
            // var next_r = Math.floor(next_pos/7);
            // var next_c = next_pos % 7;
            var next_obj = document.getElementById(next_pos);
            if(next_obj.getAttribute('contents') != ''){
                alert('position already occupied!');
            }else{
                next_obj.innerHTML = obj.innerHTML;
                next_obj.setAttribute('contents', obj.getAttribute('contents') );

                obj.innerHTML = '';
                obj.setAttribute('contents', '');
                class_name = obj.getAttribute('class').replace(' selected', '');
                obj.setAttribute('class', class_name);
                check_score();
                update_turn();
            }
        }
    }
}

function check_score(){

    window.params.score_new['black'] = 0;
    window.params.score_new['white'] = 0;
    for(i = 0; i < 16; i++){
        var content = [];
        for(j = 0; j < 3; j++ ){
            content[j] = document.getElementById(window.params.daadhi_combinations[i][j]).getAttribute('contents');
        }
        if(content[0] == content[1] && content[0] == content[2] && content[0] != ''){
            window.params.score_new[content[0]]++;
        }
    }
    if(window.params.score['black'] < window.params.score_new['black']){
        window.params.turn--; // becuase it will be incremented in update_turn function
        window.params.remove_flag = 1;
        alert('remove white piece');
        console.log(window.params.turn);
        console.log( window.params.score['black'] + '-' + window.params.score['white'] );
        console.log( window.params.score_new['black'] + '-' + window.params.score_new['white'] );
    }

    if( window.params.score['white'] < window.params.score_new['white'] ){
        window.params.turn--; // becuase it will be incremented in update_turn function
        window.params.remove_flag = 1;
        alert('remove black piece');
        console.log(window.params.turn);
        console.log( window.params.score['black'] + '-' + window.params.score['white'] );
        console.log( window.params.score_new['black'] + '-' + window.params.score_new['white'] );
    }
    update_score();
}

function update_turn(){
    window.params.turn++;
    var elems = document.getElementsByClassName('black');
    elems[0].setAttribute('class', 'black');
    elems[1].setAttribute('class', 'black');
    elems[2].setAttribute('class', 'black');
    elems[3].setAttribute('class', 'black');
    var elems = document.getElementsByClassName('white');
    elems[0].setAttribute('class', 'white');
    elems[1].setAttribute('class', 'white');
    elems[2].setAttribute('class', 'white');
    elems[3].setAttribute('class', 'white');
    var elems = document.getElementsByClassName(window.params.players[ window.params.turn % 2 ]);
    var c = elems[0].getAttribute('class');
    elems[0].setAttribute('class', c + ' highlight');
    elems[1].setAttribute('class', c + ' highlight');
    elems[2].setAttribute('class', c + ' highlight');
    elems[3].setAttribute('class', c + ' highlight');
}

function update_score(){
    window.params.score['black'] = window.params.score_new['black'];
    window.params.score['white'] = window.params.score_new['white'];
    document.getElementById('black').innerHTML = window.params.score['black'];
    document.getElementById('white').innerHTML = window.params.score['white'];
}

function remove(r, c, obj){
    console.log('removing object');
    var cont = obj.getAttribute('contents');
    if(cont == window.params.players[ (window.params.turn +1 ) % 2 ]){
        /* remove that piece */
        obj.setAttribute('contents', '');
        obj.innerHTML = '';
        window.params.remove_flag = 0;
        update_turn();
        var dead_count = parseInt( document.getElementById(cont+'-dead').innerHTML );
        document.getElementById(cont+'-dead').innerHTML = dead_count + 1;
        check_score();
    }else{
        alert('remove ' + window.params.players[( window.params.turn +1 )% 2 ] + ' players piece' );
    }
}

function alert(txt){
    var element = document.getElementById('announcement')
    element.innerHTML = txt;
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            // element.style.display = 'none';
            element.innerHTML = '';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.05;
    }, 50);
}