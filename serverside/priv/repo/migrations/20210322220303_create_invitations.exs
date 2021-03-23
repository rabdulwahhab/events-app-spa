defmodule Serverside.Repo.Migrations.CreateInvitations do
  use Ecto.Migration

  def change do
    create table(:invitations) do
      add(:response, :integer, null: false, default: 0)
      add(:email, :string, null: false)
      add(:entry_id, references(:entries, on_delete: :nothing), null: false)
      add(:user_id, references(:users, on_delete: :nothing), null: false)

      timestamps()
    end

    create(index(:invitations, [:entry_id]))
    create(index(:invitations, [:user_id]))
  end
end
