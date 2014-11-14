function liTemplate(id, input, details){
  return '<li class="course" data-details="' +
  details +
  '">' +
  input +
  '<span data-id="' + id + '"class="delete"> &times;</span></li>';
}

function detailsTemplate(details){
  return'<div class="details">' +
  details +
  '</div>';
}
function appendToUl(ul, item){
  ul.append(liTemplate(item.id, item.name, item.details));
}

$(document).ready(function(){
  $.getJSON('/courses.json', function(data){
    var $courses = $('.courses');
    data.forEach(function(item){
      appendToUl($courses, item);
    })
  })

  $('.courses').on('click', '.delete', function(event){
    var self = this;
    event.stopPropagation();
    var id = $(this).data('id');
    $.ajax({
      url: '/courses/' + id + ".json",
      type: "DELETE"
    }).done(function(data){
      $(self).parent('.course').remove();
    })
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

  $('#new-course').submit(function(event){
    event.preventDefault();
    var $form = $(this);
    var input = $form.find('.course-input').val();
    var details = $form.find('.course-details').val();
    $.post('/courses.json', {name: input, details: details}).done(function(result){
      $('.courses').append(liTemplate(result.id, result.name, result.details));
      $form.find('.course-input').val("");
      $form.find('.course-details').val("");
      $('.error').text("")
    }).fail(function(error){
      $('.error').text(error.responseJSON.error)
    })
  });
});
