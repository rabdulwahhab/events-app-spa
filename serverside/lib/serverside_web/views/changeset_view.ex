defmodule ServersideWeb.ChangesetView do
  use ServersideWeb, :view

  require Logger

  @doc """
  Traverses and translates changeset errors.

  See `Ecto.Changeset.traverse_errors/2` and
  `ServersideWeb.ErrorHelpers.translate_error/1` for more details.
  """
  def translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
  end

  def render("error.json", %{changeset: changeset}) do
    # When encoded, the changeset returns its errors
    # as a JSON object. So we just pass it forward.
    Logger.debug(inspect(translate_errors(changeset)))
    %{errors: translate_errors(changeset)}
  end
end
