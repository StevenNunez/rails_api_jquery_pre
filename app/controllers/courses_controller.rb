class CoursesController < ApplicationController
  def index
    respond_to do |format|
      format.json {render json: Course.all}
    end
  end

  def create
    course = Course.new(name: params[:name], details: params[:details])
    respond_to do |format|
      format.json do
        if course.save
          render json: course
        else
          render json: {error: "Your course failed to save"}, status: 400
        end
      end
    end
  end
end
