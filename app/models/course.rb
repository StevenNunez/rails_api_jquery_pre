class Course < ActiveRecord::Base
  validates :name, :details, presence: true
end
