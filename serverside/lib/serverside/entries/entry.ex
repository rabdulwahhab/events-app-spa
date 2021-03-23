defmodule Serverside.Entries.Entry do
  use Ecto.Schema
  import Ecto.Changeset

  schema "entries" do
    field(:date, :utc_datetime)
    field(:description, :string)
    field(:name, :string)

    belongs_to(:user, Events.Users.User)
    has_many(:invitations, Events.Invitations.Invitation)
    has_many(:comments, Events.Comments.Comment)

    timestamps()
  end

  @doc false
  def changeset(entry, attrs) do
    entry
    |> cast(attrs, [:name, :description, :date, :user_id])
    |> validate_required([:name, :description, :date, :user_id])
    |> foreign_key_constraint(:user_id)
  end
end
