defmodule MonkeypadWeb.PageControllerTest do
  use MonkeypadWeb.ConnCase

  import Monkeypad.PagesFixtures

  alias Monkeypad.Pages.Page

  @create_attrs %{
    content: "some content",
    title: "some title"
  }
  @update_attrs %{
    content: "some updated content",
    title: "some updated title"
  }
  @invalid_attrs %{content: nil, title: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all pages", %{conn: conn} do
      conn = get(conn, Routes.page_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create page" do
    test "renders page when data is valid", %{conn: conn} do
      conn = post(conn, Routes.page_path(conn, :create), page: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.page_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "content" => "some content",
               "title" => "some title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.page_path(conn, :create), page: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update page" do
    setup [:create_page]

    test "renders page when data is valid", %{conn: conn, page: %Page{id: id} = page} do
      conn = put(conn, Routes.page_path(conn, :update, page), page: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.page_path(conn, :show, id))

      assert %{
               "id" => ^id,
               "content" => "some updated content",
               "title" => "some updated title"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, page: page} do
      conn = put(conn, Routes.page_path(conn, :update, page), page: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete page" do
    setup [:create_page]

    test "deletes chosen page", %{conn: conn, page: page} do
      conn = delete(conn, Routes.page_path(conn, :delete, page))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.page_path(conn, :show, page))
      end
    end
  end

  defp create_page(_) do
    page = page_fixture()
    %{page: page}
  end
end
