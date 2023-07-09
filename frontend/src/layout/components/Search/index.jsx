import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useMutation } from "@apollo/client";

import { SEARCH_POSTS } from "../../../gql/post.jsx";
import SearchResult from "./SearchResult.jsx";
import { useLocation } from "react-router-dom";

function Search() {
  const ref = useRef();

  let idTimeOut = undefined;

  const location = useLocation();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [
    searchPosts,
    {
      loading: loadingSearchPosts,
      error: errorSearchPosts,
      data: dataSearchPosts,
    },
  ] = useMutation(SEARCH_POSTS);

  async function handleSearchPosts() {
    !open && setOpen(true);
    try {
      await searchPosts({ variables: { search: search } });
    } catch (errorHandlingSearchPosts) {}
  }

  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      console.log("Click outside of search");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (search.length > 2) {
      idTimeOut = setTimeout(() => handleSearchPosts(), 1000);
    }
    return () => {
      clearTimeout(idTimeOut);
    };
  }, [search]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [open]);

  return (
    <form
      ref={ref}
      className={
        "absolute left-1/2 flex h-[calc(100%_-_20px)] w-[60%] -translate-x-1/2 items-center rounded-lg bg-slate-100 p-2 transition-all md:max-w-lg"
      }
    >
      <AiOutlineSearch className={"mr-2 h-6 w-6 text-slate-800"} />
      <input
        type={"text"}
        placeholder={"Search post..."}
        className={
          "h-full w-full bg-transparent text-slate-800 outline-none placeholder:italic"
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {open ? (
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
