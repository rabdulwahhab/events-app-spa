# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :serverside,
  ecto_repos: [Serverside.Repo]

# Configures the endpoint
config :serverside, ServersideWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "1gynOPXlc9m+95EYHdXXP5zP5hqbyUEkRbGPueFugjHeAcnGyWFiz98Ipto2SaHx",
  render_errors: [view: ServersideWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: Serverside.PubSub,
  live_view: [signing_salt: "KVWGgzNb"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
