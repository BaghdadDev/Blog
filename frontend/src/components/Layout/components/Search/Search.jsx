import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useMutation } from "@apollo/client";

import { SEARCH_POSTS } from "../../../../gql/post.jsx";
import SearchResult from "./SearchResult.jsx";
import { useLocation } from "react-router-dom";

function Search() {
  let idTimeOut = undefined;

  const location = useLocation();

  const [search, setSearch] = useState("");

  const [
    searchPosts,
    {
      loading: loadingSearchPosts,
      error: errorSearchPosts,
      data: dataSearchPosts,
    },
  ] = useMutation(SEARCH_POSTS);

  async function handleSearchPosts() {
    console.log("searching with: " + search);
    try {
      await searchPosts({ variables: { search: search } });
    } catch (errorHandlingSearchPosts) {}
  }

  useEffect(() => {
    if (search.length > 2) {
      idTimeOut = setTimeout(() => handleSearchPosts(), 1000);
    }
    return () => {
      clearTimeout(idTimeOut);
    };
  }, [search]);

  useEffect(() => {
    setSearch("");
  }, [location]);

  return (
    <form
      className={
        "absolute left-1/2 flex w-1/3 -translate-x-1/2 items-center rounded-lg bg-gray-200 p-2"
      }
    >
      <AiOutlineSearch className={"mr-2 h-4 w-4"} />
      <input
        type={"text"}
        placeholder={"Search post..."}
        className={
          "h-full w-full bg-transparent outline-none placeholder:italic"
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search.length > 2 ? (
        <SearchResult
          loadingSearchPosts={loadingSearchPosts}
          errorSearchPosts={errorSearchPosts}
          dataSearchPosts={dataSearchPosts}
        />
      ) : undefined}
    </form>
  );
}

export default Search;
