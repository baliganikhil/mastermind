/*globals $*/

var problem = [],
    moves_made = 0,
    colours = ['red', 'blue', 'green', 'yellow', 'pink', 'orange'];

function getRandomInt(min, max) {
    'use strict';
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clear_slots() {
    'use strict';
    
    $('.current_move .slot').
        data('colour', '').
        removeClass('red').
        removeClass('blue').
        removeClass('green').
        removeClass('yellow').
        removeClass('pink').
        removeClass('orange');
}

function noe(i) {
    'use strict';
    
    return [undefined, null, ''].indexOf(i) > -1;
}

function create_new_problem() {
    'use strict';
    
    var i;
    
    problem = [];
    moves_made = 0;
    
    for (i = 0; i < 4; i++) {
        problem.push(colours[getRandomInt(0, colours.length - 1)]);
    }
    
    clear_slots();
    $('.prev_moves').html('');
}

create_new_problem();

function check_beads() {
    'use strict';
    
    var correct_positions = 0,
        correct_colours = 0,
        colour_map = {},
        correct_position_array = (new Array(4)).fill(0),
        valid = true,
        prev_move = [],
        solution_indicator = '',
        moves_made_container = '';

    $('.current_move .slot').each(function (key, val) {
        var cur_colour = $(this).data('colour');

        if (noe(cur_colour)) {
            window.alert('Please fill all 4 slots');
            valid = false;
            return false;
        }

        prev_move.push("<div class='medium-1 column end'><div class='bead " + cur_colour + "' data-colour=" + cur_colour + "></div></div>");

        if (cur_colour === problem[key]) {
            correct_positions++;
            correct_position_array[key] = 1;
            return true;
        }

        if (!colour_map.hasOwnProperty(cur_colour)) {
            colour_map[cur_colour] = 0;
        }

        colour_map[cur_colour]++;
    });

    if (!valid) { return; }

    problem.forEach(function (v, k) {
        if (correct_position_array[k] === 0 && (!noe(colour_map[v]) && colour_map[v] > 0)) {
            correct_colours++;
            colour_map[v]--;
        }
    });

    solution_indicator = [  '<div class="medium-4 column end cur_hint">',
                                '<div>' + correct_positions + ' Colour(s) are in right position(s)</div>',
                                '<div>' + correct_colours + ' Colour(s) are in incorrect position(s)</div>',
                            '</div>'
                         ].join('');

    moves_made_container = '<div class="medium-1 column end">' + (++moves_made) + '</div>';

    prev_move = '<div class="row prev_move">' + prev_move.join('') + solution_indicator + moves_made_container + '</div>';

    $('.prev_moves').prepend(prev_move);
    clear_slots();
    
    if (correct_positions === 4) {
        alert('You win! You made ' + moves_made + ' moves');
        create_new_problem();
    }
}

$('.sidebar .bead').draggable({
    revert: "invalid",
    helper: "clone"
});

$('.slot').droppable({
    accept: ".bead",
    drop: function (event, ui) {
        'use strict';
        
        var dropped_colour = $(ui.draggable).data('colour');

        $(this).addClass(dropped_colour);
        $(this).data('colour', dropped_colour);
    }
});

$('.btn_submit').on('click', function () {
    'use strict';
    
    check_beads();
});

$('#btn_show_game').on('click', function () {
    'use strict';
    
    $('.help').hide();
    $('.gameboard').show();
});

$('.link_how_to_play').on('click', function () {
    'use strict';
    
    $('.help').show();
    $('.gameboard').hide();
});

$('.link_new_game').on('click', function () {
    create_new_problem();
});