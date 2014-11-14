class CoursesController < ApplicationController
  def index
    render json: Course.all
  end

  def create
    course = Course.new(name: params[:name], details: params[:details])
    if course.save
      render json: course
    else
      render json: {error: "Your course failed to save"}, status: 400
    end
  end

  def destroy
    course = Course.find(params[:id])
    course.destroy
    render json: course
  end
end
