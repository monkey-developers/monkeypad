defmodule MonkeypadWeb.HomeLive do
  use MonkeypadWeb, :live_view
  alias MonkeypadWeb.HomeView
  require Logger

  def mount(_params, _session, socket) do
    {:ok, socket |> assign(query: "", results: %{})}
  end

  def handle_event("submit_room", %{"room_form" => %{"room_box" => room_name}}, socket) do
    {:noreply, socket |> push_redirect(to: "/" <> room_name)}
  end
end
