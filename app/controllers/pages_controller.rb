class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
    @projects = Project.all
  end

  def donations
    @shipments = Shipment.includes(:scans).order(id: :desc)
    @donations = current_user.donations
  end
end
