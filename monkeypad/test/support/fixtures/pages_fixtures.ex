defmodule Monkeypad.PagesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Monkeypad.Pages` context.
  """

  @doc """
  Generate a unique page title.
  """
  def unique_page_title, do: "some title#{System.unique_integer([:positive])}"

  @doc """
  Generate a page.
  """
  def page_fixture(attrs \\ %{}) do
    {:ok, page} =
      attrs
      |> Enum.into(%{
        content: "some content",
        title: unique_page_title()
      })
      |> Monkeypad.Pages.create_page()

    page
  end
end
