defmodule ServersideWeb.EntryView do
  use ServersideWeb, :view
  alias ServersideWeb.EntryView

  def render("index.json", %{entries: entries}) do
    %{data: render_many(entries, EntryView, "entry.json")}
  end

  def render("show.json", %{entry: entry}) do
    %{data: render_one(entry, EntryView, "entry.json")}
  end

  def render("entry.json", %{entry: entry}) do
    %{id: entry.id,
      name: entry.name,
      description: entry.description,
      date: entry.date}
  end
end
