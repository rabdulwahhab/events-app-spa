defmodule Serverside.Entries do
  @moduledoc """
  The Entries context.
  """

  import Ecto.Query, warn: false
  alias Serverside.Repo

  alias Serverside.Entries.Entry
  alias Serverside.Comments.Comment
  alias Serverside.Comments
  alias Serverside.Users

  @doc """
  Returns the list of entries.

  ## Examples

      iex> list_entries()
      [%Entry{}, ...]

  """
  def list_entries do
    Repo.all(Entry, limit: 10)
    |> Repo.preload([:user])
  end

  @doc """
  Gets a single entry.

  Raises `Ecto.NoResultsError` if the Entry does not exist.

  ## Examples

      iex> get_entry!(123)
      %Entry{}

      iex> get_entry!(456)
      ** (Ecto.NoResultsError)

  """
  def get_entry!(id), do: Repo.get!(Entry, id)
  def get_entry(id), do: Repo.get(Entry, id)

  def get_and_load_entry!(id) do
    get_entry!(id)
    # source: https://hexdocs.pm/ecto/Ecto.Repo.html#c:preload/3
    |> Repo.preload([
      :user,
      :invitations,
      comments: from(c in Comment, order_by: [desc: c.updated_at])
    ])
    |> load_entry_comments()
  end

  def load_entry_comments(entry) do
    loadedComments =
      Enum.map(
        entry.comments,
        fn comm -> Comments.load_comment(comm) end
      )
    %{entry | comments: loadedComments}
  end

  def getEntryInvitationStats(entry) do
    Enum.reduce(
      entry.invitations,
      %{accepted: 0, declined: 0, none: 0},
      fn invit, acc ->
        case invit.response do
          1 -> %{acc | accepted: acc.accepted + 1}
          -1 -> %{acc | declined: acc.declined + 1}
          _ -> %{acc | none: acc.none + 1}
        end
      end
    )
  end

  def sanitize_comments(entry) do
    Map.put(entry, :comments, Enum.map(entry.comments, fn comm -> Comments.sanitize_comment(comm) end))
  end

  def sanitize_user(entry) do
    Map.put(entry, :user, Users.sanitize_user(entry.user))
  end

  @doc """
  Creates a entry.

  ## Examples

      iex> create_entry(%{field: value})
      {:ok, %Entry{}}

      iex> create_entry(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_entry(attrs \\ %{}) do
    %Entry{}
    |> Entry.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a entry.

  ## Examples

      iex> update_entry(entry, %{field: new_value})
      {:ok, %Entry{}}

      iex> update_entry(entry, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_entry(%Entry{} = entry, attrs) do
    entry
    |> Entry.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a entry.

  ## Examples

      iex> delete_entry(entry)
      {:ok, %Entry{}}

      iex> delete_entry(entry)
      {:error, %Ecto.Changeset{}}

  """
  def delete_entry(%Entry{} = entry) do
    Repo.delete(entry)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking entry changes.

  ## Examples

      iex> change_entry(entry)
      %Ecto.Changeset{data: %Entry{}}

  """
  def change_entry(%Entry{} = entry, attrs \\ %{}) do
    Entry.changeset(entry, attrs)
  end
end
