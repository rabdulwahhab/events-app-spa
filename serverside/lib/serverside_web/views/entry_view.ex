defmodule ServersideWeb.EntryView do
  use ServersideWeb, :view
  alias ServersideWeb.EntryView

  require Logger

  # This is basically mapping `render_one show.html`
  # on all the entries. It is a convenience function.
  # Notice how rendering a JSON response is a trickle
  # down of render functions that ends in specifying
  # how to format output for one JSON response. This allows
  # You to sanitize the data you send back

  def render("index.json", %{entries: entries}) do
    %{data: render_many(entries, EntryView, "entry.json")}
  end

  def render("show.json", %{entry: entry}) do
    %{data: render_one(entry, EntryView, "entry.json")}
  end

  def render("entry.json", %{entry: entry}) do
    %{id: entry.id,
      owner_id: entry.user_id,
      name: entry.name,
      created_at: entry.inserted_at,
      description: entry.description,
      date: entry.date}
  end

  def render("show_full.json", %{entry: entry}) do
    basic_entry = render_one(entry, EntryView, "entry.json")
    entry_data =
      basic_entry
      |> Map.put(:user, sanitize_user(entry.user))
      |> Map.put(:comments, entry.comments)
    %{data: entry_data}
  end

  defp sanitize_user(user) do
    %{id: user.id, name: user.name}
  end

end
