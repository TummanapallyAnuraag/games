window.params = {
    width: 10,
    height: 9,
    coins: 90,
    coin_log: [],
    turn: 0,
    ticket_count: 0
}

for(i = 0; i < window.params.width*window.params.height; i++){
    window.params.coin_log[i] = i+1;
}

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

function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

function generate_ticket(){
    var result = zeros([3,9]);
   for(count= 0; count<9; count++){
      var  j = getRandomArbitrary(0,  3);
      result[j][count]=1;
    }
  var sumRow =[0,0,0];
  var rem_elemts=[5,5,5];
  for (r=0; r< 3;r++){
    sumRow[r]=0;
    for (c=0; c<9; c++){
        sumRow[r] = sumRow[r] + result[r][c];
      }
    rem_elemts[r]=5-sumRow[r];
  }

  var all_sum=9;
  while (all_sum < 15) {
    var rand_row=getRandomArbitrary(0,  3);
    var rand_col=getRandomArbitrary(0,  10);
    result[rand_row][rand_col]=1;
    all_sum=0;
    for (r=0; r< 3;r++){
      sumRow[r]=0;
      for (c=0; c<9; c++){
          sumRow[r]=sumRow[r]+result[r][c];
          all_sum = all_sum + result[r][c];
        }
        if (sumRow[r]>5)
        { result[rand_row][rand_col]=0;
          all_sum=all_sum-1
          continue;
        }
    }
  }

  for (c=0; c<9; c++){
    //var col_log=[]
    var curr_col=[]
    for (r=0; r< 3;r++){
      if (result[r][c]){
        result[r][c]=getRandomArbitrary(c*10+1,c*10+11);
        if (r==1){
          while (result[r][c]==result[r-1][c]){
            result[r][c]=getRandomArbitrary(c*10+1,c*10+11);
          }
        }
        if (r==2){
          while (result[r][c]==result[r-1][c] || result[r][c]==result[r-2][c]){
            result[r][c]=getRandomArbitrary(c*10+1,c*10+11);
          }
        }
      }
      if (result[r][c]!=0){
        curr_col.push(result[r][c])
      }
    }
     curr_col.sort(function(a, b){return a - b});
//     document.getElementById('testing').innerHTML = curr_col;
     for (r=2; r>=0;r--){
       if (result[r][c]!=0){
         result[r][c]=curr_col.pop()
       }
     }
  }
    window.params.ticket_count++;
    var ticket = document.createElement("table");
    ticket.setAttribute('id', 'ticket-'+window.params.ticket_count);
    // ticket.setAttribute('onclick', 'print_ticket('+ window.params.ticket_count +')');
    for(r = 0; r < 3; r++){
        var row = ticket.insertRow(r);
        for(c = 0; c < 9; c++){
            var cell = row.insertCell(c);
            cell.innerHTML = result[r][c] > 0 ? result[r][c] : '';
            cell.setAttribute('class', '');
            if(result[r][c] > 0){
              cell.setAttribute('onclick', 'toggle_cell(this)');
            }
        }
    }
    var dstring = '&data=' + result[0].join() + ';' + result[1].join() + ';' + result[2].join();
    _br = document.createElement('br');
    _href = document.createElement('a');
    _button = document.createElement('button');

    _href.innerHTML = 'Link to share..';
    _href.href = 'ticket.html?' + dstring;

    _button.innerHTML = 'copy';
    _button.setAttribute('share_link', 'ticket.html?' + dstring);
    _button.setAttribute('onclick', 'share_it(this);');

    _tickets_panel = document.getElementById('tickets-start');
    _tickets_panel.after(ticket);
    _tickets_panel.after(_href);
    _tickets_panel.after(_button);
    _tickets_panel.after(_br);
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

function share_it(obj){
  var copyText = obj.getAttribute('share_link');
  var new_elem = document.createElement('input');
  new_elem.setAttribute('value', copyText);
  new_elem.select();
  new_elem.setSelectionRange(0, 99999);
  document.execCommand("copy");
  
  obj.innerHTML = 'copied!';
}