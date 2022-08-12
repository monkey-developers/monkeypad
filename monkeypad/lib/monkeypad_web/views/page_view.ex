defmodule MonkeypadWeb.PageView do
  use MonkeypadWeb, :view
  alias MonkeypadWeb.PageView

  def render("index.json", %{pages: pages}) do
    %{data: render_many(pages, PageView, "page.json")}
  end

  def render("show.json", %{page: page}) do
    %{data: render_one(page, PageView, "page.json")}
  end

  def render("page.json", %{page: page}) do
    %{
      id: page.id,
      title: page.title,
      content: page.content
    }
  end
end
