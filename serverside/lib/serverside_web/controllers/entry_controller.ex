defmodule ServersideWeb.EntryController do
  use ServersideWeb, :controller

  # plug Serverside.Plugs.RequireAuth

  alias Serverside.Entries
  alias Serverside.Entries.Entry

  require Logger

  action_fallback ServersideWeb.FallbackController

  def index(conn, _params) do
    # TODO preload??
    entries = Entries.list_entries()
    render(conn, "index.json", entries: entries)
  end

  def create(conn, %{"entry" => entry_params}) do
    formattedParams =
      entry_params
      |> Map.put("date", convertToDateTime(entry_params["date"]))

    with {:ok, %Entry{} = entry} <- Entries.create_entry(formattedParams) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.entry_path(conn, :show, entry))
      |> render("show.json", entry: entry)
    end
  end

  defp convertToDateTime(dateStr) do
    formattedDateStr =
      dateStr
      |> String.replace(" ", "T")
      # correct ISO format
      |> (fn s -> "#{s}:00Z" end).()

    case DateTime.from_iso8601(formattedDateStr) do
      {:ok, dateTime, _} ->
        case DateTime.shift_zone(dateTime, "America/Chicago") do
          {:ok, shiftedDateTime} -> shiftedDateTime
          _ -> dateStr
        end

      _ ->
        dateStr
    end
  end

  def show(conn, %{"id" => id}) do
    entry =
      Entries.get_and_load_entry!(id)
      |> Entries.sanitize_comments()
      |> Entries.sanitize_user()
      |> Map.drop([:invitations])

    Logger.debug("Entry show: #{inspect(entry)}")
    render(conn, "show_full.json", entry: entry)
  end

  def update(conn, %{"id" => id, "entry" => entry_params}) do
    entry = Entries.get_entry!(id)

    with {:ok, %Entry{} = entry} <- Entries.update_entry(entry, entry_params) do
      render(conn, "show.json", entry: entry)
    end
  end

  def delete(conn, %{"id" => id}) do
    entry = Entries.get_entry!(id)

    with {:ok, %Entry{}} <- Entries.delete_entry(entry) do
      send_resp(conn, :no_content, "")
    end
  end
end
