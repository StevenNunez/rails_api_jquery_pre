'use strict';
function Courses(element){
  this.$element = $(element);
  this.all = []
  this.$element.on('click', '.course', $.proxy(this.handleDetailToggle, this))
}

Courses.prototype.handleDetailToggle = function(event){
  this.toggleDetailsFor($(event.target));
}

Courses.prototype.addCourse = function(name, details){
  var course = new Course(name, details);
  this.all.push(course);
  this.$element.append(course.template());
}

Courses.prototype.findCourseByName = function(name){
  var foundCourse;
  this.all.forEach(function(course){
    if (course.name === name){
      foundCourse = course
    }
  })
  return foundCourse;
}

Courses.prototype.showDetailsFor = function(el){
  var course = this.findCourseByName(el.text());
  el.append(course.detailsTemplate());
}

Courses.prototype.removeDetailsFor = function(el){
  el.find('.details').remove();
}

Courses.prototype.toggleDetailsFor = function(el){
  if(this.$element.find('.details').length === 0){
    this.showDetailsFor(el);
  } else {
    this.removeDetailsFor(el);
  }
}

Courses.prototype.getAll = function(){
  var self = this;
  $.getJSON('/courses.json', function(data){
    data.forEach(function(item){
      self.addCourse(item.name, item.details)
    })
  })
}

function Course(name, details){
  this.name = name ;
  this.details = details;
}

Course.prototype.template = function(){
  return '<li class="course" data-details="' +
  this.details +
  '">' +
  this.name +
  '</li>';
}

Course.prototype.detailsTemplate = function(){
  return'<div class="details">' +
  this.details +
  '</div>';
}

function CourseForm(form, courseList){
  this.$form = $(form);
  this.courseList = courseList;
  this.$form.submit($.proxy(this.submitHandler, this));
}

CourseForm.prototype.name = function(){
  return this.$form.find('.course-input').val();
}

CourseForm.prototype.details = function(){
  return this.$form.find('.course-details').val();
}

CourseForm.prototype.clear = function(){
  this.$form.find('.course-input').val("");
  this.$form.find('.course-details').val("");
  this.$form.find('.error').text("");
}

CourseForm.prototype.params = function(){
  return {
    name: this.name(),
    details: this.details()
  }
}

CourseForm.prototype.showError = function(error){
  this.$form.find('.error').text(error);
}

CourseForm.prototype.submitHandler = function(event){
  event.preventDefault();
  $.post('/courses.json', this.params(), function(result){
    this.courseList.addCourse(result.name, result.details);
    this.clear()
    return result;
  }.bind(this)).fail(function(error){
    this.showError(error.responseJSON.error);
  }.bind(this))
}

$(document).ready(function(){
  var courses = new Courses('.courses');
  courses.getAll();
  var form = new CourseForm(this, courses);
});
