var DIGIT_COLORS = {
  '0': 'black',
  '1': 'brown',
  '2': 'red',
  '3': 'orange',
  '4': 'yellow',
  '5': 'green',
  '6': 'blue',
  '7': 'purple',
  '8': 'grey',
  '9': 'white'
}

var POWER_COLORS = {
  '': 'black',
  '0': 'brown',
  '00': 'red',
  '000': 'orange',
  '0000': 'yellow',
  '00000': 'green',
  '000000': 'blue',
  '0000000': 'purple',
  '00000000': 'grey',
  '000000000': 'white'
}

var POWER_POSTFIXES = {
  'k': 3,
  'M': 6
}

function ohms_to_colors(ohms){
  var str_ohms = ohms + "";
  var first_band = DIGIT_COLORS[str_ohms[0]];
  var second_band = DIGIT_COLORS[str_ohms[1]];
  var rest = str_ohms.substr(2);
  var third_band = POWER_COLORS[rest];
  return [first_band, second_band, third_band];
}

function text_to_ohms(text){
  var power_char = text[text.length-1];
  if(isNaN(parseInt(power_char))){
    var power = POWER_POSTFIXES[power_char];
    return parseInt(text.substring(0, text.length-1)) * Math.pow(10, power);
  } else {
    return parseInt(text);
  }
}

function random_resistor(){
  var value = Math.round(Math.random()*100);
  var power = Math.round(Math.random()*7);
  value = value * Math.pow(10, power);
  return value;
}

(function($) {
  $.template('resistor-question', '<tr><td class="question"><div class="resistor"> \
  <div style="background-color:${v1}"></div> \
  <div style="background-color:${v2}"></div> \
  <div style="background-color:${v3}"></div> \
  </div></td> \
  <td class="answer"><input type="text" size="5"></td>\
  </tr>');

  var app = $.sammy(function() {
    this.element_selector = "#main";
    this.get('#/', function(context) {
    });


    this.get('#/resistor_quiz', function(context) {
      context.$element().empty();
      $('<form action="#/resistor_quiz" method="post"><table><tbody></tbody></table></form>').appendTo(context.$element());
      resistor_answers = [];
      for(var i = 0; i < 5; i++){
        var resistor = random_resistor();
        resistor_answers.push(resistor);
        var colors = ohms_to_colors(resistor);
        var table = context.$element().find("tbody");
        $.tmpl('resistor-question', {
          'v1': colors[0],
          'v2': colors[1],
          'v3': colors[2]}).appendTo(table);
      }
      $('<tr><td colspan="2"><input type="submit" value="Submit"></td></tr>').appendTo(table);
      $('tr:first input').focus();
    });

    this.post('#/resistor_quiz', function(context) {
      var index = 0;
      var correct = 0;
      $('.answer input').each(function(){
        var answer = resistor_answers[index];
        if(answer == text_to_ohms(this.value)){
          correct += 1;
        }
        index++;
      });
      context.$element().empty();
      $("<p>You got "+correct+" out of "+(index+1)+' correct. <a href="#/resistor_quiz">Play again</a> </p>').appendTo(context.$element());
    });
  });

  $(function() {
    app.run('#/');
  });


})(jQuery);


/*

$(function(){
  $('#start_resistor').click(function(){
    for(var i = 0; i < 10; i++){
      $.tmpl('shiny-resistor', {'v1': 'red', 'v2': 'blue', 'v3': 'green'}).appendTo("#resistor_panel");
    }

    $('#intro_panel').hide('blind');
    $('#resistor_panel').show('slide');
    return false;
  });
});
*/
