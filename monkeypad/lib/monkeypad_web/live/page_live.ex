defmodule MonkeypadWeb.PageLive do
  use MonkeypadWeb, :live_view
  alias MonkeypadWeb.PageView
  alias Monkeypad.Pages
  require Logger

  def mount(%{"id" => page_id}, _session, socket) do
    topic = "room:" <> page_id

    if connected?(socket) do
      IO.inspect("Connected")
      MonkeypadWeb.Endpoint.subscribe(topic)
    end

    {:ok,
     socket
     |> assign(
       page_id: page_id,
       topic: topic,
       content: ''
     )}
  end

  def handle_event("change_page", %{"page_form" => %{"page_box" => content}}, socket) do
    MonkeypadWeb.Endpoint.broadcast(socket.assigns.topic, "page_updated", content)
    # Pages.change_page(%{ content: content })
    {:noreply, socket |> assign(content: content)}
  end

  def handle_info(%{event: "page_updated", payload: content}, socket) do
    content |> IO.inspect()
    {:noreply, socket |> assign(content: content)}
  end
end
