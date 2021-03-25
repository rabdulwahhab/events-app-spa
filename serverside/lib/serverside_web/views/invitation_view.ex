defmodule ServersideWeb.InvitationView do
  use ServersideWeb, :view
  alias ServersideWeb.InvitationView

  require Logger

  def render("index.json", %{invitations: invitations}) do
    %{data: render_many(invitations, InvitationView, "invitation.json")}
  end

  def render("show.json", %{invitation: invitation}) do
    %{data: render_one(invitation, InvitationView, "invitation.json")}
  end

  def render("invite_resp.json", %{successes: successes, invalidEmails: invalidEmails, validEmailErrors: validEmailErrors}) do
    %{succeeded: successes, failed: invalidEmails, malformed: validEmailErrors}
  end

  def render("get_invites.json", %{invitations: invitations, stats: inviteStats}) do
    Logger.debug("Invit4es!!!")
    %{invitations: invitations, stats: inviteStats}
  end

  def render("invitation.json", %{invitation: invitation}) do
    %{id: invitation.id,
      response: invitation.response,
      email: invitation.email}
  end
end
