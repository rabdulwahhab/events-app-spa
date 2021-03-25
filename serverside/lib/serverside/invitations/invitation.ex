defmodule Serverside.Invitations.Invitation do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invitations" do
    field(:email, :string)
    field(:response, :integer)

    belongs_to(:entry, Serverside.Entries.Entry)
    belongs_to(:user, Serverside.Users.User)

    timestamps()
  end

  @doc false
  def changeset(invitation, attrs) do
    invitation
    |> cast(attrs, [:response, :email, :entry_id, :user_id])
    |> validate_required([:email, :entry_id, :user_id])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:entry_id)
  end
end
