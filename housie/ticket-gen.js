window.column_pool = [];
for(c = 0; c < 9; c++){
	// window.column_pool[c] is column pool of ith col
	// 1-9, 10-19, 20-29, .... 70-79, 80-90
	// 9, 10, 10, 	10, 10, 10, 	10, 10, 11
	window.column_pool[c] = [];
	for(temp = 0; temp < 10; temp++){
		if(c != 0)
			window.column_pool[c][temp] = c*10 + temp;
		else if (c == 0 && temp < 9)
			window.column_pool[c][temp] = c*10 + temp + 1;
	}
}
window.column_pool[8][10] = 90;

function populate_ticket_pools(){
	// shuffle global column pool instead of picking random no. each time.
	var top_ptr = [];
	var c, rcard, row_positions_remaining, max_index, r, counter;
	for(c = 0; c < 9; c++){
		window.column_pool[c] = shuffle(window.column_pool[c]);
		top_ptr[c] = 0;
	}

	// step 1 : pick a number and assign to each column, in each ticket respectively.
	for(t = 0; t < 6; t++){
		window.tickets[t].col_pool = [];
		var top_val;
		for(c = 0; c < 9; c++){
			top_val = window.column_pool[c][ top_ptr[c] ];
			window.tickets[t].col_pool[c] = [top_val];
			window.tickets[t].col_count[c]++;
			window.tickets[t].count++;
			top_ptr[c]++;
		}
	}
	// step 2: assign one of the numbers in the last column to a random card.
	rcard = getRandomArbitrary(0,6);
	window.tickets[rcard].col_pool[8].push( window.column_pool[8][ top_ptr[8] ] );
	window.tickets[rcard].col_count[8]++;
	window.tickets[rcard].count++;
	top_ptr[8]++;

	/* 
	Step 3 
	make 4 passes over the remaining columns. 
	In each pass, assign 1 of the remaining numbers for that column to a random card, 
	skipping cards that are already full or have 3 numbers from that column. 
	In the first three passes, maxing out at 2 numbers per column instead of 3.
	*/
	var pass = 1;
	for(pass = 1; pass <= 3; pass++){
		for(c = 0; c < 9; c++){
			var continue_loop = 0;
			// repeat until satisfactory
			do{
				rcard = getRandomArbitrary(0,6);
				if( window.tickets[rcard].count < 15  && window.tickets[rcard].col_count[c] < 2){
					window.tickets[rcard].col_pool[c].push( window.column_pool[c][ top_ptr[c] ]);
					window.tickets[rcard].col_count[c]++;
					window.tickets[rcard].count++;
					top_ptr[c]++;
					continue_loop = 0;
				}else{
					continue_loop = 1;
				}
			}while(continue_loop);
			
		}
	}

	/* 
	Step 3 final pass.. 
	column index 0 (1st col) is now empty..
	*/
	console.log( window.column_pool[0].length, top_ptr[0] );
	for(c = 1; c < 9; c++){
		var continue_loop = 0;
		// repeat until satisfactory
		do{
			rcard = getRandomArbitrary(0,6);
			if( window.tickets[rcard].count < 15  && window.tickets[rcard].col_count[c] < 3){
				window.tickets[rcard].col_pool[c].push( window.column_pool[c][ top_ptr[c] ]);
				window.tickets[rcard].col_count[c]++;
				window.tickets[rcard].count++;
				top_ptr[c]++;
				continue_loop = 0;
			}else{
				continue_loop = 1;
			}
		}while(continue_loop);
	}

	/* 
	Now we have individual column pool in each ticket, now need to order them (permutate)
	so that each row has 5 numbers only
	*/
	for(t = 0; t < 6; t++){
		row_positions_remaining = [5, 5, 5];

		// if a column has 3 no.s then not much we can do...
		for(c = 0; c < 9; c++){
			if(window.tickets[t].col_count[c] == 3){
				window.tickets[t].positions[0][c] = 1;
				window.tickets[t].positions[1][c] = 1;
				window.tickets[t].positions[2][c] = 1;
				row_positions_remaining[0]--;
				row_positions_remaining[1]--;
				row_positions_remaining[2]--;
			}
		}
		// if a column has 2 no.s only, then we can do something.
		for(c = 0; c < 9; c++){
			if(window.tickets[t].col_count[c] == 2){
				max_index = max_index_of(row_positions_remaining);
				window.tickets[t].positions[max_index][c] = 1;
				row_positions_remaining[max_index]--;

				max_index = max_index_of(row_positions_remaining);
				window.tickets[t].positions[max_index][c] = 1;
				row_positions_remaining[max_index]--;
			}
		}
		// now rest all are columns with only 1 no. put them greedily.
		for(c = 0; c < 9; c++){
			if(window.tickets[t].col_count[c] == 1){
				max_index = max_index_of(row_positions_remaining);
				window.tickets[t].positions[max_index][c] = 1;
				row_positions_remaining[max_index]--;
			}
		}

		// now put the numbers in the positions
		for(c = 0; c < 9; c++){
			counter = 0;
			for(r = 0; r < 3; r++){
				if(window.tickets[t].positions[r][c] == 1 && counter < window.tickets[t].col_count[c]){
					window.tickets[t].positions[r][c] = window.tickets[t].col_pool[c][counter];
					counter++;
				}
			}
		}
	}
}


function max_index_of(aray){
	var mi = 0;
	mi = aray[0] > aray[1] ? 0 : 1;
	if(aray[0] == aray[1])
		mi = getRandomArbitrary(0,2);

	mi = aray[mi] > aray[2] ? mi : 2;
	if(aray[mi] == aray[2]){
		var x = getRandomArbitrary(0,2);
		mi = (x == 0) ? mi : 2;
	}
	return mi;
}


function reset_ticket_params(){
	var t = 0;
	window.tickets = [];
	for(t = 0; t < 6; t++){
		window.tickets[t] = {
			col_count: [0,0,0, 0,0,0, 0,0,0],
			count: 0,
			row_count: [0,0,0],
			positions: [ [0,0,0, 0,0,0, 0,0,0], [0,0,0, 0,0,0, 0,0,0], [0,0,0, 0,0,0, 0,0,0] ],
		}
	}
}