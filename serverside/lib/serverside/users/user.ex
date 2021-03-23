defmodule Serverside.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:email, :string)
    field(:name, :string)
    field(:password_hash, :string)
    field(:photo_hash, :string)

    has_many(:entries, Events.Entries.Entry)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password_hash, :photo_hash])
    |> validate_required([:name, :email, :password_hash, :photo_hash])
    |> validate_length(:name, min: 2, max: 15)
    |> validate_length(:email, min: 6, max: 20)
    |> validate_format(:email, ~r/.+@.+\..+/)
  end
end
