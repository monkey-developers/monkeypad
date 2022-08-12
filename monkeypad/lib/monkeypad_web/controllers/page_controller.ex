defmodule MonkeypadWeb.PageController do
  use MonkeypadWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
