defmodule Serverside.Plugs.RequireAuth do
  import Plug.Conn

  require Logger
  alias Serverside.Users

  def init(opts), do: opts

  # This plug checks if EVERY request coming in (in contexts where
  # it is plugged in) has the appropriate HTTP auth headers.
  # Namely, if the client sent their valid token along with their
  # request
  def call(conn, _params) do
    # TODO get token from HTTP header, Phoenix.token.verify it, conn _assigns
    # whatever you want, and allow pass through. If error, error response and
    # halt
    Logger.debug("PLUG conn ---> #{inspect(conn)}")
    token = case get_req_header(conn, "x-auth") do
      [tok] -> tok
      _ -> nil
    end
    Logger.debug("PLUG token ---> #{inspect(token)}")
    unless token do
      conn
      |> send_resp(401, Jason.encode!(%{errors: ["Unauthorized"]}))
      |> halt()
    else
      # verify token.
      # NOTE we are passing back the salt used when signing as 2nd arg
      case Phoenix.Token.verify(conn, "hello user", token, max_age: 86400) do
        {:ok, user_id} ->
          conn
          |> assign(:currentUser, Users.get_user!(user_id))
        {:error, :expired} ->
          conn
          |> send_resp(401, Jason.encode!(%{
            errors: ["Unauthorized", "Token expired"]
            }))
          |> halt()
        {:error, :invalid} ->
          conn
          |> send_resp(401, Jason.encode!(%{
            errors: ["Unauthorized", "Token invalid"]
            }))
          |> halt()
        _ ->
          conn
          |> send_resp(400, Jason.encode!(%{errors: ["Bad token"]}))
          |> halt()
      end
    end
  end

end
