defmodule Monkeypad.Repo do
  use Ecto.Repo,
    otp_app: :monkeypad,
    adapter: Ecto.Adapters.Postgres
end
