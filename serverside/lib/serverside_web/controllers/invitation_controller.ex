defmodule ServersideWeb.InvitationController do
  use ServersideWeb, :controller

  alias Serverside.Invitations
  alias Serverside.Invitations.Invitation

  action_fallback ServersideWeb.FallbackController

  def index(conn, _params) do
    invitations = Invitations.list_invitations()
    render(conn, "index.json", invitations: invitations)
  end

  def create(conn, %{"invitation" => invitation_params}) do
    with {:ok, %Invitation{} = invitation} <- Invitations.create_invitation(invitation_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.invitation_path(conn, :show, invitation))
      |> render("show.json", invitation: invitation)
    end
  end

  def show(conn, %{"id" => id}) do
    invitation = Invitations.get_invitation!(id)
    render(conn, "show.json", invitation: invitation)
  end

  def update(conn, %{"id" => id, "invitation" => invitation_params}) do
    invitation = Invitations.get_invitation!(id)

    with {:ok, %Invitation{} = invitation} <- Invitations.update_invitation(invitation, invitation_params) do
      render(conn, "show.json", invitation: invitation)
    end
  end

  def delete(conn, %{"id" => id}) do
    invitation = Invitations.get_invitation!(id)

    with {:ok, %Invitation{}} <- Invitations.delete_invitation(invitation) do
      send_resp(conn, :no_content, "")
    end
  end
end
