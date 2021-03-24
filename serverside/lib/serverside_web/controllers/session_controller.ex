defmodule ServersideWeb.SessionController do
  use ServersideWeb, :controller

  alias Serverside.Users

  require Logger

  action_fallback ServersideWeb.FallbackController

  # The auth flow here is based on the idea that in an SPA, clients
  # are only ever requesting data and not pages. Ergo, we don't need
  # strict sessions the way it would work when requesting a page
  # but rather an authentication token that will
  # allow them to verify themselves and get data (have access to the
  # server api).
  #
  # The 'session' here is a JSON Web Token (JWT) which is a signed
  # string made of a header, payload, and signature. Fortunately,
  # Phoenix can handle this by using our app secrets in the signing algo
  # (remember the salt in config?).
  #
  # Here, someone requesting a session (access to get resources from
  # the api), needs to be a registered user and then we give them a
  # token they can use in subsequent calls to the api. Unregistered users

  def create(conn, %{"email" => email, "password" => password}) do
    # if registered usercreate JWT and pass back
    case Users.authenticate(email, password) do
      # Generating a signed token here. Second arg is some more custom
      # salt which makes cracking more difficult. It will implicitly
      # add a signature date to the token which we can use to verify later.
      # MUST generate tokens with something unique (user id, etc).
      # can only sign on entities like sockets, conns, and endpoints
      {:ok, user} ->
        token = Phoenix.Token.sign(conn, "hello user", user.id)
        session = %{
          user_id: user.id,
          username: user.name,
          token: token
        }
        conn
        |> put_resp_header("Content-Type", "application/json")
        |> send_resp(200, Jason.encode!(session))
        _ ->
        conn
        |> put_resp_header("Content-Type", "application/json")
        |> send_resp(401, Jason.encode!(%{error: "auth failed"}))
    end
  end
end
