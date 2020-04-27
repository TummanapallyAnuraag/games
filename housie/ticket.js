
var params = getParams(window.location.href);
console.log(params);

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
        }
    }
}
_tickets_panel = document.getElementById('tickets-start');
_tickets_panel.after(ticket);

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
