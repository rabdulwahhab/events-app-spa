defmodule ServersideWeb.Router do
  use ServersideWeb, :router


  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api/v1", ServersideWeb do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
    resources "/entries", EntryController, except: [:new, :edit] do
      resources "/comments", CommentController, except: [:new, :edit]
      resources "/invitations", InvitationController, except: [:new, :edit]
    end
    resources "/session", SessionController, only: [:create]
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through [:fetch_session, :protect_from_forgery]
      live_dashboard "/dashboard", metrics: ServersideWeb.Telemetry
    end
  end
end
