defmodule Serverside.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field(:body, :string)

    belongs_to(:user, Serverside.Users.User)
    belongs_to(:entry, Serverside.Entries.Entry)

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :entry_id, :user_id])
    |> validate_required([:body, :entry_id, :user_id])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:entry_id)
  end
end
