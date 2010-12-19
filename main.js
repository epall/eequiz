var RESISTOR_KEY = [
  ['black', '0', 'black'],
  ['brown', '1', 'brown'],
  ['red', '2', 'red'],
  ['orange', '3', 'orange'],
  ['yellow', '4', 'yellow'],
  ['green', '5', 'green'],
  ['blue', '6', 'blue'],
  ['violet', '7', 'violet'],
  ['gray', '8', 'gray'],
  ['white', '9', 'white']
]

var POWER_POSTFIXES = {
  'k': 3,
  'M': 6
}

function digit_color(digit){
  for(var i = 0; i < RESISTOR_KEY.length; i++){
    var row = RESISTOR_KEY[i];
    if(row[1] == digit){
      return row[2];
    }
  }
  return null;
}

function power_color(power){
  for(var i = 0; i < RESISTOR_KEY.length; i++){
    var row = RESISTOR_KEY[i];
    if(row[1] == power.length){
      return row[2];
    }
  }
  return null;
}

function power_to_multiplier(power){
  var multiplier = "1";
  for(var i = 0; i < power; i++){
    multiplier += "0";
  }
  return multiplier;
}

function ohms_to_colors(ohms){
  var str_ohms = ohms + "";
  var first_band = digit_color(str_ohms[0]);
  var second_band = digit_color(str_ohms[1]);
  var rest = str_ohms.substr(2);
  var third_band = power_color(rest);
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
  var value = 0;
  while(value < 10){
    value = Math.round(Math.random()*100);
    var power = Math.round(Math.random()*7);
    value = value * Math.pow(10, power);
  }
  return value;
}

function generate_key(){
  var key = $('#resistor_key tbody');
  for(var i = 0; i < RESISTOR_KEY.length; i++){
    var row = RESISTOR_KEY[i];
    var color = row[2];
    $('<tr><td style="background-color:'+color+'">'+row[0]+'</td> \
    <td style="background-color:'+color+'">'+row[1]+'</td> \
    <td style="background-color:'+color+'">'+row[1]+'</td> \
    <td style="background-color:'+color+'">x'+power_to_multiplier(row[1])+'</td> \
    </tr>').appendTo(key);
  }
}


(function($) {
  $.template('resistor-question', '<tr><td class="question"><div class="resistor"> \
  <div style="background-color:${v1}"></div> \
  <div style="background-color:${v2}"></div> \
  <div style="background-color:${v3}"></div> \
  </div></td> \
  <td class="answer"><input type="text" size="5"></td>\
  </tr>');

  app = $.sammy(function() {
    this.element_selector = "#main";
    this.get('#/', function(context) {
    });


    this.get('#/resistor_quiz', function(context) {
      generate_key();
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
          $('<td><img src="images/check.png"></td>').appendTo($(this).parents('tr'));
          correct += 1;
        } else {
          $('<td><img src="images/x.png"></td>').appendTo($(this).parents('tr'));
        }
        index++;
      });
      $("<p>You got "+correct+" out of "+index+' correct. <a href="javascript:app.runRoute(\'get\', \'#/resistor_quiz\')">Play again</a> </p>').appendTo(context.$element());
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
