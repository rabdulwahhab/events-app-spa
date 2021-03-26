defmodule Serverside.Plugs.RequireOwner do
  import Plug.Conn

  # NOTE plug me after requiring auth!!!!
  require Logger
  alias Serverside.{Entries, Users}

  def init(opts), do: opts

  def call(conn, %{entry_id: entry_id} = params) do
    # Require that the user is the owner of the resource (== entry.user_id)
    Logger.debug("RequireOwner PLUG ---> #{inspect(conn)}")
    user? = conn.assigns[:current_user]
    unless user? do
      conn
      |> send_resp(401, Jason.encode!(%{errors: ["Unauthorized"]}))
      |> halt()
    else
      entry? = Entries.get_entry(entry_id)
      unless entry? do
        conn
        |> send_resp(404, Jason.encode!(%{errors: ["Event not found"]}))
        |> halt()
      else
        unless entry?.user_id == user?.id do
          conn
          |> send_resp(403, Jason.encode!(%{errors: ["Forbidden"]}))
          |> halt()
        else
          conn
        end
      end
    end
  end

  def call(conn, %{user_id: user_id} = params) do
    # Require that the user is the owner of the resource (== entry.user_id)
    Logger.debug("RequireOwner PLUG ---> #{inspect(conn)}")
    user? = conn.assigns[:current_user]
    unless user? do
      conn
      |> send_resp(401, Jason.encode!(%{errors: ["Unauthorized"]}))
      |> halt()
    else
      user_resource? = Users.get_user(user_id)
      unless user_resource? do
        conn
        |> send_resp(404, Jason.encode!(%{errors: ["User not found"]}))
        |> halt()
      else
        unless user_resource?.id == user?.id do
          conn
          |> send_resp(403, Jason.encode!(%{errors: ["Forbidden"]}))
          |> halt()
        else
          conn
        end
      end
    end
  end

end
