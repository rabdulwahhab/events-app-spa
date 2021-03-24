defmodule ServersideWeb.EntryView do
  use ServersideWeb, :view
  alias ServersideWeb.EntryView

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
    %{data: render_one(entry, EntryView, "full_entry.json")}
  end

  def render("entry.json", %{entry: entry}) do
    %{id: entry.id,
      owner_id: entry.user_id,
      owner: entry.user,
      name: entry.name,
      description: entry.description,
      date: entry.date}
  end

  def render("full_entry.json", %{entry: entry}) do
    basic_entry = render_one(entry, EntryView, "entry.json")
    entry_data =
      basic_entry
      |> Map.put(:comments, entry.comments)
      |> Map.put(:invitations, entry.invitations)
    %{data: entry_data}
  end

end
