var params = getParams(window.location.href);

if(params['name']){
    document.getElementById('player-name').innerHTML = params['name'];
}else{
    document.getElementById('player-name').innerHTML = 'Housie';
}

data = [ 
        [90, 90, 90, 90, 90, 90, 90, 90, 90], 
        [90, 90, 90, 90, 90, 90, 90, 90, 90], 
        [90, 90, 90, 90, 90, 90, 90, 90, 90], 
        ];
if(params['data']){
    var dstrings = params['data'].split(';');
    data[0] = dstrings[0].split(',');
    data[1] = dstrings[1].split(',');
    data[2] = dstrings[2].split(',');
}

var ticket = document.createElement("table");
for(r = 0; r < 3; r++){
    var row = ticket.insertRow(r);
    for(c = 0; c < 9; c++){
        var cell = row.insertCell(c);
        cell.innerHTML = data[r][c] > 0 ? data[r][c] : '';
        cell.setAttribute('class', '');
        if(data[r][c] > 0){
            cell.setAttribute('onclick', 'toggle_cell(this)');
            cell.setAttribute('class', 'val-'+data[r][c]);
        }
    }
}
_tickets_panel = document.getElementById('tickets');
_tickets_panel.appendChild(ticket);


window.params = {
    width: 10,
    height: 9,
    coins: 90,
    turn: 0,
    enable_auto_strike: true,
}

window.params.enable_auto_strike = document.getElementById("auto_strike").checked;

var playground = document.getElementById("playground");
document.getElementById('status').innerHTML = window.params.turn;

for(r = 0; r < window.params.height; r++){
    var row = playground.insertRow(r);
    for(c = 0; c < window.params.width; c++){
        var cell = row.insertCell(c);
        cell.setAttribute('row', r);
        cell.setAttribute('col', c);
        cell.setAttribute('class', '');
        // row*width + col
        cell.setAttribute('id', r*window.params.width + c + 1);
        cell.innerHTML = r*window.params.width + c + 1;
        cell.setAttribute('onclick', 'reveal_coin(this);');
    }
}

function reveal_coin(obj){
    obj.setAttribute('class', 'reveal');
    document.getElementById('log').innerHTML += obj.innerHTML + ', ';
    window.params.turn++;
    document.getElementById('status').innerHTML = window.params.turn;

    document.getElementById("revealed").innerHTML = obj.innerHTML;
    if(window.params.enable_auto_strike){
        elems = document.getElementsByClassName("val-" + obj.innerHTML);
        for(i = 0; i < elems.length; i++){
            toggle_cell(elems[i]);
        }
    }
}

function toggle_cell(obj){
    var cname = obj.getAttribute('class');
    if(cname.indexOf('selected') != -1){
        if(confirm('Do you want to de-selet this entry?')){
            cname = cname.replace(' selected', '');
            obj.setAttribute('class', cname);
            obj.innerHTML = obj.innerHTML.replace('<strike>', '');
            obj.innerHTML = obj.innerHTML.replace('</strike>', '');
        }
    }else{
        obj.setAttribute('class', cname + ' selected');
        obj.innerHTML = '<strike>' + obj.innerHTML + '</strike>';
    }
}

function getParams(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 256,
    height: 256,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

function checkbox_clicked(){
    window.params.enable_auto_strike = document.getElementById("auto_strike").checked;
}