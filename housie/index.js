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
  var col_log=zeros(8,10);
  for(c=0 ; c<8 ; c++){
    col_log[c]=array_seq(c*10+11,c*10+20);
    shuffle(col_log[c]);
  }
  col1=[1,2,3,4,5,6,7,8,9];
  col1=shuffle(col1);
  col8=[80,81,82,83,84,85,86,87,88,89,90];
  col8=shuffle(col8);
  //col1=col;
  for (n_tickets=0; n_tickets<6;n_tickets++){
  do{
    var result = zeros([3,9]);
    var  idx_r=[];
   for(r= 0; r<3; r++){
     var j= getRandomArbitrary(0,9);
      idx_r.push(j);
      while (r>0 && (idx_r[r]==idx_r[r-1])){
        idx_r[r]=getRandomArbitrary(0,9);
      }
      while (r==2 && (idx_r[2]==idx_r[1] || idx_r[2]==idx_r[0])){
            idx_r[2]=getRandomArbitrary(0,9);
      }
      j= idx_r[r];
      result[r][j]=1;
      result[r][(j+1)%9]=1;
      if (Math.random() <0.7){
        for ( k=0; k<3; k++){
          result[r][(j+2*k+3)%9]=1;
        }
      }
      else {
        do {
          j2= getRandomArbitrary(0,9);
        }while (!(j2 == (j+6)%9 || j2==(j+3)%9 || j2==(j+4)%9 || j2==(j+5)%9))
        result[r][j2]=j2;
        result[r][(j2+1)%9]=1;
        if ((j2+3)%9 == j || (j2+4)%9 == j){
          result[r][(j+3)%9]=1;
        }
        else {
            result[r][(j2+3)%9]=1;
        }
      }
    }
    var sumCol =zeros(1,9);
    var flag=0;
    for (c=0; c< 9;c++){
      sumCol[c]=0;
      for (r=0; r<3; r++){
        sumCol[c] = sumCol[c] + result[r][c];
      }
      if (sumCol[c]==0 || sumCol[0]==3) {
        flag=1;
        continue;
      }
    }
  }while(flag==1)
  //Assign numbers to the places specified
  for (c=0; c<9; c++){
  //var col_log=[]
  var curr_col=[]
  for (r=0; r< 3;r++){
  if (result[r][c]){
  if (c==0){
  if (col1.length!=0){
  result[r][c]=col1.pop();
  }
  else {
  result[r][c]=getRandomArbitrary(c*10,c*10+10);
  }
  }
  else{
  if(c==8) {
  if (col8.length!=0){
  result[r][c]=col8.pop();
  }
  else {
  result[r][c]=getRandomArbitrary(c*10,c*10+11);
  }
  }
  else {
  if (col_log[c-1].length!=0)
  result[r][c]=col_log[c-1].pop();
  else {
  result[r][c]=getRandomArbitrary(c*10,c*10+10);
  }
  }
  }
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
  if(result[r][c] > 0){
    cell.setAttribute('onclick', 'toggle_cell(this);');
    cell.setAttribute('class', '');
  }
  }
  }
  var dstring = '&data=' + result[0].join() + ';' + result[1].join() + ';' + result[2].join();
  _br = document.createElement('br');
  _href = document.createElement('a');

  _href.innerHTML = 'Link to share..';
  _href.href = 'ticket.html?' + dstring;

  _tickets_panel = document.getElementById('tickets');
  _tickets_panel.appendChild(_br);
  _tickets_panel.appendChild(_href);
  _tickets_panel.appendChild(ticket);
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

function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

function array_seq(ini_num, final_num){
  var array=[]
  for (i=0; i<=final_num-ini_num; i++){
    array.push(ini_num+i);
  }
    return array;
}
