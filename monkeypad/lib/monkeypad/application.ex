defmodule Monkeypad.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Monkeypad.Repo,
      # Start the Telemetry supervisor
      MonkeypadWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Monkeypad.PubSub},
      # Start the Endpoint (http/https)
      MonkeypadWeb.Endpoint
      # Start a worker by calling: Monkeypad.Worker.start_link(arg)
      # {Monkeypad.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Monkeypad.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MonkeypadWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
