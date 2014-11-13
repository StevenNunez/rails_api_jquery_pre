function liTemplate(input, details){
  return '<li class="course" data-details="' +
  details +
  '">' +
  input +
  '</li>';
}

function detailsTemplate(details){
  return'<div class="details">' +
  details +
  '</div>';
}
function appendToUl(ul, item){
  ul.append(liTemplate(item.name, item.details));
}

$(document).ready(function(){
  $.getJSON('/courses.json', function(data){
    var $courses = $('.courses');
    data.forEach(function(item){appendToUl($courses, item);})
  })

  $('.courses').on('click', '.course', function(event){
    if($(this).find('.details').length === 0){
      var $li = $(this);
      var details = $li.data('details');
      $li.append(detailsTemplate(details));
    } else {
      $(this).find('.details').remove();
    }
  })

  $('.new-course input[type=submit]').click(function(){
    // From the submit button
    var $submitButton = $(this);
    // find the first input, assign its value to a variable
    var input = $submitButton.siblings('.course-input').val();
    // find the second input, assign its value to a variable
    var details = $submitButton.siblings('.course-details').val();
    //Add some html to the ul in the same format as the other list items
    $.post('/courses.json', {name: input, details: details}, function(result){
      $('.courses').append(liTemplate(input, details));
      $submitButton.siblings('.course-input').val("");
      $submitButton.siblings('.course-details').val("");
      $('.error').text("")
    }).fail(function(error){
      $('.error').text(error.responseJSON.error)
    })
  });
});
