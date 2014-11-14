Rails.application.routes.draw do
  root 'home#index'

  resources :courses, only: [:index, :create, :destroy]
end
