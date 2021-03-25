defmodule ServersideWeb.InvitationController do
  use ServersideWeb, :controller

  alias Serverside.Invitations
  alias Serverside.Invitations.Invitation
  alias Serverside.Users
  alias Serverside.Entries

  require Logger

  action_fallback ServersideWeb.FallbackController

  # def index(conn, %{"entry_id" => entry_id}) do
  #   conn
  #   |> send_resp(403, Jason.encode!(%{errors: ["Unauthorized"]}))
  #   # invitations = Invitations.list_invitations()
  #   # render(conn, "index.json", invitations: invitations)
  # end

  def index(conn, %{"entry_id" => entry_id}) do
    entry = Entries.get_and_load_entry!(entry_id)
    inviteStats = Entries.getEntryInvitationStats(entry)
    invitations = Invitations.get_event_invites(entry_id)
    Logger.debug("#{inspect(inviteStats)}, #{inspect(invitations)}")
    conn
    |> put_status(200)
    |> render("get_invites.json", invitations: invitations, stats: inviteStats)
  end

  # TODO fix for responding
  # def update(conn, %{"entry_id" => entry_id, "id" => invit_id} = params) do
  #   %{"invitation" => %{"response" => resp}} = params
#
  #   unless Enum.member?(["1", "-1", "0"], resp) do
  #     conn
  #     |> put_flash(:error, "That response couldn't be recognized")
  #   else
  #     invitation = Invitations.get_invitation!(invit_id)
  #     attrs = %{"response" => String.to_integer(resp)}
#
  #     case Invitations.update_invitation(invitation, attrs) do
  #       {:ok, _} ->
  #         conn
  #         |> put_flash(:info, "Your response has been recorded")
  #         |> redirect(to: Routes.entry_path(conn, :show, entry_id))
#
  #       {:error, %Ecto.Changeset{} = _changeset} ->
  #         conn
  #         |> put_flash(:error, "Your response couldn't be recorded")
  #     end
  #   end
  # end

  def validEmail?(str) do
    # rough email validation
    String.match?(str, ~r/((^[@]|[\.]|\w)+)@(.+)/)
  end

  def parseEmails(str) do
    potentialEmails =
      str
      |> String.split(~r/,/, trim: true)
      |> Enum.map(fn s -> String.trim(s) end)
      |> Enum.uniq()

    validEmails = Enum.filter(potentialEmails, fn e -> validEmail?(e) end)
    invalidEmails = Enum.reject(potentialEmails, fn e -> validEmail?(e) end)
    {validEmails, invalidEmails}
  end

  def createInvitations(entry_id, validEmails) do
    Enum.reduce(
      validEmails,
      [],
      fn email, acc ->
        user? = Users.getUserByEmail(email)

        userAttrs =
          if user? do
            %{"user_id" => user?.id}
          else
            # create user if non-existent
            case Users.create_user(%{"email" => email, "name" => "---", "password_hash" => "default"}) do
              # use placeholder name
              {:ok, user} ->
                %{"user_id" => user.id}

              {:error, changeset} ->
                %{"user_id" => -1}
                # fatal error. will cause email to be caught
                # as 'bad invite' in creation step because of
                # an added foreign_key_constraint on invitations
            end
          end

        attrs = Map.merge(%{"entry_id" => entry_id, "email" => email}, userAttrs)

        case Invitations.create_invitation(attrs) do
          {:ok, invitation} -> acc
          {:error, %Ecto.Changeset{} = _changeset} -> [email | acc]
        end
      end
    )
  end

  defp successfulInvitations(validEmails, validEmailErrors) do
    validSet = MapSet.new(validEmails)
    invalidSet = MapSet.new(validEmailErrors)

    MapSet.difference(validSet, invalidSet)
    |> MapSet.to_list()
  end

  def create(conn, %{"invitations" => invite_params}) do
    {validEmails, invalidEmails} = parseEmails(invite_params["emails"])
    validEmailErrors = createInvitations(String.to_integer(invite_params["entry_id"]), validEmails)
    successes = successfulInvitations(validEmails, validEmailErrors)

    [numInvalid, numFailed] = [
      Enum.count(invalidEmails),
      Enum.count(validEmailErrors)
    ]

    conn = if numInvalid > 0 || numFailed > 0 do
      put_status(conn, :unprocessable_entity)
    else
      put_status(conn, :created)
    end

    conn
    |> render("invite_resp.json", successes: successes, invalidEmails: invalidEmails, validEmailErrors: validEmailErrors)

  end

  def show(conn, %{"id" => id}) do
    invitation = Invitations.get_invitation!(id)
    render(conn, "show.json", invitation: invitation)
  end

  # def update(conn, %{"id" => id, "invitation" => invitation_params}) do
  #   invitation = Invitations.get_invitation!(id)
#
  #   with {:ok, %Invitation{} = invitation} <- Invitations.update_invitation(invitation, invitation_params) do
  #     render(conn, "show.json", invitation: invitation)
  #   end
  # end

  def delete(conn, %{"id" => id}) do
    invitation = Invitations.get_invitation!(id)

    with {:ok, %Invitation{}} <- Invitations.delete_invitation(invitation) do
      send_resp(conn, :no_content, "")
    end
  end
end
