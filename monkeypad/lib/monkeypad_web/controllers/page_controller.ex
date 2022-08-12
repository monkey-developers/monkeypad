defmodule MonkeypadWeb.PageController do
  use MonkeypadWeb, :controller

  alias Monkeypad.Pages
  alias Monkeypad.Pages.Page

  action_fallback MonkeypadWeb.FallbackController

  def index(conn, _params) do
    pages = Pages.list_pages()
    render(conn, "index.json", pages: pages)
  end

  def create(conn, %{"page" => page_params}) do
    with {:ok, %Page{} = page} <- Pages.create_page(page_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.page_path(conn, :show, page))
      |> render("show.json", page: page)
    end
  end

  def show(conn, %{"id" => id}) do
    page = Pages.get_page!(id)
    render(conn, "show.json", page: page)
  end

  def update(conn, %{"id" => id, "page" => page_params}) do
    page = Pages.get_page!(id)

    with {:ok, %Page{} = page} <- Pages.update_page(page, page_params) do
      render(conn, "show.json", page: page)
    end
  end

  def delete(conn, %{"id" => id}) do
    page = Pages.get_page!(id)

    with {:ok, %Page{}} <- Pages.delete_page(page) do
      send_resp(conn, :no_content, "")
    end
  end
end
