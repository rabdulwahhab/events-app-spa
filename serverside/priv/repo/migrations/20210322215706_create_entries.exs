defmodule Serverside.Repo.Migrations.CreateEntries do
  use Ecto.Migration

  def change do
    create table(:entries) do
      add(:name, :string, null: false)
      add(:description, :text, null: false)
      add(:date, :utc_datetime, null: false)
      add(:user_id, references(:users, on_delete: :nothing), null: false)

      timestamps()
    end

    create(index(:entries, [:user_id]))
  end
end
