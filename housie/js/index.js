window.params = {
    width: 10,
    height: 9,
    coins: 90,
    coin_log: [],
    turn: 0,
    ticket_count: 0,
    urls: {}
}

for(i = 0; i < window.params.width*window.params.height; i++)
    window.params.coin_log[i] = i+1;

window.params.coin_log = shuffle(window.params.coin_log);
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
    }
}

function getRandomArbitrary(min, max) {
    // max exclusive
    return parseInt( Math.random() * (max - min) + min );
}

function reveal_coin(){
    if(window.params.turn >= window.params.coins ){
        alert('All revealed!');
        return;
    }else{
        cur_coin = window.params.coin_log[ window.params.turn ];
        document.getElementById(cur_coin).setAttribute('class', 'reveal');
        document.getElementById('log').innerHTML += cur_coin + ', ';
        window.params.turn++;
        document.getElementById('status').innerHTML = window.params.turn;

        document.getElementById("revealed").innerHTML = cur_coin;
        elems = document.getElementsByClassName("val-" + cur_coin);
        for(i = 0; i < elems.length; i++){
        	toggle_cell(elems[i]);
        }
    }
}

function shuffle(aray) {
    var ctr = aray.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = aray[ctr];
        aray[ctr] = aray[index];
        aray[index] = temp;
    }
    return aray;
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

function generate_ticket(){
	reset_ticket_params();
	populate_ticket_pools();
	for (n_tickets=0; n_tickets<6;n_tickets++){
		result = window.tickets[n_tickets].positions;

		window.params.ticket_count++;
		var ticket = document.createElement("table");
		ticket.setAttribute('id', 'ticket-'+window.params.ticket_count);
		for(r = 0; r < 3; r++){
			var row = ticket.insertRow(r);
			for(c = 0; c < 9; c++){
				var cell = row.insertCell(c);
				cell.innerHTML = result[r][c] > 0 ? result[r][c] : '';
				if(result[r][c] > 0){
					cell.setAttribute('onclick', 'toggle_cell(this);');
					cell.setAttribute('class', 'val-'+result[r][c]);
				}
			}
		}

        /* UI for showing ticket */
		var dstring = '&data=' + result[0].join() + ';' + result[1].join() + ';' + result[2].join();
        window.params.urls[window.params.ticket_count] = window.location.href.replace('index.html', '') + 'ticket.html?' + dstring;
        
        _container = document.createElement('div');
        _sno = document.createElement('div');
        _name = document.createElement('input');
		_href = document.createElement('a');
        _whatsapp = document.createElement('a');

        _container.setAttribute('class', 'playername-container');

        _sno.innerHTML = window.params.ticket_count + '. ';

		_href.innerHTML = '<img src="link.png" width="20px"/>';
        _href.href = 'ticket.html?' + dstring;
		_href.target = '_blank';
        _href.id = "linkfor-" + window.params.ticket_count;

        _whatsapp.innerHTML = '<img src="whatsapp.png" width="20px"/>';
        _whatsapp.href = 'whatsapp://send?text=' + encodeURIComponent(window.location.href.replace('index.html', '') + 
                        'ticket.html?' + dstring);
        _whatsapp.setAttribute("data-action","share/whatsapp/share");
        _whatsapp.target = '_blank';
        _whatsapp.id = "whatsappfor-" + window.params.ticket_count;


        _name.placeholder='Player Name';
        _name.value='';
        _name.setAttribute('onkeyup', 'ticket_links_update(this);');
        _name.setAttribute('id', 'namefor-' + window.params.ticket_count);
        _name.setAttribute('class', 'playername');


		_tickets_panel = document.getElementById('tickets');
        _tickets_panel.appendChild(_container);
        _container.appendChild(_sno);
		_container.appendChild(_name);
        _container.appendChild(_href);
		_container.appendChild(_whatsapp);
		_tickets_panel.appendChild(ticket);
	}
}

function ticket_links_update(obj){
    ticket_id = parseInt( obj.getAttribute('id').replace('namefor-', '') );
    link_obj = document.getElementById("linkfor-" + ticket_id);
    whatsapp_obj = document.getElementById("whatsappfor-" + ticket_id);

    link_obj.href = window.params.urls[ticket_id] + '&name=' + obj.value;
    whatsapp_obj.href = 'whatsapp://send?text=' + encodeURIComponent(window.params.urls[ticket_id] + '&name=' + obj.value);
}