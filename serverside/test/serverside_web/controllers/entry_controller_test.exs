defmodule ServersideWeb.EntryControllerTest do
  use ServersideWeb.ConnCase

  alias Serverside.Entries
  alias Serverside.Entries.Entry

  @create_attrs %{
    date: "2010-04-17T14:00:00Z",
    description: "some description",
    name: "some name"
  }
  @update_attrs %{
    date: "2011-05-18T15:01:01Z",
    description: "some updated description",
    name: "some updated name"
  }
  @invalid_attrs %{date: nil, description: nil, name: nil}

  def fixture(:entry) do
    {:ok, entry} = Entries.create_entry(@create_attrs)
    entry
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all entries", %{conn: conn} do
      conn = get(conn, Routes.entry_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create entry" do
    test "renders entry when data is valid", %{conn: conn} do
      conn = post(conn, Routes.entry_path(conn, :create), entry: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.entry_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2010-04-17T14:00:00Z",
               "description" => "some description",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.entry_path(conn, :create), entry: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update entry" do
    setup [:create_entry]

    test "renders entry when data is valid", %{conn: conn, entry: %Entry{id: id} = entry} do
      conn = put(conn, Routes.entry_path(conn, :update, entry), entry: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.entry_path(conn, :show, id))

      assert %{
               "id" => id,
               "date" => "2011-05-18T15:01:01Z",
               "description" => "some updated description",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, entry: entry} do
      conn = put(conn, Routes.entry_path(conn, :update, entry), entry: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete entry" do
    setup [:create_entry]

    test "deletes chosen entry", %{conn: conn, entry: entry} do
      conn = delete(conn, Routes.entry_path(conn, :delete, entry))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.entry_path(conn, :show, entry))
      end
    end
  end

  defp create_entry(_) do
    entry = fixture(:entry)
    %{entry: entry}
  end
end
